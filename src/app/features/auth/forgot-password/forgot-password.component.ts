import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h1 class="h3">Forgot password</h1>
    @if (sent()) { <div class="alert alert-success">If the account exists, reset instructions were sent.</div> }
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label class="form-label" for="email">Email</label>
      <input id="email" class="form-control mb-3" type="email" formControlName="email" />
      <button class="btn btn-primary w-100" type="submit" [disabled]="form.invalid">Send reset link</button>
      <a class="btn btn-link w-100 mt-2" routerLink="/auth/login">Back to login</a>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  readonly sent = signal(false);
  readonly form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]] });

  submit(): void {
    this.auth.forgotPassword(this.form.controls.email.value).subscribe(() => this.sent.set(true));
  }
}
