import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  ChangeLanguageComponent,
  EnumLanguage,
} from './change-language.component';

describe('ChangeLanguageComponent', () => {
  let component: ChangeLanguageComponent;
  let fixture: ComponentFixture<ChangeLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeLanguageComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ChangeLanguageComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should set the active language', () => {
    const mockLanguage = EnumLanguage.PT;
    const translocoServiceSpy = spyOn(
      component.translocoService,
      'setActiveLang'
    );
    component.changeLanguage(mockLanguage);
    expect(translocoServiceSpy).toHaveBeenCalledWith(mockLanguage);
  });
});
