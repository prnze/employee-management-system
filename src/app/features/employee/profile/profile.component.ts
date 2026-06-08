import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStateService } from '@core/auth/auth-state.service';
import { UnsavedChangesAware } from '@core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
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
