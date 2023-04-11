import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AppComponent } from './app.component';

import { TranslocoService } from '@ngneat/transloco';
import { ChangeLanguageComponent } from './components/change-language/change-language.component';
import { FormMessageComponent } from './components/form-message/form-message.component';
import { initTransloco, TranslocoRootModule } from './transloco-root.module';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslocoRootModule,
    ChangeLanguageComponent,
    FormMessageComponent,
    NzTabsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: APP_INITIALIZER,
      useFactory: initTransloco,
      deps: [TranslocoService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
