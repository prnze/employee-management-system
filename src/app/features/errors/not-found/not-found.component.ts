import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <main class="container py-5 text-center">
      <h1>404</h1>
      <p>{{ 'ERROR_404_MSG' | translate }}</p>
      <a class="btn btn-primary" routerLink="/">{{ 'ERROR_404_HOME' | translate }}</a>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
