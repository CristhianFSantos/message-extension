import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'me-change-language',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NzSelectModule, FormsModule, TranslocoModule],
  template: ` <nz-select
    [ngModel]="EnumLanguage.EN"
    (ngModelChange)="changeLanguage($event)"
  >
    <nz-option [nzValue]="EnumLanguage.EN" nzLabel="EN"></nz-option>
    <nz-option [nzValue]="EnumLanguage.PT" nzLabel="PT"></nz-option>
  </nz-select>`,
})
export class ChangeLanguageComponent {
  readonly translocoService = inject(TranslocoService);
  readonly EnumLanguage = EnumLanguage;

  changeLanguage = (language: EnumLanguage) =>
    this.translocoService.setActiveLang(language);
}

export enum EnumLanguage {
  EN = 'en',
  PT = 'pt',
}
