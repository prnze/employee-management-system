import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, throttleTime } from 'rxjs';
import { environment } from '@env/environment';
import { AuthService } from './auth.service';
import { AuthStateService } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly document = inject(DOCUMENT);
  private readonly auth = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly lastActivity = signal(Date.now());
  private timer: ReturnType<typeof setInterval> | null = null;
  private activitySubscription: Subscription | null = null;

  constructor() {
    effect(() => {
      if (this.authState.isAuthenticated()) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  start(): void {
    if (this.timer) {
      return;
    }
    this.lastActivity.set(Date.now());
    this.activitySubscription = merge(
      fromEvent(this.document, 'mousemove'),
      fromEvent(this.document, 'keydown'),
      fromEvent(this.document, 'click'),
      fromEvent(this.document, 'touchstart')
    )
      .pipe(throttleTime(1000))
      .subscribe(() => this.lastActivity.set(Date.now()));
    this.timer = setInterval(() => this.checkIdle(), 30_000);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.activitySubscription?.unsubscribe();
    this.activitySubscription = null;
  }

  private checkIdle(): void {
    const idleMs = Date.now() - this.lastActivity();
    if (idleMs > environment.idleTimeoutMinutes * 60_000) {
      this.auth.logout();
      void this.router.navigateByUrl('/auth/login');
    }
  }
}
