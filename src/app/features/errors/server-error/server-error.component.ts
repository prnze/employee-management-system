import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <main class="container py-5 text-center">
      <h1>500</h1>
      <p>{{ 'ERROR_500_MSG' | translate }}</p>
      <a class="btn btn-primary" routerLink="/">{{ 'ERROR_500_HOME' | translate }}</a>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerErrorComponent {}
