import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Meta, Title } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { LocalStorageService } from '@core/services/local-storage.service';

interface Project {
  titleKey: string;
  descriptionKey: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured?: boolean;
}

interface SkillGroup {
  titleKey: string;
  index: string;
  skills: string[];
}

type PortfolioTheme = 'light' | 'dark';

const PORTFOLIO_THEME_KEY = 'portfolio_theme';
const PORTFOLIO_FONT_KEY = 'portfolio_font';
const PORTFOLIO_ACCENT_KEY = 'portfolio_accent';

interface FontOption {
  id: string;
  labelKey: string;
  family: string;
}

interface AccentOption {
  id: string;
  labelKey: string;
  color: string;
  lightColor: string;
  rgb: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('heroEntrance', [
      transition(':enter', [
        query('.hero-reveal', [
          style({ opacity: 0, transform: 'translateY(28px)' }),
          stagger(90, animate('650ms cubic-bezier(.2,.8,.2,1)', style({
            opacity: 1,
            transform: 'translateY(0)'
          })))
        ], { optional: true })
      ])
    ])
  ]
})
export class LandingComponent {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly languageService = inject(LanguageService);
  private readonly storage = inject(LocalStorageService);

  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);
  readonly settingsOpen = signal(false);
  readonly portfolioTheme = signal<PortfolioTheme>(this.resolveInitialTheme());
  readonly selectedFontId = signal(this.resolveInitialFont());
  readonly selectedAccentId = signal(this.resolveInitialAccent());
  readonly currentLanguage = this.languageService.currentCode;
  readonly year = new Date().getFullYear();

  readonly fontOptions: FontOption[] = [
    {
      id: 'inter',
      labelKey: 'LANDING.SETTINGS.FONTS.INTER',
      family: 'Inter, "Segoe UI", sans-serif'
    },
    {
      id: 'poppins',
      labelKey: 'LANDING.SETTINGS.FONTS.POPPINS',
      family: 'Poppins, Inter, "Segoe UI", sans-serif'
    },
    {
      id: 'outfit',
      labelKey: 'LANDING.SETTINGS.FONTS.OUTFIT',
      family: 'Outfit, Inter, "Segoe UI", sans-serif'
    },
    {
      id: 'plus-jakarta',
      labelKey: 'LANDING.SETTINGS.FONTS.PLUS_JAKARTA',
      family: '"Plus Jakarta Sans", Inter, "Segoe UI", sans-serif'
    },
    {
      id: 'space-grotesk',
      labelKey: 'LANDING.SETTINGS.FONTS.SPACE_GROTESK',
      family: '"Space Grotesk", Inter, "Segoe UI", sans-serif'
    }
  ];

  readonly accentOptions: AccentOption[] = [
    { id: 'blue', labelKey: 'LANDING.SETTINGS.ACCENTS.BLUE', color: '#7cc7ff', lightColor: '#2563eb', rgb: '124, 199, 255' },
    { id: 'purple', labelKey: 'LANDING.SETTINGS.ACCENTS.PURPLE', color: '#b39cff', lightColor: '#7c3aed', rgb: '179, 156, 255' },
    { id: 'cyan', labelKey: 'LANDING.SETTINGS.ACCENTS.CYAN', color: '#67e8f9', lightColor: '#0891b2', rgb: '103, 232, 249' },
    { id: 'emerald', labelKey: 'LANDING.SETTINGS.ACCENTS.EMERALD', color: '#c7f36b', lightColor: '#7c9d24', rgb: '199, 243, 107' },
    { id: 'orange', labelKey: 'LANDING.SETTINGS.ACCENTS.ORANGE', color: '#ffb36b', lightColor: '#ea580c', rgb: '255, 179, 107' },
    { id: 'red', labelKey: 'LANDING.SETTINGS.ACCENTS.RED', color: '#ff8a8a', lightColor: '#dc2626', rgb: '255, 138, 138' },
    { id: 'rose', labelKey: 'LANDING.SETTINGS.ACCENTS.ROSE', color: '#ff9ac2', lightColor: '#e11d48', rgb: '255, 154, 194' }
  ];

  readonly selectedFont = computed(() =>
    this.fontOptions.find((font) => font.id === this.selectedFontId()) ?? this.fontOptions[0]
  );

  readonly selectedAccent = computed(() =>
    this.accentOptions.find((accent) => accent.id === this.selectedAccentId()) ?? this.accentOptions[3]
  );

  readonly accentColor = computed(() =>
    this.portfolioTheme() === 'light' ? this.selectedAccent().lightColor : this.selectedAccent().color
  );

  readonly accentRgb = computed(() => this.selectedAccent().rgb);

  readonly navItems = [
    { labelKey: 'LANDING.NAV.ABOUT', href: '#about' },
    { labelKey: 'LANDING.NAV.EXPERIENCE', href: '#experience' },
    { labelKey: 'LANDING.NAV.WORK', href: '#work' },
    { labelKey: 'LANDING.NAV.SKILLS', href: '#skills' },
    { labelKey: 'LANDING.NAV.CONTACT', href: '#contact' }
  ];

  readonly projects: Project[] = [
    {
      titleKey: 'LANDING.PROJECTS.ITEMS.EMS.TITLE',
      descriptionKey: 'LANDING.PROJECTS.ITEMS.EMS.DESCRIPTION',
      technologies: [
        'LANDING.PROJECTS.TECH.ANGULAR',
        'LANDING.PROJECTS.TECH.TYPESCRIPT',
        'LANDING.PROJECTS.TECH.SIGNALS',
        'LANDING.PROJECTS.TECH.RXJS',
        'LANDING.PROJECTS.TECH.SUPABASE_AUTH',
        'LANDING.PROJECTS.TECH.POSTGRESQL',
        'LANDING.PROJECTS.TECH.STORAGE',
        'LANDING.PROJECTS.TECH.REALTIME',
        'LANDING.PROJECTS.TECH.RLS',
        'LANDING.PROJECTS.TECH.TRIGGERS'
      ],
      liveUrl: 'https://princelj.vercel.app/ems',
      githubUrl: 'https://github.com/prnze/employee-management-system',
      featured: true
    }
  ];

  readonly skillGroups: SkillGroup[] = [
    {
      index: '01',
      titleKey: 'LANDING.SKILLS.GROUPS.FRONTEND.TITLE',
      skills: [
        'LANDING.SKILLS.ITEMS.ANGULAR',
        'LANDING.SKILLS.ITEMS.TYPESCRIPT',
        'LANDING.SKILLS.ITEMS.JAVASCRIPT',
        'LANDING.SKILLS.ITEMS.HTML',
        'LANDING.SKILLS.ITEMS.CSS',
        'LANDING.SKILLS.ITEMS.SCSS',
        'LANDING.SKILLS.ITEMS.RXJS',
        'LANDING.SKILLS.ITEMS.SIGNALS'
      ]
    },
    {
      index: '02',
      titleKey: 'LANDING.SKILLS.GROUPS.BACKEND.TITLE',
      skills: [
        'LANDING.SKILLS.ITEMS.SUPABASE',
        'LANDING.SKILLS.ITEMS.POSTGRESQL',
        'LANDING.SKILLS.ITEMS.AUTHENTICATION',
        'LANDING.SKILLS.ITEMS.RLS',
        'LANDING.SKILLS.ITEMS.REALTIME'
      ]
    },
    {
      index: '03',
      titleKey: 'LANDING.SKILLS.GROUPS.TOOLS.TITLE',
      skills: [
        'LANDING.SKILLS.ITEMS.GIT',
        'LANDING.SKILLS.ITEMS.GITHUB',
        'LANDING.SKILLS.ITEMS.VERCEL',
        'LANDING.SKILLS.ITEMS.FIGMA',
        'LANDING.SKILLS.ITEMS.CHROME_DEVTOOLS'
      ]
    }
  ];

  readonly certifications = [
    ['LANDING.CERTIFICATIONS.ITEMS.FULL_STACK.TITLE', 'LANDING.CERTIFICATIONS.ITEMS.FULL_STACK.ISSUER'],
    ['LANDING.CERTIFICATIONS.ITEMS.JAVASCRIPT.TITLE', 'LANDING.CERTIFICATIONS.ITEMS.JAVASCRIPT.ISSUER'],
    ['LANDING.CERTIFICATIONS.ITEMS.JAVA.TITLE', 'LANDING.CERTIFICATIONS.ITEMS.JAVA.ISSUER'],
    ['LANDING.CERTIFICATIONS.ITEMS.UI_UX.TITLE', 'LANDING.CERTIFICATIONS.ITEMS.UI_UX.ISSUER']
  ];

  constructor() {
    const pageTitle = 'Prince L J | Associate Software Engineer | Angular Developer';
    const description = 'Prince L J is an Associate Software Engineer with 1.5+ years of experience specializing in Angular, TypeScript, Supabase and PostgreSQL.';
    const canonical = 'https://princelj.vercel.app/';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'author', content: 'Prince L J' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:site_name', content: 'Prince L J' });
    this.meta.updateTag({ property: 'og:image', content: `${canonical}portfolio-preview.svg` });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: `${canonical}portfolio-preview.svg` });

    let canonicalLink = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.rel = 'canonical';
      this.document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  setPortfolioLanguage(code: string): void {
    this.languageService.setLanguage(code);
    this.closeMenu();
  }

  toggleSettings(event?: Event): void {
    event?.stopPropagation();
    this.settingsOpen.update((open) => !open);
  }

  closeSettings(): void {
    this.settingsOpen.set(false);
  }

  setPortfolioTheme(theme: PortfolioTheme): void {
    this.portfolioTheme.set(theme);
    this.storage.set(PORTFOLIO_THEME_KEY, theme, localStorage);
  }

  setPortfolioFont(id: string): void {
    if (!this.fontOptions.some((font) => font.id === id)) return;
    this.selectedFontId.set(id);
    this.storage.set(PORTFOLIO_FONT_KEY, id, localStorage);
  }

  setPortfolioAccent(id: string): void {
    if (!this.accentOptions.some((accent) => accent.id === id)) return;
    this.selectedAccentId.set(id);
    this.storage.set(PORTFOLIO_ACCENT_KEY, id, localStorage);
  }

  private resolveInitialTheme(): PortfolioTheme {
    const storedTheme = this.storage.get<PortfolioTheme>(PORTFOLIO_THEME_KEY, localStorage);
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;

    const prefersLight = this.document.defaultView?.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  private resolveInitialFont(): string {
    const storedFont = this.storage.get<string>(PORTFOLIO_FONT_KEY, localStorage);
    if (storedFont && this.fontOptions?.some((font) => font.id === storedFont)) return storedFont;
    return 'inter';
  }

  private resolveInitialAccent(): string {
    const storedAccent = this.storage.get<string>(PORTFOLIO_ACCENT_KEY, localStorage);
    if (storedAccent && this.accentOptions?.some((accent) => accent.id === storedAccent)) return storedAccent;
    return 'emerald';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.settings-dock')) {
      this.closeSettings();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeSettings();
  }
}
