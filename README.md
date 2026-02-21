# EduTrack 360 Web Application

Professional Angular 21 web client for EduTrack 360 School Management System.

## Implemented Modules

- Authentication (tenant-aware login)
- Role-based navigation and route guards
- Dashboard (school/parent metrics)
- Users management
- Students management
- Transport (buses) management
- Messaging (compose + inbox)
- Notifications (list + mark read)
- System Admin school management
- Premium corner popup alerts (toast notifications)

## UI Theme

Primary palette follows project requirement:
- Blue (`#2563EB`, `#1D4ED8`)
- Gray (`#0F172A`, `#64748B`, `#D6DEED`)
- White (`#FFFFFF`, light tints)

## API Source of Truth

API integration follows:

- `documents/EduTrack360_Postman_Collection.json`
- `documents/EduTrack360_Dev_Environment.postman_environment.json`

Default API base URL in app:

- `http://localhost:8087`

## Run Locally

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Build and Test

```bash
npm run build
npm test -- --watch=false
```

## Mobile Handoff

Mobile design and UX handoff is available at:

- `documents/MOBILE_UI_HANDOFF.md`
