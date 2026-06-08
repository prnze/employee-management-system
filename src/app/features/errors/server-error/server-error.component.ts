import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerErrorComponent {}
