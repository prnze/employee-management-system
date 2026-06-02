import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `<main class="container py-5 text-center"><h1>404</h1><p>The page was not found.</p><a class="btn btn-primary" routerLink="/">Go home</a></main>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
