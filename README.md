# CyberteksIT LMS

> **Copyright © 2026 CyberteksIT. All rights reserved.**
> This software is proprietary and confidential. Unauthorised copying, distribution, modification, or use of any part of this system, via any medium, is strictly prohibited without the prior written permission of CyberteksIT.

---

## About

**CyberteksIT LMS** is a full-stack Learning Management System purpose-built for **CyberteksIT** — a Ugandan ICT solutions company headquartered in Kampala. The platform serves both as a public marketing website and a private, role-based training portal supporting the company's ICT skills development programmes.

---

## Platform Highlights

- Role-based access for Admins, Teachers, and Students
- Bilingual interface — English and French
- Week-by-week curriculum editor with file uploads per topic
- Automatic Assignment sync from curriculum to the Assignments page
- Payment proof upload with inline admin review
- OTP email verification on application submission
- Real-time-style messaging and broadcast notifications
- Certificate generation on course completion
- Cloudinary-backed file storage — persistent across all deployments
- Dark mode support across the entire LMS

---

## What the Platform Does

### Public Website
- Showcases all CyberteksIT services: Remote IT Support, CCTV, Access Control, VoIP, ICT Skilling, Software & AI
- Multi-step **Skills Development Application Form** with OTP email verification and payment proof upload
- **Remote IT Support Request** form for corporate and individual clients
- Contact form with direct email delivery
- English / French language switching throughout

### Learning Management System

Role-based access with three user types — Admin, Teacher, and Student.

---

#### Admin Portal

- Full dashboard with enrollment stats, revenue charts (UGX), and recent activity feed
- Manage all user accounts — create, edit roles, activate or suspend accounts
- **Student Management** — select any student and add or remove individual course enrollments
- Review, approve, or reject applicant submissions — uploaded payment receipts and proof of payment are displayed inline during review
- View and copy auto-generated student passwords when accepting applications
- Manage courses, bootcamps, and invoices
- Send broadcast notifications and newsletters to all users
- IT support ticket management — view and track all submitted support requests
- Platform settings and notification preferences

---

#### Teacher Portal

- Dashboard with course overview and per-course student counts
- **Course Content Editor** — clean two-panel layout:
  - Left panel: week-by-week course structure with collapsible topic lists
  - Right panel: full topic editor — title, type, description, duration, file upload, and metadata
  - Topic types: Lecture, Lab, Video, Document, Assignment, Live Session
  - Document topics include a built-in Cloudinary file uploader for reading materials
  - Assignment topics automatically create linked Assignment records — with due date, max score, and question document upload — and appear immediately on the Assignments page
- Grade and review student assignment submissions with file download
- Student roster per course with individual progress tracking
- Class messaging and push notifications

---

#### Student Portal

- Dashboard with enrolled course cards, overall progress, and recent activity
- **My Courses** — all enrolled courses with visual progress bars
  - Free courses: one-click self-enroll
  - Paid courses: full guided payment flow — invoice breakdown, Mobile Money and Stanbic Bank details, payment screenshot upload, and instant enrollment confirmation
- Browse and enrol in available paid courses directly from the courses page
- Download course documents and assignment question files per topic
- Submit assignments with file attachments before the due date
- Download certificates upon course completion
- Messaging and personalised notifications

---

## Achievement Badges *(Planned)*

The following achievement badges are planned for the student experience to reward progress and engagement:

| Badge | Trigger |
|---|---|
| 🎯 **First Step** | Enrolled in the first course |
| 🔥 **On a Roll** | Enrolled in 3 or more courses |
| 📚 **Scholar** | Completed a full course |
| 🏆 **Top Achiever** | Completed 3 or more courses |
| 📝 **Committed** | Submitted first assignment |
| ⚡ **Fast Learner** | Reached 50% progress within the first week |
| 💎 **Certified** | Downloaded a certificate |
| 🌟 **All-Rounder** | Completed courses across 3 different categories |
| 🤝 **Community Member** | Sent a message to an instructor |
| 🚀 **Pioneer** | Among the first 10 students on the platform |

Badges will be displayed on the student profile and dashboard as a visual gallery, each with a name, description, and earned date.

---

## Staff & Instructor Profiles *(Planned)*

Each teacher on the platform will have a public instructor profile card showing:

- Profile photo and full name
- Job title and area of expertise
- Short bio
- Courses currently taught
- Total number of students taught
- Star rating based on student feedback

A **"Meet Our Instructors"** page will be available to students inside the LMS, and a public version will be embedded on the ICT Skilling service page of the marketing website — giving prospective students a clear view of who will be teaching them before they apply.

---

## Upcoming Features

- **Mentorship Hub** — monthly subscription (30,000 UGX / 3 months) for one-on-one mentorship sessions with instructors
- **Live Class Integration** — Google Meet link scheduling directly from curriculum topics
- **Leaderboard** — weekly ranking of top-performing students per course
- **Discussion Boards** — per-course Q&A threads between students and teachers
- **Payment Gateway** — Pesapal or Flutterwave integration for automated payment verification
- **Mobile App** — React Native companion app for on-the-go learning
- **AI Study Assistant** — per-course chatbot trained on curriculum content to answer student questions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite 5, React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 4, TypeScript |
| ORM | Prisma 5 |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| Email | Resend |
| File Storage | Cloudinary |
| Charts | Recharts |
| Deployment — Frontend | Vercel |
| Deployment — Backend | Render |

---

## Payment & Enrollment Flow

Students applying for paid programmes pay directly to the Director via:

- **Mobile Money** — MTN: +256 779 367 005 · Airtel: +256 706 911 732
- **Bank Transfer** — Stanbic Bank · Account: 9030022482490 · Name: Keneth Sansa Aponye · Branch: Aponye

After payment, the student uploads a screenshot or receipt within the platform. The Admin reviews the proof inline from the Applications panel before accepting and creating the student account.

---

## Email Notifications

| Event | Recipient |
|---|---|
| Application submitted | Applicant confirmation + Admin alert |
| OTP verification code | Applicant |
| Application accepted | Applicant — includes full receipt with payment summary and proof |
| Application rejected | Applicant |
| IT support request | Admin |
| Contact form | Admin |

---

## File Uploads

All uploads are stored on **Cloudinary** for persistence across deployments.

| Type | Used For |
|---|---|
| Avatar | User profile pictures |
| Course cover | Course and bootcamp cover images |
| Document | Curriculum topic reading materials |
| Assignment | Assignment question documents |
| Submission | Student assignment submission files |
| Payment proof | Application payment receipts |

---

## Deployment

The frontend is hosted on **Vercel** and the backend on **Render**. The database runs on **MongoDB Atlas**.

---

## Intellectual Property

This platform, including its source code, design, data models, and all associated materials, is the exclusive property of **CyberteksIT**. No part of this system may be reproduced, distributed, or used in any form without explicit written authorisation from CyberteksIT.

For enquiries: **info@cyberteks-it.com**
