import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { matchPasswordValidator } from '@shared/validators/match-password.validator';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h1 class="h3">Reset password</h1>
    @if (done()) { <div class="alert alert-success">Password reset successfully.</div> }
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input class="form-control mb-3" type="password" placeholder="New password" formControlName="password" />
      <input class="form-control mb-3" type="password" placeholder="Confirm password" formControlName="confirmPassword" />
      <button class="btn btn-primary w-100" type="submit" [disabled]="form.invalid">Reset password</button>
      <a class="btn btn-link w-100 mt-2" routerLink="/auth/login">Back to login</a>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  readonly done = signal(false);
  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required]
    },
    { validators: matchPasswordValidator('password', 'confirmPassword') }
  );

  submit(): void {
    this.auth.resetPassword({ token: 'mock-token', password: this.form.controls.password.value }).subscribe(() => this.done.set(true));
  }
}
