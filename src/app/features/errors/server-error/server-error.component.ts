import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [RouterLink],
  template: `<main class="container py-5 text-center"><h1>500</h1><p>The server could not complete the request.</p><a class="btn btn-primary" routerLink="/">Go home</a></main>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerErrorComponent {}
