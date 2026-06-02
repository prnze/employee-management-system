import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { matchPasswordValidator } from '@shared/validators/match-password.validator';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="surface p-3">
      <h1 class="h4">Change password</h1>
      @if (saved()) { <div class="alert alert-success">Password updated.</div> }
      <form [formGroup]="form" (ngSubmit)="submit()" class="row g-3">
        <div class="col-12"><input class="form-control" type="password" placeholder="Current password" formControlName="currentPassword" /></div>
        <div class="col-md-6"><input class="form-control" type="password" placeholder="New password" formControlName="newPassword" /></div>
        <div class="col-md-6"><input class="form-control" type="password" placeholder="Confirm password" formControlName="confirmPassword" /></div>
        <div class="col-12"><button class="btn btn-primary" type="submit" [disabled]="form.invalid">Save password</button></div>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  readonly saved = signal(false);
  readonly form = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required]
    },
    { validators: matchPasswordValidator('newPassword', 'confirmPassword') }
  );

  submit(): void {
    const { currentPassword, newPassword } = this.form.getRawValue();
    this.auth.changePassword({ currentPassword, newPassword }).subscribe(() => this.saved.set(true));
  }
}
