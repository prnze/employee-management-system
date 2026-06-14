import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AuthStateService } from '@core/auth/auth-state.service';
import { UnsavedChangesAware } from '@core/guards/unsaved-changes.guard';
import { EmployeeService } from '@core/services/employee.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { ToastService } from '@core/services/toast.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';

import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { ChangePasswordComponent } from '@features/auth/change-password/change-password.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    IconComponent,
    AppDatePipe,
    ChangePasswordComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements UnsavedChangesAware {
  readonly APP_ICONS = APP_ICONS;
  readonly showChangePasswordModal = signal(false);
  
  // Injections
  readonly authState = inject(AuthStateService);
  readonly employeeService = inject(EmployeeService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly toast = inject(ToastService);

  readonly avatarPreview = signal<string | null>(null);
  readonly avatarErrorKey = signal('');

  // Form Group
  readonly form = inject(FormBuilder).nonNullable.group({
    fullName: [this.authState.user()?.fullName ?? '', Validators.required],
    email:    [this.authState.user()?.email    ?? '', [Validators.required, Validators.email]],
    phone:    ['9876543210', Validators.required]
  });

  // Load employee-specific analytics data
  readonly analytics = toSignal(this.analyticsService.employeeAnalytics().pipe(catchError(() => of(null))));

  // Look up employee record by matching email, fallback to mock details if not found
  readonly employeeRecord = computed(() => {
    const user = this.authState.user();
    if (!user) return null;
    
    const match = this.employeeService.employees().find(e => e.email.toLowerCase() === user.email.toLowerCase());
    return match || {
      id: user.id,
      employeeCode: 'EMP-1011',
      firstName: user.fullName.split(' ')[0] ?? 'Employee',
      lastName: user.fullName.split(' ')[1] ?? 'User',
      email: user.email,
      phone: '9876543210',
      department: 'Engineering',
      designation: user.role === 'Admin' ? 'System Administrator' : 'Frontend Developer',
      manager: 'Avery Admin',
      location: 'Bengaluru',
      status: 'Active' as const,
      joinedAt: '2022-06-01',
      salary: 1250000
    };
  });

  // Initials for avatar fallback
  readonly userInitials = computed(() => {
    const user = this.authState.user();
    if (!user) return '';
    const parts = user.fullName.split(' ');
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts[1]?.charAt(0) ?? '';
    return (first + last).toUpperCase();
  });

  // Profile completion status list
  readonly profileCompletion = computed(() => {
    const hasAvatar = !!this.avatarPreview() || !!this.authState.user()?.avatarUrl;
    const hasPhone = !!this.form.controls.phone.value;
    
    let score = 50;
    if (hasAvatar) score += 25;
    if (hasPhone) score += 25;
    return score;
  });

  hasUnsavedChanges(): boolean { return this.form.dirty; }

  save(): void {
    if (this.form.invalid) return;
    const val = this.form.getRawValue();
    
    const currentUser = this.authState.user();
    if (currentUser) {
      this.authState.setUser({
        ...currentUser,
        fullName: val.fullName,
        email: val.email,
        avatarUrl: this.avatarPreview() || currentUser.avatarUrl
      }, true);
    }
    
    this.form.markAsPristine();
    this.toast.showToast('Profile updated successfully', 'success');
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    this.avatarErrorKey.set('');
    this.avatarPreview.set(null);
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.avatarErrorKey.set('PROFILE_IMG_ERROR');
      input.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.avatarErrorKey.set('PROFILE_SIZE_ERROR');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { 
      this.avatarPreview.set(String(reader.result)); 
      this.form.markAsDirty(); 
    };
    reader.readAsDataURL(file);
  }
}
