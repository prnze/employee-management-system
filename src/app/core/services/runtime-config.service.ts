import { Injectable, signal, computed } from '@angular/core';

export interface RuntimeConfig {
  apiUrl: string;
  appName: string;
  version: string;
  accessTokenTtlMinutes: number;
  idleTimeoutMinutes: number;
  featureFlags: Record<string, boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {
  private readonly _config = signal<RuntimeConfig | null>(null);

  // Readonly public signal
  readonly config = this._config.asReadonly();

  // Readonly computed signals for configuration properties
  readonly apiUrl = computed(() => this._config()?.apiUrl ?? '/api');
  readonly appName = computed(() => this._config()?.appName ?? 'Employee Management System');
  readonly version = computed(() => this._config()?.version ?? '1.0.0');

  /**
   * Evaluates if a feature flag is enabled.
   */
  featureEnabled(flag: string): boolean {
    return this._config()?.featureFlags?.[flag] ?? false;
  }

  /**
   * Loads the configuration from the assets path.
   * Returns a promise so APP_INITIALIZER blocks bootstrap until loaded.
   */
  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('./assets/config/config.json');
      if (!response.ok) {
        throw new Error(`Failed to load config.json: ${response.statusText}`);
      }
      const data = await response.json() as RuntimeConfig;
      this._config.set(data);
    } catch (error) {
      console.error('Error loading runtime configuration, falling back to defaults:', error);
      // Fallback configuration if fetch fails
      this._config.set({
        apiUrl: '/api',
        appName: 'Employee Management System',
        version: '1.0.0',
        accessTokenTtlMinutes: 15,
        idleTimeoutMinutes: 20,
        featureFlags: {
          auditLogs: true,
          notifications: true
        }
      });
    }
  }
}
