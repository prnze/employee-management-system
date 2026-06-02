import { computed, Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { StoredTokenSession } from '@core/models/session.models';
import { StorageService } from '@core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly refreshTokenSignal = signal<string | null>(null);
  private readonly expiresAtSignal = signal<string | null>(null);
  private readonly rememberMeSignal = signal(false);
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly refreshToken = this.refreshTokenSignal.asReadonly();
  readonly expiresAt = this.expiresAtSignal.asReadonly();
  readonly rememberMe = this.rememberMeSignal.asReadonly();
  readonly hasTokens = computed(() => Boolean(this.accessTokenSignal() && this.refreshTokenSignal()));
  readonly isAccessTokenExpired = computed(() => {
    const expiresAt = this.expiresAtSignal();
    return expiresAt ? Date.now() >= new Date(expiresAt).getTime() : false;
  });

  constructor(private readonly storage: StorageService) {
    this.restore();
  }

  setTokens(accessToken: string, refreshToken: string, rememberMe: boolean, expiresAt: string): void {
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

  updateAccessToken(accessToken: string, expiresAt: string): void {
    const target = this.rememberMeSignal() ? localStorage : sessionStorage;
    this.accessTokenSignal.set(accessToken);
    this.expiresAtSignal.set(expiresAt);
    this.storage.set(STORAGE_KEYS.accessToken, accessToken, target);
    this.storage.set(STORAGE_KEYS.accessTokenExpiresAt, expiresAt, target);
  }

  clear(): void {
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.expiresAtSignal.set(null);
    this.rememberMeSignal.set(false);
    this.storage.remove(STORAGE_KEYS.accessToken);
    this.storage.remove(STORAGE_KEYS.refreshToken);
    this.storage.remove(STORAGE_KEYS.accessTokenExpiresAt);
    this.storage.remove(STORAGE_KEYS.rememberMe);
  }

  private restore(): void {
    const rememberMe = this.storage.get<boolean>(STORAGE_KEYS.rememberMe, localStorage);
    const source = rememberMe ? localStorage : sessionStorage;
    const session: StoredTokenSession = {
      accessToken: this.storage.get<string>(STORAGE_KEYS.accessToken, source) ?? '',
      refreshToken: this.storage.get<string>(STORAGE_KEYS.refreshToken, source) ?? '',
      expiresAt: this.storage.get<string>(STORAGE_KEYS.accessTokenExpiresAt, source) ?? '',
      rememberMe: rememberMe ?? false
    };
    this.accessTokenSignal.set(session.accessToken || null);
    this.refreshTokenSignal.set(session.refreshToken || null);
    this.expiresAtSignal.set(session.expiresAt || null);
    this.rememberMeSignal.set(session.rememberMe);
  }

  private removeTokenKeys(storage: Storage): void {
    storage.removeItem(STORAGE_KEYS.accessToken);
    storage.removeItem(STORAGE_KEYS.refreshToken);
    storage.removeItem(STORAGE_KEYS.accessTokenExpiresAt);
  }
}
