import { computed, Injectable, signal } from '@angular/core';
import { AuthUser } from '@core/models/auth.models';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { StorageService } from '@core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly userSignal = signal<AuthUser | null>(null);
  readonly user = this.userSignal.asReadonly();
  readonly organization = signal<string>(localStorage.getItem('ems_org_name') || 'Acme People Ops');
  readonly isAuthenticated = computed(() => Boolean(this.userSignal()));
  readonly role = computed(() => this.userSignal()?.role ?? null);
  readonly permissions = computed(() => this.userSignal()?.permissions ?? []);

  constructor(private readonly storage: StorageService) {
    this.userSignal.set(this.storage.get<AuthUser>(STORAGE_KEYS.user, localStorage) ?? this.storage.get<AuthUser>(STORAGE_KEYS.user, sessionStorage));
  }

  setUser(user: AuthUser, rememberMe: boolean): void {
    this.userSignal.set(user);
    this.storage.remove(STORAGE_KEYS.user);
    this.storage.set(STORAGE_KEYS.user, user, rememberMe ? localStorage : sessionStorage);
  }

  clear(): void {
    this.userSignal.set(null);
    this.storage.remove(STORAGE_KEYS.user);
  }
}
