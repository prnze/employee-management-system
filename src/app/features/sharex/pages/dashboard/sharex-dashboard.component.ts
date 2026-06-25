import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { SharexService } from '../../services/sharex.service';
import { Share, timeAgo, timeUntil } from '../../models/share.model';
import { LocalShare } from '../create/sharex-create.component';

type ShareStatus = 'active' | 'expired' | 'burned' | 'view_limit';

interface DashboardShare extends LocalShare {
  viewCount?: number;
  viewLimit?: number;
  status: ShareStatus;
}

@Component({
  selector: 'app-sharex-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './sharex-dashboard.component.html',
  styleUrl: './sharex-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharexDashboardComponent implements OnInit {
  private readonly sharexService = inject(SharexService);

  readonly shares = signal<DashboardShare[]>([]);
  readonly filteredShares = signal<DashboardShare[]>([]);
  readonly searchQuery = signal('');
  readonly isLoading = signal(true);
  readonly linkCopied = signal<string | null>(null);

  // Delete confirmation dialog
  readonly deleteTarget = signal<DashboardShare | null>(null);
  readonly isDeleting = signal(false);

  // Stats
  readonly totalShares = signal(0);
  readonly activeShares = signal(0);
  readonly totalViews = signal(0);

  readonly timeAgo = timeAgo;
  readonly timeUntil = timeUntil;

  constructor(titleService: Title, meta: Meta) {
    titleService.setTitle('Dashboard — ShareX');
    meta.updateTag({ name: 'description', content: 'Manage your shared content. View stats, copy links, and delete shares.' });
  }

  async ngOnInit(): Promise<void> {
    await this.loadShares();
  }

  private async loadShares(): Promise<void> {
    this.isLoading.set(true);

    try {
      const stored = localStorage.getItem('sharex_my_shares');
      const localShares: LocalShare[] = stored ? JSON.parse(stored) : [];

      if (localShares.length === 0) {
        this.shares.set([]);
        this.filteredShares.set([]);
        this.isLoading.set(false);
        return;
      }

      // Render immediately from localStorage
      const dashboardShares: DashboardShare[] = localShares.map((ls) => ({
        ...ls,
        status: this.computeStatus(ls)
      }));

      this.shares.set(dashboardShares);
      this.filteredShares.set(dashboardShares);
      this.updateStats(dashboardShares);
      this.isLoading.set(false);

      // Then hydrate with live data from Supabase (view counts)
      await this.hydrateLiveData(dashboardShares);
    } catch {
      this.isLoading.set(false);
    }
  }

  private computeStatus(share: LocalShare): ShareStatus {
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) return 'expired';
    if (share.burnAfterRead) return 'active'; // Can't know if burned without server check
    return 'active';
  }

  private async hydrateLiveData(dashboardShares: DashboardShare[]): Promise<void> {
    try {
      const ids = dashboardShares.map((s) => s.id);
      const { data } = await this.sharexService.getSharesByIds(ids);

      if (!data) return;

      const liveMap = new Map<string, Share>();
      for (const share of data as Share[]) {
        liveMap.set(share.id, share);
      }

      const hydrated = dashboardShares.map((ds) => {
        const live = liveMap.get(ds.id);
        if (!live) {
          return { ...ds, status: 'expired' as ShareStatus };
        }

        let status: ShareStatus = 'active';
        if (live.expiry_at && new Date(live.expiry_at) < new Date()) status = 'expired';
        else if (live.is_burn_after_read && live.view_count > 0) status = 'burned';
        else if (live.view_limit && live.view_count >= live.view_limit) status = 'view_limit';

        return {
          ...ds,
          viewCount: live.view_count,
          viewLimit: live.view_limit ?? undefined,
          status
        };
      });

      this.shares.set(hydrated);
      this.applyFilter();
      this.updateStats(hydrated);
    } catch {
      // Hydration failed — dashboard still works from localStorage data
    }
  }

  private updateStats(shares: DashboardShare[]): void {
    this.totalShares.set(shares.length);
    this.activeShares.set(shares.filter((s) => s.status === 'active').length);
    this.totalViews.set(shares.reduce((sum, s) => sum + (s.viewCount || 0), 0));
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.applyFilter();
  }

  private applyFilter(): void {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      this.filteredShares.set(this.shares());
      return;
    }
    this.filteredShares.set(
      this.shares().filter((s) =>
        s.title.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.type.includes(query)
      )
    );
  }

  async copyLink(share: DashboardShare): Promise<void> {
    const url = this.sharexService.getShareUrl(share.code);
    await navigator.clipboard.writeText(url);
    this.linkCopied.set(share.id);
    setTimeout(() => this.linkCopied.set(null), 2500);
  }

  getShareUrl(code: string): string {
    return this.sharexService.getShareUrl(code);
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'text': return 'description';
      case 'files': return 'attach_file';
      case 'mixed': return 'dashboard';
      default: return 'description';
    }
  }

  getStatusLabel(status: ShareStatus): string {
    switch (status) {
      case 'active': return 'Active';
      case 'expired': return 'Expired';
      case 'burned': return 'Destroyed';
      case 'view_limit': return 'Limit Reached';
    }
  }

  // ── Delete Flow ───────────────────────────────────────────────────────────

  confirmDelete(share: DashboardShare): void {
    this.deleteTarget.set(share);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  async executeDelete(): Promise<void> {
    const target = this.deleteTarget();
    if (!target) return;

    this.isDeleting.set(true);

    // Optimistic removal
    const previousShares = this.shares();
    const updated = previousShares.filter((s) => s.id !== target.id);
    this.shares.set(updated);
    this.applyFilter();
    this.updateStats(updated);
    this.deleteTarget.set(null);

    try {
      await this.sharexService.deleteShare(target.id);

      // Also remove from localStorage
      this.removeFromLocalStorage(target.id);
    } catch {
      // Rollback
      this.shares.set(previousShares);
      this.applyFilter();
      this.updateStats(previousShares);
    } finally {
      this.isDeleting.set(false);
    }
  }

  private removeFromLocalStorage(id: string): void {
    try {
      const stored = localStorage.getItem('sharex_my_shares');
      if (!stored) return;
      const shares: LocalShare[] = JSON.parse(stored);
      const filtered = shares.filter((s) => s.id !== id);
      localStorage.setItem('sharex_my_shares', JSON.stringify(filtered));
    } catch {
      // Silently ignore
    }
  }
}
