import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@core/auth/auth.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { ToastService } from '@core/services/toast.service';
import { matchPasswordValidator } from '@shared/validators/match-password.validator';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';
import { FormFieldComponent } from '@shared/form-controls/form-field/form-field.component';
import { InputComponent } from '@shared/form-controls/input/input.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    FormFieldComponent,
    InputComponent,
    ModalComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  readonly open = input(false);
  readonly isPageInput = input(false, { alias: 'isPage' });
  readonly closed = output<void>();

  private readonly route = inject(ActivatedRoute, { optional: true });
  readonly isPage = computed(() => {
    const isRouted = this.route?.snapshot.data?.['isPage'] === true || (typeof window !== 'undefined' && window.location.pathname.includes('change-password'));
    return this.isPageInput() || isRouted;
  });

  private readonly fb    = inject(FormBuilder);
  private readonly auth  = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);
  readonly saved = signal(false);
  readonly form  = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword:     ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required]
    },
    { validators: matchPasswordValidator('newPassword', 'confirmPassword') }
  );

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { currentPassword, newPassword } = this.form.getRawValue();
    this.auth.changePassword({ currentPassword, newPassword }).subscribe(() => {
      this.toast.showToast('CHANGE_PWD_SAVED', 'success');
      this.form.reset();
      this.authState.updateUser({ forcePasswordReset: false });
      
      if (this.isPage()) {
        const role = this.authState.role();
        void this.router.navigateByUrl(role === 'Admin' ? '/ems/admin/dashboard' : '/ems/employee/dashboard');
      } else {
        this.closed.emit();
      }
    });
  }
}
