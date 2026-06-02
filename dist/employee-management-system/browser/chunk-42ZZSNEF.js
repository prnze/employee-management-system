import {
  PermissionsService
} from "./chunk-IHXGN32L.js";
import {
  Router
} from "./chunk-WJRWGGLF.js";
import {
  inject
} from "./chunk-BJMLPQUZ.js";

// src/app/core/guards/unsaved-changes.guard.ts
var unsavedChangesGuard = (component) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }
  return window.confirm("You have unsaved changes. Leave this page?");
};

// src/app/core/guards/permission.guard.ts
var permissionGuard = (route) => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);
  const required = route.data?.["permission"];
  if (!required || permissions.hasPermission(required)) {
    return true;
  }
  return router.createUrlTree(["/403"]);
};

export {
  unsavedChangesGuard,
  permissionGuard
};
//# sourceMappingURL=chunk-42ZZSNEF.js.map
