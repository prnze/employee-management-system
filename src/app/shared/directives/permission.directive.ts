import { Directive, TemplateRef, ViewContainerRef, effect, input, inject } from '@angular/core';
import { PermissionsService } from '@core/auth/permissions.service';

@Directive({ selector: '[appPermission]', standalone: true })
export class PermissionDirective {
  readonly appPermission = input.required<string>();
  private readonly template = inject(TemplateRef<unknown>);
  private readonly view = inject(ViewContainerRef);
  private readonly permissions = inject(PermissionsService);
  private rendered = false;

  constructor() {
    effect(() => {
      const allowed = this.permissions.hasPermission(this.appPermission());
      if (allowed && !this.rendered) {
        this.view.createEmbeddedView(this.template);
        this.rendered = true;
      }
      if (!allowed && this.rendered) {
        this.view.clear();
        this.rendered = false;
      }
    });
  }
}
