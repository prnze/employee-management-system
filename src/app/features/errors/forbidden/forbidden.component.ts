import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `<main class="container py-5 text-center"><h1>403</h1><p>You do not have permission to access this page.</p><a class="btn btn-primary" routerLink="/">Go home</a></main>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForbiddenComponent {}
