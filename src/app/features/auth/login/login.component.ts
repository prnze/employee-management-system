import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@core/auth/auth.service';
import { SeoService } from '@core/services/seo.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { FormFieldComponent } from '@shared/form-controls/form-field/form-field.component';
import { InputComponent } from '@shared/form-controls/input/input.component';
import { CheckboxComponent } from '@shared/form-controls/checkbox/checkbox.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LoaderComponent,
    TranslatePipe,
    FormFieldComponent,
    InputComponent,
    CheckboxComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb    = inject(FormBuilder);
  private readonly auth  = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route  = inject(ActivatedRoute);
  private readonly seo   = inject(SeoService);
  readonly loading = signal(false);
  readonly error   = signal('');
  readonly form    = this.fb.nonNullable.group({
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', Validators.required],
    rememberMe: [true]
  });

  constructor() {
    const canonical = SeoService.canonicalUrl('/ems');

    this.seo.update({
      title: 'EMS — Employee Management System | Prince L J',
      description: 'Full-featured Employee Management System with role-based access, attendance tracking, and real-time notifications. Built with Angular, Supabase, and PostgreSQL.',
      url: canonical,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Employee Management System',
        'description': 'Full-featured Employee Management System with role-based access, attendance tracking, and real-time notifications.',
        'url': canonical,
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Web',
        'author': {
          '@type': 'Person',
          'name': 'Prince L J',
          'url': SeoService.canonicalUrl('/')
        }
      }
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: ({ user }) => {
        if (user.forcePasswordReset) {
          void this.router.navigateByUrl('/ems/auth/change-password');
        } else {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          void this.router.navigateByUrl(returnUrl ?? (user.role === 'Admin' ? '/ems/admin/dashboard' : '/ems/employee/dashboard'));
        }
      },
      error: (error: Error) => { this.error.set(error.message); this.loading.set(false); }
    });
  }
}
