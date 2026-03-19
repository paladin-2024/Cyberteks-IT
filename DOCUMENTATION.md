# CyberteksIT LMS — Full Project Documentation

> **Company:** CyberteksIT — ICT Solutions & Training, Kampala, Uganda
> **Project type:** Full-stack web application (Marketing site + Learning Management System)
> **Status:** Development / Pre-production

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Folder Structure](#3-folder-structure)
4. [Architecture & Route Groups](#4-architecture--route-groups)
5. [Authentication System](#5-authentication-system)
6. [Database & ORM](#6-database--orm)
7. [UI & Design System](#7-ui--design-system)
8. [Internationalisation (EN/FR)](#8-internationalisation-enfr)
9. [Email System](#9-email-system)
10. [File Uploads](#10-file-uploads)
11. [Real-time Messaging](#11-real-time-messaging)
12. [Rate Limiting](#12-rate-limiting)
13. [API Reference](#13-api-reference)
14. [Role-based Access Control](#14-role-based-access-control)
15. [Forms & Validation](#15-forms--validation)
16. [Marketing Section](#16-marketing-section)
17. [LMS Portal](#17-lms-portal)
18. [Environment Variables](#18-environment-variables)
19. [Running the Project](#19-running-the-project)
20. [Seed Data & Test Credentials](#20-seed-data--test-credentials)
21. [Security Measures](#21-security-measures)
22. [Deployment Notes](#22-deployment-notes)

---

## 1. Project Overview

CyberteksIT LMS is a dual-purpose web platform:

- **Marketing website** — presents CyberteksIT's IT services (CCTV, VoIP, Access Control, Remote Support, ICT Skilling, Software/AI), allows visitors to apply for training programs, request IT support, and contact the company.
- **LMS portal** — a role-based Learning Management System where:
  - **Admins** manage users, courses, applications, invoices, and platform settings.
  - **Teachers** manage their courses and communicate with students.
  - **Students** access enrolled courses, track progress, download certificates, and message instructors.

---

## 2. Technology Stack

### Core Framework

| Technology | Version | Why it was chosen |
|------------|---------|-------------------|
| **Next.js 15** | ^15.1.0 | The App Router model allows co-locating server components, client components, and API routes in one project. It provides built-in image optimisation, security headers, and seamless deployment to Vercel. |
| **React 19** | ^19.0.0 | Required by Next.js 15. Offers concurrent rendering and improved hydration. |
| **TypeScript** | ^5.7 | Catches type errors at compile time. Especially important for a project with multiple roles, complex Prisma models, and NextAuth session types. |

### Styling

| Technology | Why |
|------------|-----|
| **Tailwind CSS** | Utility-first CSS that keeps styles co-located with components. The custom `primary-red` and `primary-blue` colors, `font-heading`, and sidebar tokens are configured in `tailwind.config.ts`. |
| **CSS Variables (globals.css)** | Enables a full dark/light theme system. All semantic tokens (`--background`, `--foreground`, `--card`, `--border`, etc.) are defined here. Tailwind reads these via `hsl(var(--token))`. |
| **Framer Motion** | Scroll-triggered animations and entrance effects on the marketing pages, inspired by edgetechuganda.com. |
| **Glassmorphism utilities** | `.glass` and `.glass-dark` CSS utility classes in `globals.css` create the frosted-glass effect used in the hero section. |
| **Clip-path dividers** | `.clip-slant-down` and `.clip-slant-up` CSS utilities create the angled section transitions seen between hero and services sections. |

### Authentication

| Technology | Why |
|------------|-----|
| **NextAuth v5 (beta)** | The v5 "Auth.js" rewrite is built for Next.js App Router. It exports an `auth()` server function that can be called in server components and middleware — no need to use client-side hooks for protected pages. |
| **@auth/prisma-adapter** | Bridges NextAuth with the Prisma ORM, so sessions, accounts, and verification tokens are stored in the same PostgreSQL database as all other data. |
| **bcryptjs** | Hashes passwords before saving to the database. Used in both `lib/auth.ts` (login) and `prisma/seed.ts` (seeding test users). |
| **JWT session strategy** | Chosen over database sessions because it requires no extra DB query on every request — the user's `id` and `role` are embedded in the token itself. |

### Database

| Technology | Why |
|------------|-----|
| **PostgreSQL (Neon.tech)** | Neon provides serverless PostgreSQL with connection pooling. It scales to zero when idle (important for early-stage projects) and provides a free tier. |
| **Prisma 5** | Type-safe ORM that auto-generates TypeScript types from the schema. Queries like `prisma.user.findUnique` are fully typed. Migrations are tracked in version control. |

### UI Components

| Technology | Why |
|------------|-----|
| **Radix UI primitives** | Unstyled, accessible components (Dialog, DropdownMenu, Tabs, Select, etc.) that are wired up with Tailwind. Eliminates the need to build ARIA-compliant modals/menus from scratch. |
| **Lucide React** | Consistent SVG icon set. Every icon used in the project (BookOpen, Users, Bell, etc.) comes from here. |
| **recharts** | The shadcn/ui chart system is built on recharts. CyberteksIT uses custom `ChartArea`, `ChartBar`, `ChartLine`, and `ChartPie` components (in `components/ui/chart.tsx`) that read colors from CSS variables — so they automatically adapt to dark/light mode. |
| **class-variance-authority + tailwind-merge** | Used for building variant-based component APIs (e.g. a button that is `primary`, `outline`, or `ghost`). |

### Forms

| Technology | Why |
|------------|-----|
| **react-hook-form** | Performant form library that avoids re-rendering the whole form on every keystroke. Used for all forms: contact, apply (6-step wizard), IT support, login, forgot-password. |
| **Zod** | Schema-first validation. The same Zod schema validates data both on the client (via react-hook-form resolver) and on the server (inside the API route). This guarantees they can never drift apart. |

### Email

| Technology | Why |
|------------|-----|
| **Resend** | Developer-friendly transactional email API with excellent deliverability. Used for contact form emails, application confirmations, IT support requests, and password reset links. |

### File Storage

| Technology | Why |
|------------|-----|
| **Cloudinary** | Cloud-based image and file storage with automatic optimisation. Used for course thumbnails, user profile pictures, and document uploads. The `next-cloudinary` package provides a Next.js-optimised `<CldImage>` component. |

### Real-time

| Technology | Why |
|------------|-----|
| **Pusher** | WebSocket-as-a-service used for real-time chat between students and teachers/instructors. The East Africa cluster (`ap2`) is used to minimise latency for Ugandan users. |

### Rate Limiting

| Technology | Why |
|------------|-----|
| **Upstash Redis** | Serverless Redis used with `@upstash/ratelimit` to prevent spam on public-facing API endpoints (contact form, password reset, applications). |

### Theming

| Technology | Why |
|------------|-----|
| **next-themes** | Manages dark/light mode by toggling the `.dark` CSS class on `<html>`. Works seamlessly with Tailwind's `dark:` variant and the CSS variable system. |

### 3D / Advanced Graphics (optional / future)

| Technology | Why |
|------------|-----|
| **@react-three/fiber + drei + three.js** | Ready for future 3D visualisations or interactive elements on the marketing site (e.g. animated globe for VoIP section). Currently installed but not yet actively used in components. |

### Drag & Drop (future use)

| Technology | Why |
|------------|-----|
| **@dnd-kit** | Will be used for the course builder — letting teachers drag and drop lesson cards to reorder them within a section. |

---

## 3. Folder Structure

```
cyberteks-lms/
├── app/                        # Next.js App Router root
│   ├── (auth)/                 # Auth route group (no shared layout with LMS)
│   │   ├── layout.tsx          # Split layout: blue panel left, form right
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (lms)/                  # LMS portal route group
│   │   ├── layout.tsx          # Auth guard + Sidebar + TopBar wrapper
│   │   ├── dashboard/page.tsx  # Redirect to /role/dashboard
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── applications/page.tsx
│   │   │   ├── courses/page.tsx
│   │   │   ├── invoices/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── users/page.tsx
│   │   ├── teacher/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── courses/page.tsx
│   │   │   └── messages/page.tsx
│   │   └── student/
│   │       ├── dashboard/page.tsx
│   │       ├── courses/page.tsx
│   │       ├── certificates/page.tsx
│   │       ├── messages/page.tsx
│   │       └── notifications/page.tsx
│   ├── (marketing)/            # Public marketing pages
│   │   ├── layout.tsx          # Navbar + Footer wrapper
│   │   ├── page.tsx            # Home page
│   │   ├── about/page.tsx
│   │   ├── apply/page.tsx
│   │   ├── careers/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── get-started/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── products/page.tsx
│   │   ├── terms-of-use/page.tsx
│   │   └── services/
│   │       ├── page.tsx        # Services overview
│   │       ├── access-control/page.tsx
│   │       ├── cctv/page.tsx
│   │       ├── ict-skilling/page.tsx
│   │       ├── remote-it-support/page.tsx
│   │       ├── software-ai/page.tsx
│   │       └── voip/page.tsx
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   └── forgot-password/route.ts
│   │   ├── admin/
│   │   │   ├── applications/route.ts
│   │   │   ├── courses/route.ts
│   │   │   ├── invoices/route.ts
│   │   │   └── users/route.ts
│   │   ├── apply/route.ts
│   │   ├── contact/route.ts
│   │   ├── get-started/route.ts
│   │   ├── messages/route.ts
│   │   ├── notifications/route.ts
│   │   └── upload/route.ts
│   ├── globals.css             # CSS variables, utility classes, fonts
│   └── layout.tsx              # Root layout (ThemeProvider + LanguageProvider)
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── ForgotPasswordForm.tsx
│   ├── lms/
│   │   ├── admin/
│   │   │   └── ApplicationRow.tsx
│   │   ├── shell/
│   │   │   ├── Sidebar.tsx     # Role-aware collapsible sidebar
│   │   │   └── TopBar.tsx      # Search + dark mode + notifications
│   │   ├── shared/
│   │   │   └── DarkModeToggle.tsx
│   │   ├── student/
│   │   │   └── CourseProgressCard.tsx
│   │   └── teacher/
│   │       └── StudentRow.tsx
│   ├── marketing/
│   │   ├── Navbar.tsx          # Mega-menu, language switcher, scroll effect
│   │   ├── Footer.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── ApplyForm.tsx       # 6-step wizard
│   │   ├── ContactForm.tsx
│   │   ├── ITSupportForm.tsx   # 5-section form
│   │   └── home/
│   │       ├── HeroSection.tsx
│   │       ├── ServicesSection.tsx
│   │       ├── StatsSection.tsx
│   │       ├── ClientsSection.tsx
│   │       └── CTASection.tsx
│   └── ui/
│       └── chart.tsx           # shadcn-style recharts wrappers
│
├── emails/                     # HTML email template functions
│   ├── ApplicationConfirmation.tsx
│   ├── PasswordReset.tsx
│   └── WelcomeStudent.tsx
│
├── hooks/                      # Custom React hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMounted.ts
│
├── lib/
│   ├── auth.ts                 # NextAuth v5 configuration
│   ├── i18n/
│   │   ├── LanguageContext.tsx # React context for EN/FR switching
│   │   └── translations.ts    # All EN and FR strings
│   ├── prisma.ts              # Prisma client singleton
│   ├── utils.ts               # cn() helper (clsx + tailwind-merge)
│   └── validations/
│       ├── apply.ts           # Zod schema for application form
│       ├── contact.ts         # Zod schema for contact form
│       └── it-support.ts      # Zod schema for IT support form
│
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed.ts                # Initial data seeding script
│
├── public/
│   └── assets/                # Static images, logos
│
├── types/
│   └── next-auth.d.ts         # TypeScript augmentation for session types
│
├── middleware.ts               # Route protection + role-based redirects
├── next.config.ts             # Security headers, image domains
├── tailwind.config.ts         # Custom colors, fonts, animations
├── tsconfig.json
├── package.json
├── .env                       # Your real environment variables (never commit)
└── .env.example               # Template with placeholder values
```

---

## 4. Architecture & Route Groups

Next.js App Router **route groups** (parentheses in folder names) let you share a layout among pages without that folder name appearing in the URL.

| Group | URL prefix | Layout | Purpose |
|-------|-----------|--------|---------|
| `(marketing)` | `/`, `/about`, `/services/...` | Navbar + Footer | Public-facing website |
| `(auth)` | `/login`, `/forgot-password` | Split blue-panel layout | Authentication screens |
| `(lms)` | `/admin/...`, `/teacher/...`, `/student/...` | Sidebar + TopBar | LMS portal (protected) |

This means `/admin/dashboard` is served by `app/(lms)/admin/dashboard/page.tsx`, and the LMS layout (sidebar, topbar) wraps it automatically.

---

## 5. Authentication System

### Flow

1. User visits `/login` → `LoginForm` component
2. Submits email + password via `signIn('credentials', ...)` from `next-auth/react`
3. NextAuth calls the `authorize()` function in `lib/auth.ts`
4. Prisma queries the `users` table and verifies the bcrypt password hash
5. On success, NextAuth creates a JWT containing `{ id, role }`
6. All subsequent requests carry this JWT as a cookie
7. `middleware.ts` reads the session from the JWT on every request and enforces role-based routing

### Password Reset

1. User submits `/forgot-password` form
2. `POST /api/auth/forgot-password` checks if the email exists
3. Generates a `crypto.randomBytes(32)` token, stores in `VerificationToken` (expires 1 hour)
4. Sends a password reset email via Resend
5. Old tokens for the same email are deleted before creating a new one (prevents token accumulation)

### Session

- Strategy: **JWT** (no database roundtrip per request)
- Max age: **30 days**
- The JWT payload is augmented with `id` and `role` via the `jwt` callback in `lib/auth.ts`
- TypeScript types are extended in `types/next-auth.d.ts` and `next-auth/jwt`

---

## 6. Database & ORM

### Models Summary

| Model | Purpose |
|-------|---------|
| `User` | All users (admin, teacher, student). Password is hashed. |
| `Account`, `Session`, `VerificationToken` | NextAuth adapter tables |
| `Application` | Training program applications submitted via the website |
| `Course` | A course has a teacher, sections, and enrollments |
| `Section` | A chapter/module within a course |
| `Lesson` | A single lesson (video, document, quiz, assignment, live) |
| `Quiz`, `QuizQuestion`, `QuizAttempt` | Quiz system linked to a lesson |
| `Enrollment` | Links a student to a course; tracks progress % and status |
| `LessonProgress` | Per-lesson completion tracking for each student |
| `Certificate` | Issued when enrollment status becomes COMPLETED |
| `Invoice` | Payment records in UGX; tracks DRAFT/SENT/PAID/OVERDUE |
| `Conversation`, `ConversationParticipant` | Chat thread with participants |
| `Message` | Individual messages within a conversation |
| `Notification` | In-app notifications for each user |

### Key Design Decisions

- **Soft relations with onDelete:** Most relations cascade delete (enrollments, lessons, progress). Invoices use `SetNull` on courseId to preserve payment history even if a course is removed.
- **Indexes added:** `Application(email)`, `Application(status)`, `Message(conversationId, senderId, receiverId)`, `Notification(userId, createdAt)` — for fast queries on these high-traffic tables.
- **Enum types:** `Role`, `ApplicationStatus`, `EnrollmentStatus`, `CourseStatus`, `LessonType`, `InvoiceStatus`, `NotificationType`, `MessageStatus` — prevents invalid string values at the DB level.

---

## 7. UI & Design System

### Colors

| Token | Hex | Tailwind class | Usage |
|-------|-----|---------------|-------|
| Primary Red | `#E11D48` | `text-primary-red`, `bg-primary-red` | CTAs, error states, badges |
| Primary Blue | `#102a83` | `text-primary-blue`, `bg-primary-blue` | Navigation, headings, buttons |

### Typography

| Font | Variable | Usage |
|------|----------|-------|
| **Sora** | `font-sans` | Body text, paragraphs, UI labels |
| **Space Grotesk** | `font-heading` | All headings (h1–h3), card titles, section names |

### Dark Mode

Dark mode is toggled by adding/removing the `.dark` class on `<html>` via `next-themes`. All components use **semantic CSS variable tokens** (`bg-card`, `text-foreground`, `border-border`) rather than direct color values, so they switch automatically.

### Charts

Charts are built as shadcn-compatible wrappers around recharts in `components/ui/chart.tsx`:

| Component | Chart type | Used in |
|-----------|-----------|---------|
| `ChartArea` | Area chart | Admin enrollment trends |
| `ChartBar` | Bar chart | Admin revenue, teacher completion |
| `ChartLine` | Line chart | Student study hours, teacher active students |
| `ChartPie` | Pie / Donut | Admin program distribution, student time by course |

All chart colors read from CSS variables (`hsl(var(--chart-1))` through `hsl(var(--chart-5))`), so they adapt to dark/light mode.

---

## 8. Internationalisation (EN/FR)

Language switching is implemented **client-side** without any external i18n library:

- `lib/i18n/translations.ts` — flat objects for `en` and `fr` covering all marketing page strings
- `lib/i18n/LanguageContext.tsx` — React Context that provides `{ lang, setLang, t }`
- `components/marketing/LanguageSwitcher.tsx` — EN | FR toggle buttons
- Selected language is persisted to `localStorage` under the key `cyberteks-lang`
- The `LanguageProvider` wraps the entire app in `app/layout.tsx`

**Why not next-intl or i18next?** For a two-language site with a relatively small and stable string set, a custom context is simpler, has zero bundle overhead, and avoids build-time locale routing complexities.

---

## 9. Email System

All transactional emails are sent via **Resend** (`resend.com`).

| Email | Trigger | API route |
|-------|---------|-----------|
| New contact form submission (to admin) | Contact form submit | `POST /api/contact` |
| New application notification (to admin) | Apply form submit | `POST /api/apply` |
| Application confirmation (to applicant) | Apply form submit | `POST /api/apply` |
| IT support request (to admin) | Get-started form | `POST /api/get-started` |
| Password reset link (to user) | Forgot password | `POST /api/auth/forgot-password` |

### Template files (`emails/`)

These files export plain HTML string functions (not React components) so they can be used directly in the Resend `html` field without adding `@react-email` as a build dependency:

- `ApplicationConfirmation.tsx` — confirms receipt of training application
- `PasswordReset.tsx` — contains the reset link
- `WelcomeStudent.tsx` — sent when an accepted applicant's account is created

### Security

All user-supplied data is passed through an `esc()` HTML-escape function before being embedded in email HTML. This prevents HTML injection attacks via email clients.

---

## 10. File Uploads

`POST /api/upload` accepts `multipart/form-data` with a `file` field.

- Allowed types: JPEG, PNG, WebP, PDF
- Max size: 5 MB
- Files are uploaded to Cloudinary and the returned `secure_url` is stored in the database
- Authentication is required — unauthenticated requests return 401
- The `folder` field defaults to `cyberteks-lms` but can be overridden (e.g. `course-thumbnails`, `profile-pictures`)

---

## 11. Real-time Messaging

The messaging system uses **Pusher** (WebSocket as a service):

- Each conversation has a `Conversation` record with `ConversationParticipant` entries
- Messages are stored in the `Message` table (sender, receiver, conversationId, content)
- `GET /api/messages?conversationId=xxx` fetches message history
- `POST /api/messages` creates a new message (and auto-creates the conversation if needed)
- Pusher events push new messages to all connected participants in real-time (to be wired into the chat UI components)

The East Africa Pusher cluster (`ap2`) is used to minimise latency for Ugandan users.

---

## 12. Rate Limiting

Upstash Redis + `@upstash/ratelimit` should be applied to the following endpoints to prevent abuse:

| Endpoint | Recommended limit |
|----------|------------------|
| `POST /api/auth/forgot-password` | 5 requests / hour per IP |
| `POST /api/contact` | 10 requests / hour per IP |
| `POST /api/apply` | 3 requests / hour per IP |
| `POST /api/get-started` | 10 requests / hour per IP |

The Upstash credentials are configured via `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

---

## 13. API Reference

### Public API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/contact` | None | Submit contact form |
| POST | `/api/apply` | None | Submit training application |
| POST | `/api/get-started` | None | Submit IT support request |
| POST | `/api/auth/forgot-password` | None | Trigger password reset email |
| GET/POST | `/api/auth/[...nextauth]` | None | NextAuth handler |

### Authenticated API Routes

| Method | Route | Roles | Description |
|--------|-------|-------|-------------|
| GET | `/api/messages?conversationId=xxx` | All | Get messages in a conversation |
| POST | `/api/messages` | All | Send a message |
| GET | `/api/notifications` | All | Get user notifications |
| PATCH | `/api/notifications` | All | Mark notifications as read |
| POST | `/api/upload` | All | Upload file to Cloudinary |

### Admin-only API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/users` | List users with filters |
| PATCH | `/api/admin/users` | Update user role / active status |
| GET | `/api/admin/applications` | List applications with filters |
| PATCH | `/api/admin/applications` | Update application status (with valid transition enforcement) |
| GET | `/api/admin/courses` | List courses with filters |
| PATCH | `/api/admin/courses` | Update course status |
| GET | `/api/admin/invoices` | List invoices with revenue summary |
| PATCH | `/api/admin/invoices` | Update invoice status (mark as paid) |

---

## 14. Role-based Access Control

### Roles

| Role | Database value | LMS area |
|------|---------------|---------|
| Admin | `ADMIN` | `/admin/*` |
| Teacher | `TEACHER` | `/teacher/*` |
| Student | `STUDENT` | `/student/*` |

### Middleware logic (`middleware.ts`)

1. **Public routes** — always accessible, no session needed
2. **Auth routes** (`/login`, `/forgot-password`) — redirect logged-in users to their dashboard
3. **LMS routes** — redirect unauthenticated users to `/login`
4. **Role enforcement:**
   - `/admin/*` → only `ADMIN`
   - `/teacher/*` → `TEACHER` or `ADMIN`
   - `/student/*` → only `STUDENT`
   - Invalid role values default to `student` (whitelist approach)

---

## 15. Forms & Validation

All forms use **react-hook-form** + **Zod**. The same Zod schema validates on both client and server.

| Form | Component | Schema | Steps |
|------|-----------|--------|-------|
| Contact | `ContactForm.tsx` | `lib/validations/contact.ts` | 1 page |
| IT Support Request | `ITSupportForm.tsx` | `lib/validations/it-support.ts` | 5 sections |
| Training Application | `ApplyForm.tsx` | `lib/validations/apply.ts` | 6-step wizard |
| Login | `LoginForm.tsx` | inline Zod in `lib/auth.ts` | 1 page |
| Forgot Password | `ForgotPasswordForm.tsx` | inline | 1 page |

### Application Form — 6 steps

1. Personal Information (name, DOB, gender, phone, email, city)
2. Education Background (level, occupation)
3. Program Selection (checkbox grid: Web Dev, Cybersecurity, Data, Networking, etc.)
4. Motivation & Goals (free text)
5. Availability & Device Access (hours/week, has computer, internet, device types)
6. Declaration (checkbox)

---

## 16. Marketing Section

### Home Page Sections

| Component | Visual technique |
|-----------|-----------------|
| `HeroSection.tsx` | Full-viewport, Framer Motion fade-up animations, glassmorphism badge, bg-grid + dot-pattern layers, decorative blobs, clip-path divider |
| `ServicesSection.tsx` | 6-card grid, red overlay on hover, scroll-triggered `whileInView` animations |
| `StatsSection.tsx` | Blue `#102a83` band with animated counters, bg-grid overlay |
| `ClientsSection.tsx` | Infinite CSS logo carousel with fade-edge gradients |
| `CTASection.tsx` | Dual CTA cards: training (blue gradient) and IT support (dark slate) |

### Navbar

- **Mega menu** for Services with icons and descriptions for each service
- Scroll-aware background (transparent → frosted glass)
- Integrated language switcher and dark mode toggle
- Mobile hamburger menu

### Service Pages

Each of the six services has a dedicated page with:
- Hero section with service image
- Feature highlights
- Relevant form (IT Support pages include `ITSupportForm`)

---

## 17. LMS Portal

### Admin Dashboard

- 4 stat cards: Total Students, Active Courses, Applications Pending, Revenue (UGX)
- `ChartArea` — monthly enrollment trend
- `ChartPie` — enrollment by program
- `ChartBar` — monthly revenue
- Recent applications table

### Admin Sub-pages

| Page | Features |
|------|---------|
| Applications | Status summary cards, search, status badges, review workflow |
| Users | Table with role/status badges, toggle active, change role |
| Courses | Card grid, status badges, publish/archive |
| Invoices | Table, UGX revenue summary by status, mark as paid |
| Settings | Platform info, notification toggles |

### Teacher Dashboard

- 4 stat cards, `ChartLine` (daily active students), `ChartBar` (completion vs enrolled)
- Courses table with average rating

### Student Dashboard

- 4 stat cards, `ChartLine` (weekly study hours), `ChartPie` (time by course)
- Course progress bars with gradient fill

### LMS Shell

- `Sidebar.tsx` — collapsible (w-60 ↔ w-16), role-based navigation, active state via `usePathname`, sign-out button
- `TopBar.tsx` — search input, `DarkModeToggle`, notification bell with red unread badge, user avatar with initials fallback

---

## 18. Environment Variables

| Variable | Required | Description |
|----------|---------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string (pooled) |
| `NEXTAUTH_SECRET` | Yes | Random 32-byte secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Yes | App base URL (`http://localhost:3000` in dev) |
| `RESEND_API_KEY` | Yes | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | Yes | From address for all outgoing emails |
| `ADMIN_EMAIL` | Yes | Where contact/apply/support emails are delivered |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Same as above — exposed to the browser |
| `PUSHER_APP_ID` | Yes | Pusher app ID |
| `PUSHER_KEY` | Yes | Pusher key (server-side) |
| `PUSHER_SECRET` | Yes | Pusher secret |
| `PUSHER_CLUSTER` | Yes | `ap2` for East Africa |
| `NEXT_PUBLIC_PUSHER_KEY` | Yes | Same as `PUSHER_KEY` — exposed to the browser |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Yes | Same as `PUSHER_CLUSTER` |
| `UPSTASH_REDIS_REST_URL` | Recommended | Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | Upstash Redis token |

> Variables prefixed with `NEXT_PUBLIC_` are embedded in the client bundle at build time. **Never put secrets in `NEXT_PUBLIC_` variables.**

---

## 19. Running the Project

### Prerequisites

- Node.js 20+
- A Neon account (free tier works) with a PostgreSQL project created
- A Resend account (free tier: 100 emails/day)

### First-time setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd cyberteks-lms

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Set up environment variables
cp .env.example .env
# Open .env and fill in all values

# 4. Generate the Prisma client
npm run db:generate

# 5. Push the schema to the database (creates all tables)
npm run db:push

# 6. Seed initial data
npm run db:seed

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Re-generate Prisma client after schema changes |
| `npm run db:push` | Push schema to DB without creating a migration file (dev only) |
| `npm run db:migrate` | Create a proper migration file and apply it (use in production) |
| `npm run db:seed` | Run `prisma/seed.ts` to insert initial data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) at localhost:5555 |

---

## 20. Seed Data & Test Credentials

After running `npm run db:seed`, the following accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cyberteks-it.com` | `Admin@2026!` |
| Teacher | `james@cyberteks-it.com` | `Teacher@2026!` |
| Teacher | `sarah@cyberteks-it.com` | `Teacher@2026!` |
| Student | `aisha@example.com` | `Student@2026!` |
| Student | `david@example.com` | `Student@2026!` |

### Seeded courses

| Title | Teacher | Status |
|-------|---------|--------|
| Web Development Fundamentals | James Kiprotich | Published |
| Cybersecurity Essentials | Sarah Namugga | Published |
| IT Support & Networking | James Kiprotich | Published |
| Data Analysis with Excel & Python | Sarah Namugga | Published |
| Introduction to AI & Machine Learning | James Kiprotich | Draft |

---

## 21. Security Measures

| Measure | Where |
|---------|-------|
| Password hashing (bcrypt, 12 rounds) | `lib/auth.ts`, `prisma/seed.ts` |
| JWT session (no DB per request) | `lib/auth.ts` |
| Role whitelist in middleware | `middleware.ts` |
| HTML escaping in all email templates | `app/api/apply/`, `contact/`, `get-started/` |
| Token cleanup before new password reset | `app/api/auth/forgot-password/route.ts` |
| Input validation (Zod) on every API route | All API routes |
| Security headers (CSP, X-Frame-Options, etc.) | `next.config.ts` |
| `NEXT_PUBLIC_` variables only for non-secrets | `.env.example` |
| `.env` excluded from version control | `.gitignore` |
| User enumeration prevention in forgot-password | Returns success even if email not found |
| Admin-only API routes check role from JWT | All `/api/admin/*` routes |

---

## 22. Deployment Notes

### Recommended: Vercel

1. Push the repository to GitHub
2. Import the repository in Vercel
3. Add all environment variables in the Vercel dashboard
4. Change `NEXTAUTH_URL` to your production domain (e.g. `https://lms.cyberteks-it.com`)
5. Vercel auto-detects Next.js and deploys

### Database migration for production

Use migrations (not `db:push`) for production databases:

```bash
npm run db:migrate
```

This creates a migration file in `prisma/migrations/` that tracks all schema changes — safe to run on a live database without losing data.

### Image domains

If adding new image sources (e.g. Google profile pictures from OAuth), add the hostname to `remotePatterns` in `next.config.ts`.

---

*Documentation generated for CyberteksIT LMS — March 2026*
