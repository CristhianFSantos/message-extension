import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
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
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { StorageService, UserConfig } from 'src/app/services/storage.service';
import { UtilityService } from 'src/app/services/utils.service';
import { UserConfigForm } from './config.models';

@Component({
  selector: 'me-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NzInputModule,
    TranslocoModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule,
    NzNotificationModule,
    NzDividerModule,
  ],
})
export class ConfigComponent implements OnInit {
  private readonly utilityService = inject(UtilityService);
  private readonly storageService = inject(StorageService);
  private readonly translocoService = inject(TranslocoService);

  patternTextPlaceholder = '[$1][$2][$3] $4';
  messageExample = '';

  formConfig: FormGroup<UserConfigForm>;
  @Output() changeTab = new EventEmitter<number>();

  ngOnInit(): void {
    this.initForm();
    this.observeForm();
  }

  initForm(): void {
    this.formConfig = new FormGroup<UserConfigForm>({
      alwaysCustomFormat: new FormControl<boolean>(false),
      allFieldsRequired: new FormControl<boolean>(true),
      autoSave: new FormControl<boolean>(false),
      pattern: new FormControl<string>('', [
        Validators.pattern(/\$(1|2|3|4)/),
        Validators.maxLength(25),
      ]),
    });
  }

  observeForm(): void {
    this.formConfig.controls.pattern.valueChanges.subscribe((value: any) => {
      this.messageExample = this.utilityService.buildMessage(value, {
        type: this.translocoService
          .translate('labels.msg002')
          .toLocaleLowerCase(),
        scope: this.translocoService
          .translate('labels.msg003')
          .toLocaleLowerCase(),
        identifier: this.translocoService
          .translate('labels.msg001')
          .toLocaleLowerCase(),
        subject: this.translocoService
          .translate('labels.msg004')
          .toLocaleLowerCase(),
      });
    });
  }

  save(): void {
    const userConfig = this.formConfig.value as UserConfig;
    this.storageService.post(userConfig).then(() => {
      this.utilityService.eventNotifier$$.next();
    });
    this.changeTab.emit(0);
    this.utilityService.showNotificationSuccess('success.msg002');
  }
}
