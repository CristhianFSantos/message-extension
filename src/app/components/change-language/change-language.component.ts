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
    [ngModel]="EnumLanguge.EN"
    (ngModelChange)="changeLanguage($event)"
  >
    <nz-option [nzValue]="EnumLanguge.EN" nzLabel="EN"></nz-option>
    <nz-option [nzValue]="EnumLanguge.PT" nzLabel="PT"></nz-option>
  </nz-select>`,
})
export class ChangeLanguageComponent {
  readonly translocoService = inject(TranslocoService);
  readonly EnumLanguge = EnumLanguge;

  changeLanguage = (language: EnumLanguge) =>
    this.translocoService.setActiveLang(language);
}

export enum EnumLanguge {
  EN = 'en',
  PT = 'pt',
}
