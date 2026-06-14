import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '@core/services/theme.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { ToastService } from '@core/services/toast.service';
import { DialogService } from '@core/services/dialog.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    IconComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  readonly APP_ICONS = APP_ICONS;
  readonly theme = inject(ThemeService);
  private readonly authState = inject(AuthStateService);
  private readonly toast = inject(ToastService);
  private readonly dialogService = inject(DialogService);

  readonly form = inject(FormBuilder).nonNullable.group({
    organization: [localStorage.getItem('ems_org_name') || 'Acme People Ops'],
    timeout: [Number(localStorage.getItem('ems_timeout')) || 20],
    language: [localStorage.getItem('ems_language') || 'en'],
    timeZone: [localStorage.getItem('ems_timezone') || 'UTC+5:30'],
    dateFormat: [localStorage.getItem('ems_dateformat') || 'YYYY-MM-DD'],
    mfaEnabled: [localStorage.getItem('ems_mfa_enabled') === 'true'],
    passwordRule: [localStorage.getItem('ems_password_rule') || 'strong'],
    emailNotifications: [localStorage.getItem('ems_email_notif') !== 'false'],
    pushNotifications: [localStorage.getItem('ems_push_notif') !== 'false'],
    themeMode: [localStorage.getItem('ems_theme_mode') || 'system'],
    
    // Extended Configuration parameters
    loginAttemptLimit: [Number(localStorage.getItem('ems_login_attempts')) || 5],
    auditAlerts: [localStorage.getItem('ems_audit_alerts') !== 'false'],
    reportDelivery: [localStorage.getItem('ems_report_delivery') === 'true'],
    accentColor: [localStorage.getItem('ems_accent_color') || 'blue'],
    density: [localStorage.getItem('ems_density') || 'comfortable'],
    ldapEnabled: [localStorage.getItem('ems_ldap_enabled') === 'true'],
    ssoEnabled: [localStorage.getItem('ems_sso_enabled') === 'true'],
    emailProvider: [localStorage.getItem('ems_email_provider') || 'smtp'],
    apiAccessEnabled: [localStorage.getItem('ems_api_access_enabled') !== 'false']
  });

  // Keep baseline values to detect changes
  readonly baselineValues = signal<any>(null);
  
  // Active form value tracked to trigger isDirty signal reactivity
  readonly formValue = signal<any>(null);
  
  // Search query for settings page
  readonly searchQuery = signal<string>('');

  constructor() {
    const raw = this.form.getRawValue();
    this.baselineValues.set(raw);
    this.formValue.set(raw);
    this.form.valueChanges.subscribe(() => {
      this.formValue.set(this.form.getRawValue());
    });
  }

  readonly isDirty = computed(() => {
    const base = this.baselineValues();
    const current = this.formValue();
    if (!base || !current) return false;
    return JSON.stringify(base) !== JSON.stringify(current);
  });

  updateSearchQuery(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  isSectionVisible(section: 'general' | 'security' | 'notifications' | 'appearance' | 'integrations'): boolean {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return true;
    
    const sections: Record<string, string[]> = {
      general: ['general', 'company name', 'time zone', 'date format', 'organization', 'language', 'localization', 'locale'],
      security: ['security', 'mfa', 'session time', 'password rule', 'multi factor authentication', 'timeout', 'attempts', 'login attempt limits', 'limits'],
      notifications: ['notifications', 'email notifications', 'push notifications', 'email', 'push', 'audit alerts', 'report delivery', 'alerts'],
      appearance: ['appearance', 'theme', 'dark mode', 'light mode', 'accent color', 'density', 'color'],
      integrations: ['integrations', 'ldap', 'sso', 'single sign-on', 'email provider', 'api access', 'smtp', 'sendgrid', 'access']
    };
    
    return (sections[section] ?? []).some(keyword => keyword.includes(q));
  }

  saveSettings(): void {
    const val = this.form.getRawValue();
    localStorage.setItem('ems_org_name', val.organization);
    this.authState.organization.set(val.organization);
    localStorage.setItem('ems_timeout', String(val.timeout));
    localStorage.setItem('ems_language', val.language);
    localStorage.setItem('ems_timezone', val.timeZone);
    localStorage.setItem('ems_dateformat', val.dateFormat);
    localStorage.setItem('ems_mfa_enabled', String(val.mfaEnabled));
    localStorage.setItem('ems_password_rule', val.passwordRule);
    localStorage.setItem('ems_email_notif', String(val.emailNotifications));
    localStorage.setItem('ems_push_notif', String(val.pushNotifications));
    localStorage.setItem('ems_theme_mode', val.themeMode);
    
    // Extended configuration
    localStorage.setItem('ems_login_attempts', String(val.loginAttemptLimit));
    localStorage.setItem('ems_audit_alerts', String(val.auditAlerts));
    localStorage.setItem('ems_report_delivery', String(val.reportDelivery));
    localStorage.setItem('ems_accent_color', val.accentColor);
    localStorage.setItem('ems_density', val.density);
    localStorage.setItem('ems_ldap_enabled', String(val.ldapEnabled));
    localStorage.setItem('ems_sso_enabled', String(val.ssoEnabled));
    localStorage.setItem('ems_email_provider', val.emailProvider);
    localStorage.setItem('ems_api_access_enabled', String(val.apiAccessEnabled));
    
    // Apply theme changes dynamically
    const currentTheme = this.theme.theme();
    if (val.themeMode === 'dark' && currentTheme !== 'dark') {
      this.theme.toggle();
    } else if (val.themeMode === 'light' && currentTheme !== 'light') {
      this.theme.toggle();
    }
    
    this.toast.showToast('SETTINGS_SAVED_SUCCESS', 'success');
    this.baselineValues.set(val);
  }

  resetForm(): void {
    const base = this.baselineValues();
    if (base) {
      this.form.setValue(base);
      this.toast.showToast('Changes discarded', 'info');
    }
  }

  resetSettings(): void {
    this.dialogService.confirm({
      title: 'DIALOG_RESET_SETTINGS_TITLE',
      message: 'DIALOG_RESET_SETTINGS_MSG',
      variant: 'warning',
      icon: 'settings_backup_restore'
    }).then((confirmed) => {
      if (confirmed) {
        const defaults = {
          organization: 'Acme People Ops',
          timeout: 20,
          language: 'en',
          timeZone: 'UTC+5:30',
          dateFormat: 'YYYY-MM-DD',
          mfaEnabled: false,
          passwordRule: 'strong',
          emailNotifications: true,
          pushNotifications: true,
          themeMode: 'system',
          loginAttemptLimit: 5,
          auditAlerts: true,
          reportDelivery: false,
          accentColor: 'blue',
          density: 'comfortable',
          ldapEnabled: false,
          ssoEnabled: false,
          emailProvider: 'smtp',
          apiAccessEnabled: true
        };
        this.form.patchValue(defaults);
        this.toast.showToast('SETTINGS_RESET_SUCCESS', 'success');
      }
    });
  }
}
