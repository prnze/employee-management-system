import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { AuthStateService } from '@core/auth/auth-state.service';
import { UnsavedChangesAware } from '@core/guards/unsaved-changes.guard';
import { EmployeeService } from '@core/services/employee.service';
import { UserService } from '@core/services/user.service';
import { StorageService } from '@core/services/storage.service';
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
  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly toast = inject(ToastService);

  readonly avatarPreview = signal<string | null>(null);
  readonly avatarFile = signal<File | null>(null);
  readonly avatarErrorKey = signal('');
  readonly isSaving = signal(false);

  // Form Group
  readonly form = inject(FormBuilder).nonNullable.group({
    fullName: [this.authState.user()?.fullName ?? '', Validators.required],
    email:    [this.authState.user()?.email    ?? '', [Validators.required, Validators.email]],
    phone:    ['9876543210', Validators.required]
  });

  // Load employee-specific analytics data
  readonly analytics = toSignal(this.analyticsService.employeeAnalytics().pipe(catchError(() => of(null))));

  readonly matchedEmployee = computed(() => {
    const user = this.authState.user();
    if (!user) return null;
    return this.employeeService.employees().find(e => e.email.toLowerCase() === user.email.toLowerCase()) ?? null;
  });

  // Look up employee record by matching email, fallback to mock details if not found
  readonly employeeRecord = computed(() => {
    const user = this.authState.user();
    if (!user) return null;
    return this.matchedEmployee() || {
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
    if (this.form.invalid || this.isSaving()) return;
    const val = this.form.getRawValue();
    const currentUser = this.authState.user();
    if (!currentUser) return;

    this.isSaving.set(true);
    const avatarOwnerId = this.matchedEmployee()?.id ?? currentUser.id;
    this.uploadAvatarIfSelected(avatarOwnerId).pipe(
      switchMap((avatarUrl) => {
        const resolvedAvatarUrl = avatarUrl ?? currentUser.avatarUrl;
        const userUpdate$ = this.userService.update(currentUser.id, {
          fullName: val.fullName,
          email: val.email,
          phone: val.phone,
          avatarUrl: resolvedAvatarUrl
        });
        const employee = this.matchedEmployee();
        const employeeUpdate$ = employee
          ? this.employeeService.update(employee.id, {
              firstName: val.fullName.trim().split(/\s+/)[0] ?? '',
              lastName: val.fullName.trim().split(/\s+/).slice(1).join(' '),
              email: val.email,
              phone: val.phone,
              avatarUrl: resolvedAvatarUrl
            })
          : of(null);
        return forkJoin({ user: userUpdate$, employee: employeeUpdate$ }).pipe(
          map((result) => ({ ...result, avatarUrl: resolvedAvatarUrl }))
        );
      }),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: ({ user, avatarUrl }) => {
        this.authState.updateUser({
          fullName: user.fullName,
          email: user.email,
          avatarUrl
        });
        this.avatarFile.set(null);
        this.avatarPreview.set(avatarUrl ?? null);
        this.form.markAsPristine();
        this.toast.showToast('Profile updated successfully', 'success');
      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Unable to update profile';
        this.toast.showToast(message, 'error');
      }
    });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    this.avatarErrorKey.set('');
    this.avatarPreview.set(null);
    this.avatarFile.set(null);
    if (!file) return;

    try {
      this.storageService.validateAvatar(file);
    } catch (error) {
      this.avatarErrorKey.set(file.size > 2 * 1024 * 1024 ? 'PROFILE_SIZE_ERROR' : 'PROFILE_IMG_ERROR');
      input.value = '';
      return;
    }
    this.avatarFile.set(file);
    const reader = new FileReader();
    reader.onload = () => { 
      this.avatarPreview.set(String(reader.result)); 
      this.form.markAsDirty(); 
    };
    reader.readAsDataURL(file);
  }

  private uploadAvatarIfSelected(employeeId: string): Observable<string | null> {
    const file = this.avatarFile();
    return file ? from(this.storageService.uploadAvatar(employeeId, file)) : of(null);
  }
}
