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
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { SortListPipe } from 'src/app/pipes/sort-list.pipe';
import { StorageService, UserConfig } from 'src/app/services/storage.service';
import { UtilityService } from 'src/app/services/utils.service';
import { GET_LABEL_BY_VALUE, OPTIONS_TYPE } from './form-message.const';
import {
  CommitType,
  FormMessage,
  Message,
  OptionsType,
} from './form-message.models';
@Component({
  selector: 'me-form-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SortListPipe,
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
    NzToolTipModule,
    NzPopoverModule,
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

  private readonly universalPattern = this.utilityService.universalPattern;

  notifier$$ = new Subject<void>();
  listOptionsType: OptionsType[];
  formMessage: FormGroup<FormMessage>;
  messageCommit = '';
  userConfig: UserConfig | null = null;
  isFieldsRequired = true;

  ngOnInit(): void {
    this.initFormMessage();
    this.loadUserConfig();
    this.observerNotifications();
    this.lazyLoadListOptionsType();
    this.tryLoadLastMessage();
    this.tryGetIdentifierFromUrl();
  }

  ngOnDestroy(): void {
    this.notifier$$.next();
    this.notifier$$.complete();
  }

  async generateMessage(): Promise<void> {
    const pattern = this.formMessage.controls.customPattern.value
      ? this.userConfig?.pattern ?? this.universalPattern
      : this.universalPattern;

    const message = this.toMessage(this.formMessage);

    this.messageCommit = this.utilityService.buildMessage(pattern, message);

    this.userConfig?.saveLastMessage &&
      this.storageService.postLastMessage(this.messageCommit);

    this.copyMessageCommit();
  }

  copyMessageCommit(): void {
    setTimeout(() => {
      this.messageCommitTemplateRef.nativeElement.focus();
      this.messageCommitTemplateRef.nativeElement.select();
      document.execCommand('copy');
      this.utilityService.showNotification('success.msg001', 'success');
    }, 100);
  }

  private async tryLoadLastMessage() {
    const lastMessage = (await this.storageService.getLastMessage()) as
      | string
      | null;

    if (
      lastMessage &&
      this.messageCommit === '' &&
      this.userConfig?.saveLastMessage
    ) {
      this.messageCommit = lastMessage;
    }
  }

  private lazyLoadListOptionsType(): void {
    this.translocoService.selectTranslation().subscribe(() => {
      this.listOptionsType = OPTIONS_TYPE.map((option) => {
        return {
          ...option,
          label: this.translocoService.translate(option.label),
        };
      });
    });
  }

  private tryGetIdentifierFromUrl(): void {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs) return;
      const url = tabs[0]['url'] ?? '';

      const issueNumber =
        this.utilityService.extractIssueNumberFromGitHubUrl(url);

      const workItemNumber =
        this.utilityService.extractWorkItemNumberFromAzureUrl(url);

      const identifier = workItemNumber || issueNumber || null;

      if (identifier && !this.formMessage.controls.identifier.value) {
        this.formMessage.controls.identifier.setValue(identifier);
        this.formMessage.controls.identifier.updateValueAndValidity();
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

  private toMessage(formGroup: FormGroup<FormMessage>): Message {
    const controls = formGroup.controls;
    return {
      identifier: `${controls.identifier.value ?? ''}`,
      type:
        this.translocoService.translate(
          GET_LABEL_BY_VALUE(controls.type.value as CommitType)
        ) ?? '',
      scope: controls.scope.value ?? '',
      subject: controls.subject.value ?? '',
    };
  }
}
