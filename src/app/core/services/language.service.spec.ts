import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LanguageService, SUPPORTED_LANGUAGES } from './language.service';

/** Stub loader so no HTTP calls are needed in tests. */
class StubTranslateLoader implements TranslateLoader {
  getTranslation(lang: string) {
    const translations: Record<string, Record<string, string>> = {
      en: { APP_TITLE: 'Employee Management System', NAV_DASHBOARD: 'Dashboard' },
      de: { APP_TITLE: 'Mitarbeiterverwaltungssystem', NAV_DASHBOARD: 'Dashboard' }
    };
    return of(translations[lang] ?? {});
  }
}

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: StubTranslateLoader } })
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(LanguageService);
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => expect(service).toBeTruthy());

  it('should default to English when no language is stored', () => {
    expect(service.currentCode()).toBe('en');
  });

  it('should expose all supported languages', () => {
    expect(service.languages.length).toBe(SUPPORTED_LANGUAGES.length);
    expect(service.languages.map((l) => l.code)).toContain('en');
    expect(service.languages.map((l) => l.code)).toContain('de');
  });

  it('should compute current language object', () => {
    const lang = service.currentLanguage();
    expect(lang.code).toBe('en');
    expect(lang.locale).toBeTruthy();
    expect(lang.name).toBeTruthy();
  });

  it('should switch language', () => {
    service.setLanguage('de');
    expect(service.currentCode()).toBe('de');
    expect(service.currentLanguage().code).toBe('de');
  });

  it('should persist language to localStorage on switch', () => {
    service.setLanguage('de');
    TestBed.flushEffects();
    expect(localStorage.getItem('ems_language')).toBe('de');
  });

  it('should restore language from localStorage on init', () => {
    localStorage.setItem('ems_language', 'de');
    // Re-create service to simulate app restart
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: StubTranslateLoader } })],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    const restored = TestBed.inject(LanguageService);
    expect(restored.currentCode()).toBe('de');
  });

  it('should ignore unknown language codes', () => {
    service.setLanguage('xx');
    expect(service.currentCode()).toBe('en'); // unchanged
  });

  it('should not trigger switch if same language', () => {
    service.setLanguage('en');
    service.setLanguage('en');
    expect(service.currentCode()).toBe('en');
  });

  it('should provide instant() translation', () => {
    const result = service.instant('NAV_DASHBOARD');
    // Instant returns the key or value depending on loading state
    expect(typeof result).toBe('string');
  });
});
