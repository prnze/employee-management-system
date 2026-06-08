import { Directive, TemplateRef, ViewContainerRef, effect, input, inject } from '@angular/core';
import { PermissionService, PermissionDefinition } from '@core/auth/permission.service';

@Directive({ selector: '[appPermission]', standalone: true })
export class PermissionDirective {
  readonly appPermission = input.required<string | PermissionDefinition>();
  private readonly template = inject(TemplateRef<unknown>);
  private readonly view = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);
  private rendered = false;

  constructor() {
    effect(() => {
      const val = this.appPermission();
      let allowed = false;

      if (typeof val === 'string') {
        const [module, action] = val.split(':');
        allowed = this.permissionService.can(module ?? '', action ?? '');
      } else if (val && typeof val === 'object' && 'module' in val && 'action' in val) {
        allowed = this.permissionService.can(val.module, val.action);
      }

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

@Directive({ selector: '[appPermissionAny]', standalone: true })
export class PermissionAnyDirective {
  readonly appPermissionAny = input.required<PermissionDefinition[]>();
  private readonly template = inject(TemplateRef<unknown>);
  private readonly view = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);
  private rendered = false;

  constructor() {
    effect(() => {
      const allowed = this.permissionService.canAny(this.appPermissionAny());

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
