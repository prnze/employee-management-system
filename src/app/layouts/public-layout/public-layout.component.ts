import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '@core/services/theme.service';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
}

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent implements AfterViewInit, OnDestroy {
  readonly theme = inject(ThemeService);

  @ViewChild('particlesCanvas', { static: true }) 
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private animationFrameId: number | null = null;
  private particles: Particle3D[] = [];
  private readonly maxParticles = 90;
  private readonly fov = 350;
  private mouseX = 0;
  private mouseY = 0;
  private isMouseOver = false;

  private readonly resizeListener = () => this.resizeCanvas();
  private readonly mouseMoveListener = (e: MouseEvent) => this.onMouseMove(e);
  private readonly mouseLeaveListener = () => this.onMouseLeave();

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.resizeCanvas();
    this.initParticles();

    // Listeners
    window.addEventListener('resize', this.resizeListener);
    window.addEventListener('mousemove', this.mouseMoveListener);
    document.body.addEventListener('mouseleave', this.mouseLeaveListener);

    // Start particle loop
    this.loop();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeListener);
    window.removeEventListener('mousemove', this.mouseMoveListener);
    document.body.removeEventListener('mouseleave', this.mouseLeaveListener);
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * canvas.width * 1.5,
        y: (Math.random() - 0.5) * canvas.height * 1.5,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: -Math.random() * 0.8 - 0.2, // drifting forward
        size: Math.random() * 2 + 1
      });
    }
  }

  private onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.isMouseOver = true;
  }

  private onMouseLeave(): void {
    this.isMouseOver = false;
  }

  private loop(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const currentTheme = this.theme.theme();
    const isDark = currentTheme === 'dark';

    // Particle colors based on active theme
    const particleColor = isDark ? '107, 184, 255' : '9, 71, 123'; // #6bb8ff vs #09477b

    // Update and project particles
    const projected: { x: number; y: number; r: number; alpha: number; p: Particle3D }[] = [];

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      // Wrap-around in depth
      if (p.z <= 0) {
        p.z = 1000;
        p.x = (Math.random() - 0.5) * canvas.width * 1.5;
        p.y = (Math.random() - 0.5) * canvas.height * 1.5;
      }

      // Projection formula
      const scale = this.fov / (this.fov + p.z);
      const projX = centerX + p.x * scale;
      const projY = centerY + p.y * scale;

      // Mouse interactive push/pull
      let finalX = projX;
      let finalY = projY;
      if (this.isMouseOver) {
        const dx = this.mouseX - projX;
        const dy = this.mouseY - projY;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 15; // smooth factor
          finalX -= (dx / dist) * force;
          finalY -= (dy / dist) * force;
        }
      }

      const alpha = (1 - p.z / 1000) * 0.8;
      const radius = p.size * scale * 1.8;

      // Keep within bounds to project lines
      if (finalX >= 0 && finalX <= canvas.width && finalY >= 0 && finalY <= canvas.height) {
        projected.push({
          x: finalX,
          y: finalY,
          r: radius,
          alpha,
          p
        });
      }
    }

    // Draw connection lines
    const lineDistanceLimit = 110;
    ctx.lineWidth = 0.55;
    for (let i = 0; i < projected.length; i++) {
      const p1 = projected[i];
      for (let j = i + 1; j < projected.length; j++) {
        const p2 = projected[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < lineDistanceLimit) {
          const lineAlpha = (1 - dist / lineDistanceLimit) * Math.min(p1.alpha, p2.alpha) * 0.35;
          ctx.strokeStyle = `rgba(${particleColor}, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of projected) {
      ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }
}
