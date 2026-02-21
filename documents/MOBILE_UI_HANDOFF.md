# EduTrack 360 Mobile UI Handoff

## 1) Purpose
This document provides the exact visual and UX blueprint used in the EduTrack 360 web app so a mobile developer can implement matching iOS/Android screens.

## 2) Visual Design Tokens
Use these tokens consistently across mobile:

- Primary Blue: `#2563EB`
- Primary Blue (hover/pressed): `#1D4ED8`
- Primary Soft: `#DBEAFE`
- Page Background: `#F4F7FB`
- Surface/Card: `#FFFFFF`
- Surface Soft: `#F8FAFF`
- Border: `#D6DEED`
- Text Primary: `#0F172A`
- Text Secondary: `#64748B`
- Error: `#EF4444`

Typography:
- Font Family: Inter (fallback: system sans-serif)
- Screen heading: 20-22 semibold
- Section heading: 18 semibold
- Body: 14-16 regular
- Metadata labels: 12-13 medium

Spacing:
- Base unit: 4px
- Common spacing: 8, 12, 16, 24
- Card radius: 16px
- Input radius: 10-12px
- Button radius: 10-12px

Shadows:
- Cards: `0 10 24 rgba(15, 23, 42, 0.08)`
- Toast popup: `0 20 40 rgba(15, 23, 42, 0.14)`

## 3) Global Layout Patterns
- App shell has persistent role-based navigation.
- Top bar shows current module title and logged-in user identity.
- Main content uses cards for each functional block.
- Data-heavy sections use table/list views with clear row separation.

Mobile adaptation:
- Sidebar converts to bottom tab bar or drawer menu.
- Top bar keeps title + profile action.
- Use stacked cards instead of tables on small screens.

## 4) Key Screen Inventory
Implement these screens in mobile, mirroring web behavior:

1. Login
- Fields: `usernameOrEmail`, `password`, `schoolSubdomain`
- Primary CTA: Sign In

2. Dashboard
- KPI metric cards from role-specific dashboard endpoint
- Quick actions: Add User, Add Student, Send Message

3. Users Management
- Create user form: username, email, role, firstName, lastName, password
- List users with role and status

4. Students Management
- Create student form: firstName, lastName, gender, gradeLevel, className, status
- Student list

5. Bus Management
- Create bus form: busNumber, licensePlate, capacity, driverName, driverPhone, status
- Bus list

6. Messages
- Compose message: subject, content, recipientUserIds[]
- Inbox list

7. Notifications
- List notifications
- Mark notification as read

8. System Admin Schools
- Create school form: name, subdomain, email, phoneNumber, address, principalFirstName, principalLastName, principalEmail
- School list

## 5) Corner Popup Alert Design (Critical)
The web app uses refined corner popup alerts. Recreate this exactly in mobile as a floating toast system.

Toast behavior:
- Position: bottom-right on tablet/web; bottom-center on small mobile
- Auto-dismiss: ~4200 ms
- Manual dismiss with close action
- Stack multiple toasts vertically with 8-12px gap

Toast structure:
- Header: title + close icon button
- Body: concise message text
- Left accent border by variant:
  - Success: Blue accent
  - Error: Red accent
  - Info: Slate accent
  - Warning: Amber accent
- Background gradient: white to very light blue

Accessibility:
- Announce with live-region equivalent
- Dismiss button must have accessible label
- Maintain contrast ratio WCAG AA

## 6) API Integration Parity
Use the same API contract from Postman collection:
- Base URL: `http://localhost:8087`
- Auth: Bearer token
- Login endpoint: `/api/auth/login`
- Attach token to all protected requests
- On 401: clear session and redirect to login
- Show toast on API errors with server-provided message when available

## 7) UX/State Rules
- Keep role-based navigation strict (SYSTEM_ADMIN, PRINCIPAL, ASSISTANT_PRINCIPAL, TEACHER, PARENT, STAFF).
- On successful create actions, show success toast and refresh the list.
- For empty lists, show clear empty states.
- Keep forms short and grouped by domain.

## 8) Delivery Checklist for Mobile Developer
- [ ] Implement tokenized design system above
- [ ] Build all 8 screens with same fields and flows
- [ ] Implement floating toast alert system exactly as specified
- [ ] Implement JWT auth with 401 auto-logout behavior
- [ ] Enforce role-based visibility for modules
- [ ] Verify responsive layout for phone and tablet
