import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '@core/services/theme.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { SupabaseService } from './core/services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly theme = inject(ThemeService);

  constructor(private supabase: SupabaseService) {
    this.theme.initialize();
  }

  async ngOnInit() {

    const { data, error } =
      await this.supabase.client
        .from('users')
        .select('*');

    console.log('DATA', data);
    console.log('ERROR', error);
  }
}
