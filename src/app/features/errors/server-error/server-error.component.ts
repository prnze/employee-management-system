import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerErrorComponent {
  readonly APP_ICONS = APP_ICONS;

  retry(): void {
    window.location.reload();
  }
}
