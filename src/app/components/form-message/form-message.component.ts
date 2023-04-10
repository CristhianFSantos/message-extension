import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommitType, OptionsType } from './form-message.models';
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
  ],
  templateUrl: './form-message.component.html',
  styleUrls: ['./form-message.component.scss'],
})
export class FormMessageComponent implements OnInit {
  listOptionsType: OptionsType[];
  formMessage: FormGroup;
  messageCommit = '';

  ngOnInit(): void {
    this.listOptionsType = this.buildOptionsType();
    this.initFormMessage();
  }

  generateMessage(): void {
    this.messageCommit = JSON.stringify(this.formMessage.value);
    this.copyMessageCommit();
  }

  copyMessageCommit(): void {
    //TODO: copy to clipboard
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

  private buildOptionsType(): OptionsType[] {
    return [
      { label: 'description.msg002', value: CommitType.Feat },
      { label: 'description.msg003', value: CommitType.Fix },
      { label: 'description.msg004', value: CommitType.Docs },
      { label: 'description.msg005', value: CommitType.Style },
      { label: 'description.msg006', value: CommitType.Refactor },
      { label: 'description.msg007', value: CommitType.Perf },
      { label: 'description.msg008', value: CommitType.Chore },
      { label: 'description.msg009', value: CommitType.Test },
      { label: 'description.msg010', value: CommitType.Build },
      { label: 'description.msg011', value: CommitType.Ci },
      { label: 'description.msg012', value: CommitType.Revert },
    ];
  }
}
