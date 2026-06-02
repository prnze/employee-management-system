import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1 class="h3 mb-3">Settings</h1>
    <form class="surface p-3 row g-3" [formGroup]="form">
      <div class="col-md-6"><label class="form-label">Organization name</label><input class="form-control" formControlName="organization" /></div>
      <div class="col-md-6"><label class="form-label">Session timeout minutes</label><input class="form-control" type="number" formControlName="timeout" /></div>
      <div class="col-12"><button class="btn btn-outline-primary" type="button" (click)="theme.toggle()">Toggle theme</button></div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  readonly theme = inject(ThemeService);
  readonly form = inject(FormBuilder).nonNullable.group({ organization: ['Acme People Ops'], timeout: [20] });
}
