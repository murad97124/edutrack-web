import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { extractData } from '../../core/api.helpers';
import { ToastService } from '../../core/toast.service';
import { LanguageSwitcherComponent } from '../../shared/language-switcher.component';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-project-review-page',
  imports: [RouterLink, ReactiveFormsModule, LanguageSwitcherComponent, TranslatePipe],
  template: `
    <div class="review-page">
      <header class="review-hero card">
        <div class="review-lang">
          <app-language-switcher />
        </div>
        <p class="review-badge">EduTrack360 • BRD v1.0 • January 2026</p>
        <h1>{{ 'Complete 360° School Management & Safety Tracking' | t }}</h1>
        <p>
          {{ 'Multi-tenant school community platform for transportation safety, communication, and operational excellence across web and mobile.' | t }}
        </p>

        <div class="hero-actions">
          <button class="btn btn-primary" type="button" (click)="scrollToDemo()">{{ 'Request Demo' | t }}</button>
          <a class="btn btn-muted" routerLink="/login">{{ 'Sign in' | t }}</a>
        </div>
      </header>

      <section class="card">
        <h2>Core Features (Version 1.0)</h2>
        <div class="cards-grid">
          @for (feature of coreFeatures; track feature.title) {
            <article class="feature-card">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </article>
          }
        </div>
      </section>

      <section class="card">
        <h2>Product Roadmap</h2>
        <div class="timeline-grid">
          @for (item of productVersions; track item.version) {
            <article class="timeline-item">
              <p class="timeline-version">{{ item.version }}</p>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          }
        </div>
      </section>

      <section class="card">
        <h2>Technology Stack</h2>
        <div class="stack-grid">
          @for (tech of techStack; track tech.layer) {
            <article>
              <h3>{{ tech.layer }}</h3>
              <p>{{ tech.technology }}</p>
            </article>
          }
        </div>
      </section>

      <section class="card">
        <h2>Roles & Access</h2>
        <div class="chips-wrap">
          @for (role of roles; track role.name) {
            <article class="role-chip">
              <h3>{{ role.name }}</h3>
              <p>{{ role.access }}</p>
            </article>
          }
        </div>
      </section>

      <section class="card">
        <h2>Performance & Security Targets</h2>
        <div class="cards-grid two-col">
          <article class="feature-card">
            <h3>Performance</h3>
            <ul>
              <li>API response under 500ms (95th percentile)</li>
              <li>Initial page load under 2 seconds</li>
              <li>Bus location latency under 10 seconds</li>
              <li>Scale to 100+ schools and 10,000+ users</li>
            </ul>
          </article>
          <article class="feature-card">
            <h3>Security & Compliance</h3>
            <ul>
              <li>JWT authentication with role-based access control</li>
              <li>TLS encryption in transit and encryption at rest</li>
              <li>Rate limiting, SQL/XSS/CSRF protections</li>
              <li>GDPR and FERPA-aligned data handling</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="card" id="demo-request">
        <h2>{{ 'Contact & Demo Request' | t }}</h2>
        <p>{{ 'Share your school details and our team will reach out with a guided demo.' | t }}</p>

        <form [formGroup]="demoForm" (ngSubmit)="submitDemo()" class="form-grid form-grid-3">
          <label>
            {{ 'School Name' | t }}
            <input type="text" formControlName="schoolName" />
          </label>
          <label>
            {{ 'Contact Name' | t }}
            <input type="text" formControlName="contactName" />
          </label>
          <label>
            {{ 'Work Email' | t }}
            <input type="email" formControlName="email" />
          </label>
          <label>
            {{ 'Phone Number' | t }}
            <input type="text" formControlName="phone" />
          </label>
          <label>
            {{ 'School Size' | t }}
            <select formControlName="schoolSize">
              <option value="">{{ 'Select' | t }}</option>
              <option value="Under 500 students">Under 500 students</option>
              <option value="500-1500 students">500 - 1,500 students</option>
              <option value="1500-3000 students">1,500 - 3,000 students</option>
              <option value="Over 3000 students">Over 3,000 students</option>
            </select>
          </label>
          <label>
            Country (Optional)
            <input type="text" formControlName="country" placeholder="United States" />
          </label>
          <label>
            Preferred Demo Date (Optional)
            <input type="date" formControlName="preferredDemoDate" />
          </label>
          <label>
            Source
            <select formControlName="source">
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="conference">Conference</option>
              <option value="social">Social</option>
            </select>
          </label>
          <label class="full-width">
            {{ 'Message' | t }}
            <textarea rows="4" formControlName="message"></textarea>
          </label>
          <div>
            <button class="btn btn-primary" type="submit" [disabled]="demoForm.invalid || isSubmitting()">
              {{ (isSubmitting() ? 'Submitting...' : 'Submit Request') | t }}
            </button>
          </div>
        </form>
      </section>

      <footer class="review-footer card">
        <p>© 2026 EduTrack360 • All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support Docs</a>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .review-page {
        max-width: 1160px;
        margin: 0 auto;
        padding: 1.25rem;
        display: grid;
        gap: 1rem;
        position: relative;
      }

      .review-page::before {
        content: "";
        position: absolute;
        right: 1rem;
        top: 0.35rem;
        width: 12rem;
        height: 12rem;
        border-radius: 999px;
        background: radial-gradient(circle, rgb(37 99 235 / 0.16) 0%, transparent 70%);
        pointer-events: none;
      }

      .review-hero {
        background:
          radial-gradient(circle at 90% 15%, rgb(37 99 235 / 0.14) 0%, transparent 32%),
          linear-gradient(135deg, #eff6ff 0%, #ffffff 55%, #f1f5f9 100%);
      }

      .review-badge {
        display: inline-block;
        margin: 0 0 0.35rem;
        font-size: 0.8rem;
        color: #1d4ed8;
        font-weight: 700;
      }

      .review-lang {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 0.65rem;
      }

      :host-context([dir="rtl"]) .review-page,
      :host-context([dir="rtl"]) .review-hero,
      :host-context([dir="rtl"]) .feature-card,
      :host-context([dir="rtl"]) .timeline-item,
      :host-context([dir="rtl"]) .stack-grid article,
      :host-context([dir="rtl"]) .role-chip,
      :host-context([dir="rtl"]) .review-footer {
        text-align: right;
      }

      :host-context([dir="rtl"]) .review-lang {
        justify-content: flex-start;
      }

      :host-context([dir="rtl"]) .timeline-item {
        border-left: none;
        border-right: 4px solid #2563eb;
      }

      :host-context([dir="rtl"]) ul {
        padding-left: 0;
        padding-right: 1rem;
      }

      .review-hero h1 {
        margin: 0;
        font-size: clamp(1.5rem, 4vw, 2.2rem);
      }

      .review-hero p {
        margin: 0.7rem 0 0;
        color: #475569;
        line-height: 1.55;
      }

      .hero-actions {
        display: flex;
        gap: 0.6rem;
        margin-top: 1rem;
        flex-wrap: wrap;
      }

      h2 {
        margin: 0 0 0.8rem;
        font-size: 1.2rem;
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
        gap: 0.75rem;
      }

      .feature-card {
        border: 1px solid #dbe5f4;
        border-radius: 0.85rem;
        padding: 0.85rem;
        background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        box-shadow: 0 10px 20px rgb(15 23 42 / 0.06);
      }

      .feature-card h3,
      .timeline-item h3,
      .stack-grid h3,
      .role-chip h3 {
        margin: 0;
        font-size: 0.95rem;
      }

      .feature-card p,
      .timeline-item p,
      .stack-grid p,
      .role-chip p {
        margin: 0.35rem 0 0;
        color: #64748b;
        font-size: 0.87rem;
      }

      .timeline-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        gap: 0.7rem;
      }

      .timeline-item {
        border-left: 4px solid #2563eb;
        padding: 0.75rem;
        border-radius: 0.7rem;
        background: linear-gradient(150deg, #f8fbff 0%, #ffffff 100%);
        box-shadow: 0 8px 16px rgb(15 23 42 / 0.05);
      }

      .timeline-version {
        color: #1d4ed8 !important;
        font-weight: 700;
      }

      .stack-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        gap: 0.7rem;
      }

      .stack-grid article {
        border: 1px solid #dbe5f4;
        border-radius: 0.8rem;
        padding: 0.75rem;
        background: #ffffff;
        box-shadow: 0 6px 14px rgb(15 23 42 / 0.05);
      }

      .chips-wrap {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        gap: 0.7rem;
      }

      .role-chip {
        border: 1px solid #dbe5f4;
        border-radius: 0.8rem;
        padding: 0.75rem;
        background: linear-gradient(180deg, #f9fbff 0%, #f4f8ff 100%);
      }

      ul {
        margin: 0.6rem 0 0;
        padding-left: 1rem;
      }

      li {
        color: #475569;
        font-size: 0.87rem;
        margin-bottom: 0.3rem;
      }

      .review-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.6rem;
        background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
      }

      .review-footer p {
        margin: 0;
        color: #64748b;
      }

      .footer-links {
        display: flex;
        gap: 0.8rem;
      }

      .footer-links a {
        text-decoration: none;
        color: #1d4ed8;
        font-size: 0.85rem;
      }

      @media (max-width: 768px) {
        .review-page {
          padding: 0.85rem;
        }

        .two-col {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectReviewPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly toastService = inject(ToastService);
  readonly isSubmitting = signal(false);

  readonly coreFeatures = [
    {
      title: 'School Onboarding & Multi-Tenancy',
      description: 'Tenant-isolated onboarding, school provisioning, and status governance.'
    },
    {
      title: 'Real-Time Bus Tracking',
      description: 'Live location updates, route visualization, and ETA visibility for families.'
    },
    {
      title: 'Emergency Notifications',
      description: 'Instant critical alerts with priority handling for incidents and breakdowns.'
    },
    {
      title: 'School Branding & White-Label',
      description: 'School-specific logos, themes, and branded communication experiences.'
    },
    {
      title: 'Administration-Parent Communication',
      description: 'Structured two-way messaging between parents, teachers, and administrators.'
    },
    {
      title: 'User Management & Authentication',
      description: 'Role-based access control with secure JWT session management.'
    }
  ];

  readonly productVersions = [
    {
      version: 'Version 1.0',
      title: 'Core Student & Transportation Tracking',
      description: 'Current platform focus with communication and safety tracking foundations.'
    },
    {
      version: 'Version 2.0',
      title: 'HR Management System',
      description: 'Coming soon with school workforce and staffing workflows.'
    },
    {
      version: 'Version 3.0',
      title: 'Student Achievement Platform',
      description: 'Coming soon with recognition, milestones, and public achievement pages.'
    }
  ];

  readonly techStack = [
    { layer: 'Frontend (Web)', technology: 'Angular (latest stable)' },
    { layer: 'Frontend (Mobile)', technology: 'Ionic Framework with Angular' },
    { layer: 'Backend', technology: 'Java 21 + Spring Boot 3' },
    { layer: 'Database', technology: 'MySQL 8.0+' },
    { layer: 'Real-time', technology: 'WebSocket (STOMP over SockJS)' },
    { layer: 'Authentication', technology: 'Spring Security + JWT' },
    { layer: 'Push Notifications', technology: 'Firebase Cloud Messaging' },
    { layer: 'AI/ML', technology: 'Spring AI + predictive analytics services' }
  ];

  readonly roles = [
    { name: 'System Admin', access: 'Global multi-tenant management (web)' },
    { name: 'School Principal', access: 'School-wide administration and approvals' },
    { name: 'Assistant Principal', access: 'Delegated school-wide operations' },
    { name: 'Teacher', access: 'Class/grade communication and student visibility' },
    { name: 'Parent/Guardian', access: 'Student-specific tracking and notifications' },
    { name: 'Student', access: 'Self-information and announcements' }
  ];

  readonly demoForm = this.formBuilder.nonNullable.group({
    schoolName: ['', [Validators.required]],
    contactName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    schoolSize: ['', [Validators.required]],
    country: [''],
    preferredDemoDate: [''],
    source: ['website', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  scrollToDemo(): void {
    document.getElementById('demo-request')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  submitDemo(): void {
    if (this.demoForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.demoForm.getRawValue();

    this.api
      .submitDemoRequest({
        schoolName: formValue.schoolName,
        contactName: formValue.contactName,
        email: formValue.email,
        phone: formValue.phone,
        schoolSize: formValue.schoolSize,
        message: formValue.message,
        country: formValue.country || undefined,
        preferredDemoDate: formValue.preferredDemoDate || undefined,
        source: formValue.source
      })
      .subscribe({
        next: (response) => {
          const data = extractData<{ requestId?: string }>(response);
          this.toastService.show(
            'Demo request received',
            data.requestId
              ? `Request ID: ${data.requestId}. Our team will contact you shortly.`
              : 'Our team will contact you shortly with scheduling options.',
            'success'
          );

          this.demoForm.reset({
            schoolName: '',
            contactName: '',
            email: '',
            phone: '',
            schoolSize: '',
            country: '',
            preferredDemoDate: '',
            source: 'website',
            message: ''
          });
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
  }
}
