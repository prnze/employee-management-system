import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@core/auth/auth.service';
import { matchPasswordValidator } from '@shared/validators/match-password.validator';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';
import { FormFieldComponent } from '@shared/form-controls/form-field/form-field.component';
import { InputComponent } from '@shared/form-controls/input/input.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    FormFieldComponent,
    InputComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  private readonly fb   = inject(FormBuilder);
  private readonly auth = inject(AuthService);
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
    this.auth.changePassword({ currentPassword, newPassword }).subscribe(() => this.saved.set(true));
  }
}
