import {
  APP_ROLES,
  ROLE_PERMISSIONS
} from "./chunk-AQHQM5CI.js";
import {
  AuthStateService
} from "./chunk-CSWEOAXU.js";
import {
  AuditService
} from "./chunk-37SAZOU5.js";
import {
  STORAGE_KEYS,
  StorageService
} from "./chunk-I2TBGIDF.js";
import {
  Injectable,
  computed,
  delay,
  map,
  of,
  setClassMetadata,
  signal,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-BJMLPQUZ.js";
import {
  __objRest
} from "./chunk-WDMUDEB6.js";

// src/app/core/auth/token.service.ts
var TokenService = class _TokenService {
  storage;
  accessTokenSignal = signal(null, ...ngDevMode ? [{ debugName: "accessTokenSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  refreshTokenSignal = signal(null, ...ngDevMode ? [{ debugName: "refreshTokenSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  expiresAtSignal = signal(null, ...ngDevMode ? [{ debugName: "expiresAtSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  rememberMeSignal = signal(false, ...ngDevMode ? [{ debugName: "rememberMeSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  accessToken = this.accessTokenSignal.asReadonly();
  refreshToken = this.refreshTokenSignal.asReadonly();
  expiresAt = this.expiresAtSignal.asReadonly();
  rememberMe = this.rememberMeSignal.asReadonly();
  hasTokens = computed(() => Boolean(this.accessTokenSignal() && this.refreshTokenSignal()), ...ngDevMode ? [{ debugName: "hasTokens" }] : (
    /* istanbul ignore next */
    []
  ));
  isAccessTokenExpired = computed(() => {
    const expiresAt = this.expiresAtSignal();
    return expiresAt ? Date.now() >= new Date(expiresAt).getTime() : false;
  }, ...ngDevMode ? [{ debugName: "isAccessTokenExpired" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor(storage) {
    this.storage = storage;
    this.restore();
  }
  setTokens(accessToken, refreshToken, rememberMe, expiresAt) {
    this.accessTokenSignal.set(accessToken);
    this.refreshTokenSignal.set(refreshToken);
    this.expiresAtSignal.set(expiresAt);
    this.rememberMeSignal.set(rememberMe);
    const target = rememberMe ? localStorage : sessionStorage;
    const staleTarget = rememberMe ? sessionStorage : localStorage;
    this.removeTokenKeys(staleTarget);
    this.storage.set(STORAGE_KEYS.accessToken, accessToken, target);
    this.storage.set(STORAGE_KEYS.refreshToken, refreshToken, target);
    this.storage.set(STORAGE_KEYS.accessTokenExpiresAt, expiresAt, target);
    this.storage.set(STORAGE_KEYS.rememberMe, rememberMe, localStorage);
  }
  updateAccessToken(accessToken, expiresAt) {
    const target = this.rememberMeSignal() ? localStorage : sessionStorage;
    this.accessTokenSignal.set(accessToken);
    this.expiresAtSignal.set(expiresAt);
    this.storage.set(STORAGE_KEYS.accessToken, accessToken, target);
    this.storage.set(STORAGE_KEYS.accessTokenExpiresAt, expiresAt, target);
  }
  clear() {
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.expiresAtSignal.set(null);
    this.rememberMeSignal.set(false);
    this.storage.remove(STORAGE_KEYS.accessToken);
    this.storage.remove(STORAGE_KEYS.refreshToken);
    this.storage.remove(STORAGE_KEYS.accessTokenExpiresAt);
    this.storage.remove(STORAGE_KEYS.rememberMe);
  }
  restore() {
    const rememberMe = this.storage.get(STORAGE_KEYS.rememberMe, localStorage);
    const source = rememberMe ? localStorage : sessionStorage;
    const session = {
      accessToken: this.storage.get(STORAGE_KEYS.accessToken, source) ?? "",
      refreshToken: this.storage.get(STORAGE_KEYS.refreshToken, source) ?? "",
      expiresAt: this.storage.get(STORAGE_KEYS.accessTokenExpiresAt, source) ?? "",
      rememberMe: rememberMe ?? false
    };
    this.accessTokenSignal.set(session.accessToken || null);
    this.refreshTokenSignal.set(session.refreshToken || null);
    this.expiresAtSignal.set(session.expiresAt || null);
    this.rememberMeSignal.set(session.rememberMe);
  }
  removeTokenKeys(storage) {
    storage.removeItem(STORAGE_KEYS.accessToken);
    storage.removeItem(STORAGE_KEYS.refreshToken);
    storage.removeItem(STORAGE_KEYS.accessTokenExpiresAt);
  }
  static \u0275fac = function TokenService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TokenService)(\u0275\u0275inject(StorageService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TokenService, factory: _TokenService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TokenService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: StorageService }], null);
})();

// src/app/core/auth/auth.service.ts
var AuthService = class _AuthService {
  authState;
  tokenService;
  audit;
  mockUsers = [
    {
      id: "u-admin",
      email: "admin@ems.local",
      password: "Admin@123",
      fullName: "Avery Admin",
      role: APP_ROLES.admin,
      permissions: ROLE_PERMISSIONS.Admin
    },
    {
      id: "u-employee",
      email: "employee@ems.local",
      password: "Employee@123",
      fullName: "Emerson Employee",
      role: APP_ROLES.employee,
      permissions: ROLE_PERMISSIONS.Employee
    }
  ];
  constructor(authState, tokenService, audit) {
    this.authState = authState;
    this.tokenService = tokenService;
    this.audit = audit;
  }
  login(request) {
    const found = this.mockUsers.find((user2) => user2.email === request.email && user2.password === request.password);
    if (!found) {
      return throwError(() => new Error("Invalid email or password"));
    }
    const _a = found, { password: _password } = _a, user = __objRest(_a, ["password"]);
    const response = {
      user,
      accessToken: `mock-access-token-${user.role}-${Date.now()}`,
      refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1e3).toISOString()
    };
    return of(response).pipe(delay(350), map((result) => {
      this.tokenService.setTokens(result.accessToken, result.refreshToken, request.rememberMe, result.expiresAt);
      this.authState.setUser(result.user, request.rememberMe);
      this.audit.record(result.user.fullName, "LOGIN", "Auth");
      return result;
    }));
  }
  logout() {
    const actor = this.authState.user()?.fullName ?? "Unknown user";
    this.audit.record(actor, "LOGOUT", "Auth");
    this.authState.clear();
    this.tokenService.clear();
  }
  forgotPassword(email) {
    return of(this.mockUsers.some((user) => user.email === email)).pipe(delay(300));
  }
  resetPassword(_request) {
    return of(true).pipe(delay(300));
  }
  changePassword(_request) {
    return of(true).pipe(delay(300));
  }
  refreshToken() {
    if (!this.tokenService.refreshToken()) {
      return throwError(() => new Error("Missing refresh token"));
    }
    return of({
      accessToken: `mock-access-token-refreshed-${Date.now()}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1e3).toISOString()
    }).pipe(delay(250));
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)(\u0275\u0275inject(AuthStateService), \u0275\u0275inject(TokenService), \u0275\u0275inject(AuditService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: AuthStateService }, { type: TokenService }, { type: AuditService }], null);
})();

export {
  TokenService,
  AuthService
};
//# sourceMappingURL=chunk-NM5HLFNR.js.map
