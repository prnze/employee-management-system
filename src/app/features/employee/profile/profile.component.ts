import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStateService } from '@core/auth/auth-state.service';
import { UnsavedChangesAware } from '@core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1 class="h3 mb-3">Profile</h1>
    <form class="surface p-3 row g-3" [formGroup]="form" (ngSubmit)="save()">
      <div class="col-md-6"><label class="form-label">Full name</label><input class="form-control" formControlName="fullName" /></div>
      <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" type="email" formControlName="email" /></div>
      <div class="col-md-6"><label class="form-label">Phone</label><input class="form-control" formControlName="phone" /></div>
      <div class="col-md-6">
        <label class="form-label" for="avatar">Profile picture</label>
        <input id="avatar" class="form-control" type="file" accept="image/png,image/jpeg,image/webp" (change)="onAvatarSelected($event)" />
        @if (avatarError()) { <div class="form-text text-danger">{{ avatarError() }}</div> }
      </div>
      @if (avatarPreview()) {
        <div class="col-12">
          <img [src]="avatarPreview()" alt="Selected profile preview" class="rounded-circle border" width="96" height="96" />
        </div>
      }
      <div class="col-12"><button class="btn btn-primary" type="submit" [disabled]="form.invalid">Save profile</button></div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements UnsavedChangesAware {
  private readonly authState = inject(AuthStateService);
  readonly avatarPreview = signal<string | null>(null);
  readonly avatarError = signal('');
  readonly form = inject(FormBuilder).nonNullable.group({
    fullName: [this.authState.user()?.fullName ?? '', Validators.required],
    email: [this.authState.user()?.email ?? '', [Validators.required, Validators.email]],
    phone: ['9876543210', Validators.required]
  });

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  save(): void {
    this.form.markAsPristine();
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.avatarError.set('');
    this.avatarPreview.set(null);
    if (!file) {
      return;
    }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.avatarError.set('Use a PNG, JPEG, or WebP image.');
      input.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.avatarError.set('Profile picture must be 2 MB or smaller.');
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
