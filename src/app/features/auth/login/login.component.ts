import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoaderComponent],
  template: `
    <h1 class="h3 mb-1">Sign in</h1>
    <p class="text-body-secondary">Use admin@ems.local / Admin&#64;123 or employee@ems.local / Employee&#64;123</p>
    @if (error()) { <div class="alert alert-danger" role="alert">{{ error() }}</div> }
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input id="email" class="form-control" type="email" formControlName="email" autocomplete="email" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="password">Password</label>
        <input id="password" class="form-control" type="password" formControlName="password" autocomplete="current-password" />
      </div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <label class="form-check"><input class="form-check-input" type="checkbox" formControlName="rememberMe" /> <span class="form-check-label">Remember me</span></label>
        <a routerLink="/auth/forgot-password">Forgot password?</a>
      </div>
      <button class="btn btn-primary w-100" type="submit" [disabled]="form.invalid || loading()">
        @if (loading()) { <app-loader label="Signing in" /> } @else { Sign in }
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [true]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: ({ user }) => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl ?? (user.role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard'));
      },
      error: (error: Error) => {
        this.error.set(error.message);
        this.loading.set(false);
      }
    });
  }
}
