import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `<footer class="border-top bg-body px-3 py-2 small text-body-secondary">Employee Management System © 2026</footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
