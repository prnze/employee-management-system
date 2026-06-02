import "./chunk-WDMUDEB6.js";

// src/app/features/auth/auth.routes.ts
var AUTH_ROUTES = [
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "login", loadComponent: () => import("./chunk-WIXIT3OG.js").then((m) => m.LoginComponent) },
  { path: "forgot-password", loadComponent: () => import("./chunk-JQJMNDRD.js").then((m) => m.ForgotPasswordComponent) },
  { path: "reset-password", loadComponent: () => import("./chunk-ZQ72E45U.js").then((m) => m.ResetPasswordComponent) }
];
export {
  AUTH_ROUTES
};
//# sourceMappingURL=chunk-GLVPWD3R.js.map
