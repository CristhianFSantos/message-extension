import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, takeUntil } from 'rxjs';
import { StorageService, UserConfig } from 'src/app/services/storage.service';
import { UtilityService } from 'src/app/services/utils.service';
import { OPTIONS_TYPE } from './form-message.const';
import { FormMessage, Message, OptionsType } from './form-message.models';
@Component({
  selector: 'me-form-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NzInputModule,
    TranslocoModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzInputNumberModule,
    NzSelectModule,
    NzCheckboxModule,
    NzIconModule,
    NzNotificationModule,
  ],
  templateUrl: './form-message.component.html',
  styleUrls: ['./form-message.component.scss'],
})
export class FormMessageComponent implements OnInit, OnDestroy {
  @ViewChild('messageCommitTemplateRef')
  messageCommitTemplateRef: ElementRef<HTMLTextAreaElement>;
  private readonly translocoService = inject(TranslocoService);
  private readonly storageService = inject(StorageService);
  private readonly utilityService = inject(UtilityService);

  notifier$$ = new Subject<void>();

  listOptionsType: OptionsType[];
  formMessage: FormGroup<FormMessage>;
  messageCommit = '';
  userConfig: UserConfig | null = null;
  isFieldsRequired = true;

  ngOnInit(): void {
    this.listOptionsType = OPTIONS_TYPE;
    this.initFormMessage();
    this.loadUserConfig();
    this.observerNotifications();
    this.tryGetIdWorkItemAzureDevops();
    this.tryGetIdIssueGitHub();
  }

  ngOnDestroy(): void {
    this.notifier$$.next();
    this.notifier$$.complete();
  }

  async generateMessage(): Promise<void> {
    const translateTypeLabel = OPTIONS_TYPE.find(
      (option) => option.value === this.formMessage.controls.type.value
    )?.label as string;

    const message: Message = {
      identifier: `${this.formMessage.controls.identifier.value}`,
      type: this.translocoService.translate(translateTypeLabel),
      scope: `${this.formMessage.controls.scope.value}`,
      subject: `${this.formMessage.controls.subject.value}`,
    };

    const pattern = this.formMessage.controls.customPattern.value
      ? this.userConfig?.pattern ?? this.utilityService.universalPattern
      : this.utilityService.universalPattern;

    this.messageCommit = this.utilityService
      .buildMessage(pattern, message)
      .toLocaleLowerCase();

    this.copyMessageCommit();
    this.utilityService.showNotificationSuccess('success.msg001');
  }

  copyMessageCommit(): void {
    setTimeout(() => {
      this.messageCommitTemplateRef.nativeElement.focus();
      this.messageCommitTemplateRef.nativeElement.select();
      document.execCommand('copy');
    }, 100);
  }

  private tryGetIdWorkItemAzureDevops(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs) {
        const extractWorkItemNumberFromUrl = (url: string): number | null => {
          const pattern = /workitem=(\d+)/;
          const match = url.match(pattern);
          return match ? Number(match[1]) : null;
        };

        const extractWorkItemNumberFromEditUrl = (
          url: string
        ): number | null => {
          const pattern = /\/edit\/(\d+)/;
          const match = url.match(pattern);
          return match ? Number(match[1]) : null;
        };

        const workItemNumber =
          extractWorkItemNumberFromUrl(tabs[0]['url'] ?? '') ??
          extractWorkItemNumberFromEditUrl(tabs[0]['url'] ?? '') ??
          0;

        if (workItemNumber && !this.formMessage.controls.identifier.value) {
          this.formMessage.controls.identifier.setValue(workItemNumber);
          this.formMessage.controls.identifier.updateValueAndValidity();
        }
      }
    });
  }

  private tryGetIdIssueGitHub(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs) {
        const extractIssueNumberFromUrl = (url: string): number | null => {
          const pattern = /issues\/(\d+)/;
          const match = url.match(pattern);
          return match ? Number(match[1]) : null;
        };

        const issueNumber =
          extractIssueNumberFromUrl(tabs[0]['url'] ?? '') ?? 0;

        if (issueNumber && !this.formMessage.controls.identifier.value) {
          this.formMessage.controls.identifier.setValue(issueNumber);
          this.formMessage.controls.identifier.updateValueAndValidity();
        }
      }
    });
  }

  private async loadUserConfig(): Promise<void> {
    const userConfig =
      (await this.storageService.getUserConfig()) as UserConfig | null;

    if (!userConfig) return;
    this.userConfig = userConfig;

    this.isFieldsRequired = this.userConfig.allFieldsRequired;

    this.formMessage.controls.customPattern.enable();
    this.formMessage.controls.customPattern.setValue(
      this.userConfig.alwaysCustomFormat
    );

    this.applyConditionalRequiredValidator(
      this.userConfig.allFieldsRequired,
      this.formMessage
    );
  }

  private initFormMessage(): void {
    this.formMessage = new FormGroup<FormMessage>({
      identifier: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      scope: new FormControl(null, Validators.required),
      subject: new FormControl(null, Validators.required),
      customPattern: new FormControl({
        value: false,
        disabled: true,
      }),
    });
  }

  private applyConditionalRequiredValidator(
    isRequired: boolean,
    form: FormGroup<FormMessage>
  ): void {
    const validators = isRequired ? [Validators.required] : [];
    form.controls.identifier.setValidators([...validators]);
    form.controls.type.setValidators([...validators]);
    form.controls.scope.setValidators([...validators]);
    form.controls.subject.setValidators([...validators]);
    form.controls.identifier.updateValueAndValidity();
    form.controls.type.updateValueAndValidity();
    form.controls.scope.updateValueAndValidity();
    form.controls.subject.updateValueAndValidity();
  }

  private observerNotifications(): void {
    this.utilityService.eventNotifier$
      .pipe(takeUntil(this.notifier$$))
      .subscribe(() => {
        this.formMessage.reset();
        this.messageCommit = '';
        this.loadUserConfig();
      });
  }
}
