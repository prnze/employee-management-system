import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  effect,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '@core/services/theme.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import * as THREE from 'three';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  // Three.js instances
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  
  // Animation / Interaction properties
  private animationFrameId!: number;
  private lastTime = 0;
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;

  // Particle System properties
  private particleCount = 80;
  private particlePositions!: Float32Array;
  private particleVelocities!: Float32Array;
  private particleGeometry!: THREE.BufferGeometry;
  private particleMaterial!: THREE.PointsMaterial;
  private particles!: THREE.Points;

  // Connection Lines properties
  private lineGeometry!: THREE.BufferGeometry;
  private lineMaterial!: THREE.LineBasicMaterial;
  private lines!: THREE.LineSegments;

  constructor() {
    // Watch for theme changes and update colors
    effect(() => {
      const isDark = this.themeService.theme() === 'dark';
      this.updateColors(isDark);
    });
  }

  ngOnInit(): void {
    this.initThree();
    this.createParticles();
    this.animate(0);

    // Event listeners
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  ngOnDestroy(): void {
    // Clean up animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Clean up event listeners
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);

    // Dispose Three.js objects
    if (this.particleGeometry) this.particleGeometry.dispose();
    if (this.particleMaterial) this.particleMaterial.dispose();
    if (this.lineGeometry) this.lineGeometry.dispose();
    if (this.lineMaterial) this.lineMaterial.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }

  private initThree(): void {
    const width = this.canvasContainer.nativeElement.clientWidth || window.innerWidth;
    const height = this.canvasContainer.nativeElement.clientHeight || 500;

    // Create Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    this.camera.position.z = 350;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private createParticles(): void {
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleVelocities = new Float32Array(this.particleCount * 3);

    const range = 400;

    for (let i = 0; i < this.particleCount; i++) {
      // Position
      this.particlePositions[i * 3] = (Math.random() - 0.5) * range;
      this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * range;
      this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * range;

      // Velocity
      this.particleVelocities[i * 3] = (Math.random() - 0.5) * 0.8;
      this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      this.particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }

    // Geometries
    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    // Materials
    this.particleMaterial = new THREE.PointsMaterial({
      size: 4,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8
    });

    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particles);

    // Connection lines setup
    this.lineGeometry = new THREE.BufferGeometry();
    this.lineMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      linewidth: 1
    });
    this.lines = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
    this.scene.add(this.lines);

    // Initial theme update
    const isDark = this.themeService.theme() === 'dark';
    this.updateColors(isDark);
  }

  private updateColors(isDark: boolean): void {
    if (!this.particleMaterial || !this.lineMaterial) return;

    if (isDark) {
      // Blue/Grey tones for dark theme
      this.particleMaterial.color.setHex(0x3b82f6); // vibrant blue
      this.lineMaterial.color.setHex(0xffffff);
      this.lineMaterial.opacity = 0.15;
    } else {
      // Corporate blue/dark-grey tones for light theme
      this.particleMaterial.color.setHex(0x2563eb); // corporate blue
      this.lineMaterial.color.setHex(0x18181b); // dark grey
      this.lineMaterial.opacity = 0.1;
    }
  }

  private onMouseMove = (event: MouseEvent): void => {
    // Normalize mouse coordinates to [-1, 1]
    this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  private onWindowResize = (): void => {
    if (!this.camera || !this.renderer) return;

    const width = this.canvasContainer.nativeElement.clientWidth || window.innerWidth;
    const height = this.canvasContainer.nativeElement.clientHeight || 500;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private animate = (timestamp: number): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Capping at 60fps
    const elapsed = timestamp - this.lastTime;
    if (elapsed < 16.6) return; // ~60fps
    this.lastTime = timestamp;

    this.updatePhysics();
    this.updateLines();

    // Smooth mouse parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Apply parallax and subtle camera rotation
    if (this.camera) {
      const time = timestamp * 0.00005;
      this.camera.position.x = Math.sin(time) * 100 + (this.mouseX * 50);
      this.camera.position.y = Math.cos(time) * 50 + (this.mouseY * 50);
      this.camera.lookAt(this.scene.position);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private updatePhysics(): void {
    const range = 400;
    const boundary = range / 2;

    for (let i = 0; i < this.particleCount; i++) {
      // Update positions
      this.particlePositions[i * 3] += this.particleVelocities[i * 3];
      this.particlePositions[i * 3 + 1] += this.particleVelocities[i * 3 + 1];
      this.particlePositions[i * 3 + 2] += this.particleVelocities[i * 3 + 2];

      // Boundary check & Bouncing
      if (Math.abs(this.particlePositions[i * 3]) > boundary) {
        this.particleVelocities[i * 3] *= -1;
      }
      if (Math.abs(this.particlePositions[i * 3 + 1]) > boundary) {
        this.particleVelocities[i * 3 + 1] *= -1;
      }
      if (Math.abs(this.particlePositions[i * 3 + 2]) > boundary) {
        this.particleVelocities[i * 3 + 2] *= -1;
      }
    }

    const posAttr = this.particleGeometry.getAttribute('position');
    if (posAttr) {
      posAttr.needsUpdate = true;
    }
  }

  private updateLines(): void {
    const linePositions: number[] = [];
    const maxDistance = 90; // distance threshold to form a connection

    for (let i = 0; i < this.particleCount; i++) {
      const x1 = this.particlePositions[i * 3];
      const y1 = this.particlePositions[i * 3 + 1];
      const z1 = this.particlePositions[i * 3 + 2];

      for (let j = i + 1; j < this.particleCount; j++) {
        const x2 = this.particlePositions[j * 3];
        const y2 = this.particlePositions[j * 3 + 1];
        const z2 = this.particlePositions[j * 3 + 2];

        // Euclidean distance
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          linePositions.push(x1, y1, z1);
          linePositions.push(x2, y2, z2);
        }
      }
    }

    this.lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const posAttr = this.lineGeometry.getAttribute('position');
    if (posAttr) {
      posAttr.needsUpdate = true;
    }
  }

  watchDemo(): void {
    void this.router.navigateByUrl('/login');
  }
}
