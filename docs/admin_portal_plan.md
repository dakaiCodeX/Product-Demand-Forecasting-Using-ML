# Admin Portal Technical Plan

## 1. Overview
The goal is to design a multi-language admin portal with a vanilla JavaScript front end, a FastAPI back end, and a Microsoft SQL Server database. The portal must support dynamic menus based on user roles and permissions, provide notification and alarm widgets, and include an administration interface for managing users, roles, and menu access.

### Key Functional Requirements
- Authentication with login landing on a personalized home page.
- Header containing user profile info, notifications, and alarms.
- Sidebar menu showing items allowed by the user's role/permissions.
- Main content area that loads pages selected from the menu.
- Admin console for managing users, roles, permissions, menu visibility, localization keys, and notification templates.
- Full multi-language support (TR, EN, DE) across UI and stored strings.

## 2. System Architecture
- **Client (vanilla JS)**: Single-page layout using native Web Components or modular ES6 modules. Communication with the API via REST (JSON) and WebSockets for real-time alerts.
- **Backend (FastAPI)**: RESTful services, authentication (JWT with refresh tokens), role-based access control, localization API, notification management, and WebSocket hub.
- **Database (MS SQL Server)**: Normalized schema with translation tables, RBAC tables, content storage, and audit trail.
- **Infrastructure**: Containerized deployment (Docker) with reverse proxy (Nginx) terminating TLS. CI/CD pipeline running lint/test/build.

### Component Breakdown
1. **Auth Service**: Login, logout, password reset, token refresh.
2. **User Management**: CRUD for users, role assignments, permissions.
3. **Menu Management**: Create menus, assign to roles/permissions, order management.
4. **Localization Service**: Store and retrieve localized strings.
5. **Notification Service**: Manage notifications, alarms, and delivery channels (WebSocket/push/email placeholder).
6. **Content Modules**: Feature-specific pages (dashboard, reports, settings) served via dynamic loading.

## 3. Front-End Structure
```
frontend/
  index.html
  assets/
  css/
  js/
    api/
    components/
    pages/
    state/
    utils/
  i18n/
    en.json
    tr.json
    de.json
```
- **Entry Point (`index.html`)**: Bootstraps the layout (header, sidebar, main content).
- **State Management**: Lightweight store (e.g., simple pub/sub) for auth state, menu state, language selection.
- **Routing**: Hash-based routing for vanilla JS (e.g., `#dashboard`).
- **Localization**: Load JSON dictionaries per language and expose translation helper.
- **HTTP Layer**: Fetch wrappers adding auth headers, handling refresh on 401.
- **WebSocket Client**: Connect to notifications endpoint for real-time updates.

### UI Components
- `HeaderComponent`: Displays logo, language selector, user menu, notification/alarm badges.
- `SidebarMenu`: Renders dynamic menu items; collapsible for mobile.
- `MainContent`: Renders selected page module via dynamic import.
- `AdminPanel`: Access-controlled component for managing users/roles/menus.
- Shared UI elements: Modal, Table, Form, Alert, Loader.

## 4. Backend (FastAPI) Structure
```
backend/
  app/
    main.py
    core/
      config.py
      security.py
      localization.py
    db/
      session.py
      base.py
    models/
      user.py
      role.py
      menu.py
      notification.py
      localization.py
      audit.py
    schemas/
      user.py
      role.py
      menu.py
      auth.py
      notification.py
      localization.py
    api/
      deps.py
      routes/
        auth.py
        users.py
        roles.py
        menus.py
        localization.py
        notifications.py
    services/
      user_service.py
      notification_service.py
      menu_service.py
    websocket/
      manager.py
    tests/
      ...
```
- **Config**: Environment-driven settings (DB URL, JWT secret, supported languages).
- **Security**: Password hashing (Passlib), JWT token management, RBAC decorator dependencies.
- **Localization**: Helpers to fetch translations by key/language; fallback logic.
- **Services**: Business logic separated from routers.
- **Testing**: Pytest-based with async support.

### API Endpoints (sample)
- `POST /auth/login` – Authenticate user.
- `POST /auth/refresh` – Refresh token.
- `GET /users/me` – Current user profile.
- `GET/POST/PUT/DELETE /users` – CRUD operations.
- `GET/POST/PUT/DELETE /roles` – Manage roles and permissions.
- `GET/POST/PUT/DELETE /menus` – Manage menus and assign to roles.
- `GET/POST/PUT/DELETE /localization/keys` – Manage localized strings.
- `GET /notifications` – Fetch user notifications.
- `POST /notifications` – Create new notification/alarm.
- `WS /notifications/ws` – Real-time notifications.

## 5. Database Schema (MS SQL Server)
Key tables with essential columns:

- **Users** (`Users`)
  - `Id` (PK, uniqueidentifier)
  - `Username`, `Email`, `PasswordHash`, `IsActive`
  - `PreferredLanguage`, `CreatedAt`, `UpdatedAt`

