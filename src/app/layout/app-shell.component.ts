import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../core/auth.store';
import { I18nService } from '../core/i18n.service';
import { LanguageSwitcherComponent } from '../shared/language-switcher.component';
import { TranslatePipe } from '../shared/translate.pipe';

interface NavItem {
  label: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, LanguageSwitcherComponent, TranslatePipe],
  template: `
    <div class="shell" [class.shell-rtl]="i18n.isArabic()" [class.rtl-layout]="i18n.isArabic()">
      <aside class="sidebar">
        <div class="brand">
          <h1>{{ 'EduTrack 360' | t }}</h1>
          <p>{{ 'School Management' | t }}</p>
        </div>

        <nav class="nav-links">
          @for (item of visibleNavItems(); track item.route) {
            <a [routerLink]="item.route" routerLinkActive="active-link">{{ item.label | t }}</a>
          }
        </nav>
      </aside>

      <div class="shell-main">
        <header class="topbar">
          <div>
            <h2>{{ pageTitle() | t }}</h2>
            <p>{{ 'Role' | t }}: {{ (authStore.role() ?? 'Unknown') | t }}</p>
          </div>

          <div class="topbar-actions">
            <app-language-switcher />
            <span>{{ authStore.currentUser()?.firstName }} {{ authStore.currentUser()?.lastName }}</span>
            <button class="btn btn-muted" type="button" (click)="logout()">{{ 'Logout' | t }}</button>
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  readonly authStore = inject(AuthStore);
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      roles: ['PRINCIPAL', 'ASSISTANT_PRINCIPAL', 'TEACHER', 'PARENT']
    },
    {
      label: 'Users',
      route: '/users',
      roles: ['PRINCIPAL', 'ASSISTANT_PRINCIPAL']
    },
    {
      label: 'Students',
      route: '/students',
      roles: ['PRINCIPAL', 'ASSISTANT_PRINCIPAL', 'TEACHER']
    },
    { label: 'Buses', route: '/buses', roles: ['PRINCIPAL', 'ASSISTANT_PRINCIPAL', 'TEACHER'] },
    { label: 'Messages', route: '/messages' },
    { label: 'Notifications', route: '/notifications' },
    { label: 'Schools', route: '/admin/schools', roles: ['SYSTEM_ADMIN'] },
    { label: 'System Admins', route: '/admin/system-admins', roles: ['SYSTEM_ADMIN'] },
    { label: 'Demo Requests', route: '/admin/demo-requests', roles: ['SYSTEM_ADMIN'] },
    {
      label: 'Relationships',
      route: '/school/relationships',
      roles: ['PRINCIPAL', 'ASSISTANT_PRINCIPAL']
    },
    {
      label: 'Bus Assignments',
      route: '/school/bus-assignments',
      roles: ['PRINCIPAL', 'ASSISTANT_PRINCIPAL']
    },
    { label: 'Parent Portal', route: '/parent/portal', roles: ['PARENT'] },
    { label: 'Student Portal', route: '/student/portal', roles: ['STUDENT'] }
  ];

  readonly visibleNavItems = computed(() => {
    const role = this.authStore.role();
    return this.navItems.filter((item) => !item.roles || (role !== null && item.roles.includes(role)));
  });

  readonly pageTitle = computed(() => {
    const currentPath = this.router.url;
    const page = this.navItems.find((item) => currentPath.startsWith(item.route));
    return page?.label ?? 'EduTrack 360';
  });

  logout(): void {
    this.authStore.logout();
  }
}
