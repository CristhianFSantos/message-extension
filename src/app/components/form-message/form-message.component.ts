import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { OPTIONS_TYPE } from './form-message.const';
import { CommitType, FormMessage, OptionsType } from './form-message.models';
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
export class FormMessageComponent implements OnInit {
  @ViewChild('messageCommitTemplateRef')
  messageCommitTemplateRef: ElementRef<HTMLTextAreaElement>;
  private readonly translocoService = inject(TranslocoService);
  private readonly nzNotificationService = inject(NzNotificationService);
  listOptionsType: OptionsType[];
  formMessage: FormGroup;
  messageCommit = '';

  ngOnInit(): void {
    this.listOptionsType = OPTIONS_TYPE;
    this.initFormMessage();
  }

  generateMessage(): void {
    this.messageCommit = this.formMessage.controls['customPattern'].value
      ? this.buildCustomFormMessage(this.formMessage)
      : this.buildDefaultFormMessage(this.formMessage);

    this.nzNotificationService.success(
      '',
      this.translocoService.translate('success.msg001'),
      {
        nzPlacement: 'top',
        nzDuration: 4000,
      }
    );

    this.copyMessageCommit();
  }

  copyMessageCommit(): void {
    setTimeout(() => {
      this.messageCommitTemplateRef.nativeElement.focus();
      this.messageCommitTemplateRef.nativeElement.select();
      document.execCommand('copy');
    }, 100);
  }

  private initFormMessage(): void {
    this.formMessage = new FormGroup({
      identifier: new FormControl<number | null>(null, Validators.required),
      type: new FormControl<CommitType | null>(null, Validators.required),
      scope: new FormControl<string | null>(null, Validators.required),
      subject: new FormControl<string | null>(null, Validators.required),
      customPattern: new FormControl<boolean>(false),
    });
  }

  private buildDefaultFormMessage(form: FormGroup): string {
    const formMessage = this.buildObjectMessage(form);
    return `${formMessage.type}(${formMessage.scope}): ${formMessage.subject}\n#${formMessage.identifier}`.toLocaleLowerCase();
  }

  private buildCustomFormMessage(form: FormGroup): string {
    const formMessage = this.buildObjectMessage(form);
    return `[${formMessage.identifier}][${formMessage.type}][${formMessage.scope}] ${formMessage.subject}`.toLocaleLowerCase();
  }

  private buildObjectMessage(form: FormGroup): FormMessage {
    const formMessage: FormMessage = {
      ...form.value,
    };

    const label = OPTIONS_TYPE.find(
      (option) => option.value === form.value.type
    )?.label as string;

    return {
      ...formMessage,
      type: this.translocoService.translate(label),
    };
  }
}
