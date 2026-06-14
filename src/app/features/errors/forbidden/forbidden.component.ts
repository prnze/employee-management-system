import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { Location } from '@angular/common';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [TranslatePipe, IconComponent],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForbiddenComponent {
  readonly APP_ICONS = APP_ICONS;
  private readonly location = inject(Location);
  private readonly toast = inject(ToastService);

  goBack(): void {
    this.location.back();
  }

  requestAccess(): void {
    this.toast.showToast('Access request submitted successfully.', 'success');
  }
}
