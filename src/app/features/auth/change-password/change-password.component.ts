import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@core/auth/auth.service';
import { matchPasswordValidator } from '@shared/validators/match-password.validator';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  template: `
    <section class="surface p-3">
      <h1 class="h4">{{ 'CHANGE_PWD_TITLE' | translate }}</h1>
      @if (saved()) {
        <div class="alert alert-success">{{ 'CHANGE_PWD_SAVED' | translate }}</div>
      }
      <form [formGroup]="form" (ngSubmit)="submit()" class="row g-3">
        <div class="col-12">
          <input class="form-control" type="password"
            [placeholder]="'CHANGE_PWD_CURRENT' | translate" formControlName="currentPassword" />
        </div>
        <div class="col-md-6">
          <input class="form-control" type="password"
            [placeholder]="'CHANGE_PWD_NEW' | translate" formControlName="newPassword" />
        </div>
        <div class="col-md-6">
          <input class="form-control" type="password"
            [placeholder]="'CHANGE_PWD_CONFIRM' | translate" formControlName="confirmPassword" />
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">
            {{ 'CHANGE_PWD_SAVE' | translate }}
          </button>
        </div>
      </form>
    </section>
  `,
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
    const { currentPassword, newPassword } = this.form.getRawValue();
    this.auth.changePassword({ currentPassword, newPassword }).subscribe(() => this.saved.set(true));
  }
}
