import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '@core/services/theme.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { ToastService } from '@core/services/toast.service';
import { DialogService } from '@core/services/dialog.service';
import { FormFieldComponent } from '@shared/form-controls/form-field/form-field.component';
import { InputComponent } from '@shared/form-controls/input/input.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    FormFieldComponent,
    InputComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  readonly theme = inject(ThemeService);
  private readonly authState = inject(AuthStateService);
  private readonly toast = inject(ToastService);
  private readonly dialogService = inject(DialogService);

  readonly form = inject(FormBuilder).nonNullable.group({
    organization: [localStorage.getItem('ems_org_name') || 'Acme People Ops'],
    timeout: [Number(localStorage.getItem('ems_timeout')) || 20]
  });

  constructor() {
    this.form.valueChanges.subscribe((val) => {
      if (val.organization !== undefined) {
        localStorage.setItem('ems_org_name', val.organization);
        this.authState.organization.set(val.organization);
      }
      if (val.timeout !== undefined) {
        localStorage.setItem('ems_timeout', String(val.timeout));
      }
    });
  }

  saveSettings(): void {
    this.toast.showToast('SETTINGS_SAVED_SUCCESS', 'success');
  }

  resetSettings(): void {
    this.dialogService.confirm({
      title: 'DIALOG_RESET_SETTINGS_TITLE',
      message: 'DIALOG_RESET_SETTINGS_MSG',
      variant: 'warning',
      icon: 'settings_backup_restore'
    }).then((confirmed) => {
      if (confirmed) {
        this.form.patchValue({
          organization: 'Acme People Ops',
          timeout: 20
        });
        this.toast.showToast('SETTINGS_RESET_SUCCESS', 'success');
      }
    });
  }
}
