import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStateService } from '@core/auth/auth-state.service';
import { UnsavedChangesAware } from '@core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  template: `
    <h1 class="h3 mb-3">{{ 'PROFILE_TITLE' | translate }}</h1>
    <form class="surface p-3 row g-3" [formGroup]="form" (ngSubmit)="save()">
      <div class="col-md-6">
        <label class="form-label">{{ 'PROFILE_FULL_NAME' | translate }}</label>
        <input class="form-control" formControlName="fullName" />
      </div>
      <div class="col-md-6">
        <label class="form-label">{{ 'PROFILE_EMAIL' | translate }}</label>
        <input class="form-control" type="email" formControlName="email" />
      </div>
      <div class="col-md-6">
        <label class="form-label">{{ 'PROFILE_PHONE' | translate }}</label>
        <input class="form-control" formControlName="phone" />
      </div>
      <div class="col-md-6">
        <label class="form-label" for="avatar">{{ 'PROFILE_PICTURE' | translate }}</label>
        <input id="avatar" class="form-control" type="file"
          accept="image/png,image/jpeg,image/webp" (change)="onAvatarSelected($event)" />
        <!-- avatarErrorKey stores a translation KEY — pipe translates it reactively -->
        @if (avatarErrorKey()) {
          <div class="form-text text-danger">{{ avatarErrorKey() | translate }}</div>
        }
      </div>
      @if (avatarPreview()) {
        <div class="col-12">
          <img [src]="avatarPreview()" alt="Selected profile preview"
            class="rounded-circle border" width="96" height="96" />
        </div>
      }
      <div class="col-12">
        <button class="btn btn-primary" type="submit" [disabled]="form.invalid">
          {{ 'PROFILE_SAVE' | translate }}
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements UnsavedChangesAware {
  private readonly authState = inject(AuthStateService);

  readonly avatarPreview = signal<string | null>(null);
  /**
   * Stores a translation KEY (e.g. 'PROFILE_IMG_ERROR'), never a translated string.
   * The template pipes it through | translate so it reacts to language switches.
   */
  readonly avatarErrorKey = signal('');

  readonly form = inject(FormBuilder).nonNullable.group({
    fullName: [this.authState.user()?.fullName ?? '', Validators.required],
    email:    [this.authState.user()?.email    ?? '', [Validators.required, Validators.email]],
    phone:    ['9876543210', Validators.required]
  });

  hasUnsavedChanges(): boolean { return this.form.dirty; }
  save(): void                  { this.form.markAsPristine(); }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    this.avatarErrorKey.set('');
    this.avatarPreview.set(null);
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.avatarErrorKey.set('PROFILE_IMG_ERROR');   // ← store key, not translated string
      input.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.avatarErrorKey.set('PROFILE_SIZE_ERROR');  // ← store key, not translated string
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { this.avatarPreview.set(String(reader.result)); this.form.markAsDirty(); };
    reader.readAsDataURL(file);
  }
}
