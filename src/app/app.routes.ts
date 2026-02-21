import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth.guard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'review'
	},
	{
		path: 'review',
		loadComponent: () => import('./features/project-review/project-review.page').then((m) => m.ProjectReviewPage)
	},
	{
		path: 'login',
		loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage)
	},
	{
		path: '',
		loadComponent: () => import('./layout/app-shell.component').then((m) => m.AppShellComponent),
		canActivate: [authGuard],
		children: [
			{
				path: 'dashboard',
				loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
				canActivate: [roleGuard(['PRINCIPAL', 'ASSISTANT_PRINCIPAL', 'TEACHER', 'PARENT'])]
			},
			{
				path: 'users',
				loadComponent: () => import('./features/users/users.page').then((m) => m.UsersPage),
				canActivate: [roleGuard(['PRINCIPAL', 'ASSISTANT_PRINCIPAL'])]
			},
			{
				path: 'students',
				loadComponent: () => import('./features/students/students.page').then((m) => m.StudentsPage),
				canActivate: [roleGuard(['PRINCIPAL', 'ASSISTANT_PRINCIPAL', 'TEACHER'])]
			},
			{
				path: 'buses',
				loadComponent: () => import('./features/buses/buses.page').then((m) => m.BusesPage),
				canActivate: [roleGuard(['PRINCIPAL', 'ASSISTANT_PRINCIPAL', 'TEACHER'])]
			},
			{
				path: 'messages',
				loadComponent: () => import('./features/messages/messages.page').then((m) => m.MessagesPage)
			},
			{
				path: 'notifications',
				loadComponent: () =>
					import('./features/notifications/notifications.page').then((m) => m.NotificationsPage)
			},
			{
				path: 'admin/schools',
				loadComponent: () =>
					import('./features/system-admin/schools.page').then((m) => m.SystemAdminSchoolsPage),
				canActivate: [roleGuard(['SYSTEM_ADMIN'])]
			},
			{
				path: 'admin/system-admins',
				loadComponent: () =>
					import('./features/system-admin/system-admins.page').then((m) => m.SystemAdminsPage),
				canActivate: [roleGuard(['SYSTEM_ADMIN'])]
			},
			{
				path: 'admin/demo-requests',
				loadComponent: () =>
					import('./features/system-admin/demo-requests.page').then((m) => m.DemoRequestsPage),
				canActivate: [roleGuard(['SYSTEM_ADMIN'])]
			},
			{
				path: 'school/relationships',
				loadComponent: () =>
					import('./features/school-admin/relationships.page').then(
						(m) => m.SchoolRelationshipsPage
					),
				canActivate: [roleGuard(['PRINCIPAL', 'ASSISTANT_PRINCIPAL'])]
			},
			{
				path: 'school/bus-assignments',
				loadComponent: () =>
					import('./features/school-admin/bus-assignments.page').then(
						(m) => m.SchoolBusAssignmentsPage
					),
				canActivate: [roleGuard(['PRINCIPAL', 'ASSISTANT_PRINCIPAL'])]
			},
			{
				path: 'parent/portal',
				loadComponent: () => import('./features/parent/parent-portal.page').then((m) => m.ParentPortalPage),
				canActivate: [roleGuard(['PARENT'])]
			},
			{
				path: 'student/portal',
				loadComponent: () => import('./features/student/student-portal.page').then((m) => m.StudentPortalPage),
				canActivate: [roleGuard(['STUDENT'])]
			}
		]
	},
	{
		path: '**',
		redirectTo: 'review'
	}
];
