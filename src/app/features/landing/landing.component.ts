import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
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

interface Project {
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured?: boolean;
}

interface SkillGroup {
  title: string;
  index: string;
  skills: string[];
}

@Component({
  selector: 'app-landing',
  standalone: true,
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

  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);
  readonly year = new Date().getFullYear();

  readonly navItems = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Work', href: '#work' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ];

  readonly projects: Project[] = [
    {
      title: 'Employee Management System',
      description: 'A production-grade workforce platform with secure authentication, real-time operations, database-level audit trails, and role-aware experiences for administrators and employees.',
      technologies: [
        'Angular 19', 'TypeScript', 'Signals', 'RxJS', 'Supabase Auth',
        'PostgreSQL', 'Storage', 'Realtime', 'RLS', 'Database Triggers'
      ],
      liveUrl: 'https://princelj.vercel.app/ems',
      githubUrl: 'https://github.com/prnze/employee-management-system',
      featured: true
    }
  ];

  readonly skillGroups: SkillGroup[] = [
    {
      index: '01',
      title: 'Frontend',
      skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SCSS', 'RxJS', 'Signals']
    },
    {
      index: '02',
      title: 'Backend & data',
      skills: ['Supabase', 'PostgreSQL', 'Authentication', 'Row Level Security', 'Realtime']
    },
    {
      index: '03',
      title: 'Tools',
      skills: ['Git', 'GitHub', 'Vercel', 'Figma', 'Chrome DevTools']
    }
  ];

  readonly certifications = [
    ['Full Stack with Python Programming', 'GUVI'],
    ['JavaScript', 'GUVI'],
    ['Java', 'Merjersofttech'],
    ['UI/UX', 'Srishti Innovative, Technopark TVM']
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
}
