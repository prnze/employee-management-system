import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { matchPasswordValidator } from '@shared/validators/match-password.validator';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';
import { AuthService } from '@core/auth/auth.service';
import { FormFieldComponent } from '@shared/form-controls/form-field/form-field.component';
import { InputComponent } from '@shared/form-controls/input/input.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    FormFieldComponent,
    InputComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  private readonly fb   = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  readonly done = signal(false);
  readonly form = this.fb.nonNullable.group(
    {
      password:        ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required]
    },
    { validators: matchPasswordValidator('password', 'confirmPassword') }
  );

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.auth.resetPassword({ token: 'mock-token', password: this.form.controls.password.value }).subscribe(() => this.done.set(true));
  }
}