- **Roles** (`Roles`)
  - `Id`, `Name`, `Description`

- **Permissions** (`Permissions`)
  - `Id`, `Code`, `Description`

- **RolePermissions** (`RolePermissions`)
  - `RoleId`, `PermissionId`

- **Menus** (`Menus`)
  - `Id`, `Code`, `ParentId`, `Order`, `Path`, `Icon`

- **MenuTranslations** (`MenuTranslations`)
  - `MenuId`, `LanguageCode`, `Title`

- **MenuPermissions** (`MenuPermissions`)
  - `MenuId`, `PermissionId`

- **LocalizationKeys** (`LocalizationKeys`)
  - `Id`, `Key`, `Description`

- **LocalizationValues** (`LocalizationValues`)
  - `LocalizationKeyId`, `LanguageCode`, `Value`

- **Notifications** (`Notifications`)
  - `Id`, `Type`, `TitleKey`, `MessageKey`, `Severity`, `CreatedAt`, `CreatedBy`

- **UserNotifications** (`UserNotifications`)
  - `NotificationId`, `UserId`, `IsRead`, `ReadAt`

- **AuditLogs** (`AuditLogs`)
  - `Id`, `UserId`, `Action`, `EntityName`, `EntityId`, `Timestamp`, `Changes`

### Relationships
- Users ↔ Roles: Many-to-many via `UserRoles` table (`UserId`, `RoleId`).
- Roles ↔ Permissions: Many-to-many via `RolePermissions`.
- Menus ↔ Permissions: Many-to-many via `MenuPermissions`.
- Localization tables decouple keys from languages.

### Sample Seed Data
- Roles: Admin, Manager, Viewer.
- Permissions: `user.manage`, `menu.manage`, `notification.view`, etc.
- Menus: Dashboard, Admin (Users, Roles, Menus), Notifications.
- Localization values for TR, EN, DE.

## 6. Authentication & Authorization Flow
1. User logs in with username/password (`/auth/login`).
2. FastAPI verifies credentials, returns access + refresh JWT tokens. Tokens embed role/permission claims.
3. Front-end stores tokens in memory (access) and httpOnly cookie (refresh) to reduce XSS risk.
4. Each API request includes the access token in `Authorization` header. On expiry, refresh token used to obtain new access token.
5. Route dependencies check for required permissions before executing.
6. Menu API returns menu tree filtered by the user's permissions.

## 7. Localization Strategy
- Front-end loads language pack based on user preference or browser setting.
- Back-end returns strings keyed by translation keys; front-end resolves via dictionaries.
- Admin panel includes interface to add/update translations. FastAPI caches translations with invalidation on update.
- Support RTL languages later by including direction flag in language metadata.

## 8. Notification & Alarm Handling
- Notifications stored in DB; targeted (user-specific) or broadcast.
- Alarm types flagged with severity (info/warning/critical).
- FastAPI WebSocket manager pushes new notifications to connected clients filtered by user.
- Front-end `NotificationService` listens and updates header badges and history list.

## 9. Deployment & DevOps
- Docker Compose with services: `frontend`, `backend`, `mssql`, `nginx`.
- Use Alembic for database migrations executed during deployment.
- GitHub Actions pipeline:
  - Lint (ESLint for JS, Ruff for Python).
  - Backend unit tests (Pytest) and integration tests (with SQL Server container).
  - Front-end unit tests (Jest with jsdom).
  - Build artifacts and push Docker images.

## 10. Next Steps for Implementation
1. Scaffold repository structure with `frontend/` and `backend/` directories.
2. Configure FastAPI project with core modules and initial models/schemas.
3. Set up SQLAlchemy models matching schema; configure Alembic migrations.
4. Build authentication workflow and user management endpoints.
5. Implement menu management and localization endpoints.
6. Develop vanilla JS components (header, sidebar, content router).
7. Integrate localization dictionaries and language switcher.
8. Implement notification service (API + WebSocket + front-end client).
9. Create admin panel UI for managing users/roles/menus/translations.
10. Add automated tests and CI pipeline configuration.

## 11. Security Considerations
- Hash passwords with bcrypt (Passlib) and enforce password policies.
- Rate-limit login attempts; log auth events for audit.
- Implement CSRF protections for state-changing requests (tokens in headers + CORS settings).
- Validate user input on both client and server; use Pydantic models for request validation.
- Store secrets via environment variables or secret manager.

## 12. Performance & Scalability
- Cache menu and localization data with TTL to reduce DB hits.
- Utilize async SQLAlchemy (or encode/databases) for non-blocking DB operations.
- Implement pagination for tables (users, notifications).
- Support horizontal scaling by deploying multiple backend instances behind load balancer; WebSocket manager uses Redis Pub/Sub for fan-out.

