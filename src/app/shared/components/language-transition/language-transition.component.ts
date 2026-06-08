import {
  ChangeDetectionStrategy, Component, computed, inject, signal
} from '@angular/core';
import { LanguageService } from '@core/services/language.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';

/**
 * Full-screen language-switch transition overlay.
 * Pure CSS animation — no third-party animation libraries.
 *
 * Technique: a skewed div sweeps top-left → bottom-right in 1 second.
 * Call `triggerFor(callback)` to start the animation, execute the callback
 * at the midpoint, then fade out.
 */
@Component({
  selector: 'app-language-transition',
  standalone: true,
  imports: [IconComponent],
  styleUrl: './language-transition.component.scss',
  templateUrl: './language-transition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageTransitionComponent {
  readonly APP_ICONS = APP_ICONS;
  readonly langSvc = inject(LanguageService);

  readonly visible = signal(false);
  readonly phase   = signal<'enter' | 'exit'>('enter');

  /**
   * Run the full 1-second diagonal sweep, calling `callback` at the midpoint
   * (when the screen is fully covered) so the language changes invisibly.
   */
  trigger(callback: () => void): void {
    this.visible.set(true);
    this.phase.set('enter');

    // Mid-point: screen fully covered — safe to swap language
    setTimeout(() => {
      callback();
      this.phase.set('exit');
    }, 500);

    // End: hide overlay after full animation completes
    setTimeout(() => {
      this.visible.set(false);
    }, 1000);
  }
}
