// src/app/core/constants/roles.constant.ts
var APP_ROLES = {
  admin: "Admin",
  employee: "Employee"
};
var ROLE_PERMISSIONS = {
  Admin: [
    "dashboard:view",
    "employees:read",
    "employees:create",
    "employees:update",
    "employees:delete",
    "users:manage",
    "roles:manage",
    "reports:view",
    "audit:view",
    "settings:manage"
  ],
  Employee: ["dashboard:view", "profile:update", "attendance:view", "tasks:view", "notifications:view"]
};

export {
  APP_ROLES,
  ROLE_PERMISSIONS
};
//# sourceMappingURL=chunk-AQHQM5CI.js.map
