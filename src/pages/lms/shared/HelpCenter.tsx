import { useState } from 'react';
import {
  HelpCircle, BookOpen, MessageSquare, Shield, Users, Settings,
  ChevronDown, ChevronRight, Mail, Phone, ExternalLink,
  GraduationCap, ClipboardList, Award, Bell, UserCircle,
  Search, Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  title: string;
  icon: React.ElementType;
  color: string;
  items: FaqItem[];
}

// ─── FAQ data by role ─────────────────────────────────────────────────────────

const adminFaq: FaqSection[] = [
  {
    title: 'User Management',
    icon: Users,
    color: 'text-blue-600',
    items: [
      {
        question: 'How do I add a new student or teacher?',
        answer: 'Go to Users → click "Add User" → fill in the name, email, role (STUDENT or TEACHER), and a temporary password. The user can then log in and change their password from their profile.',
      },
      {
        question: 'How do I reset a user\'s password?',
        answer: 'On the Users page, find the user and click Edit. You can set a new password there. Notify the user of their new credentials.',
      },
      {
        question: 'How do I suspend or deactivate a user?',
        answer: 'On the Users page, open the user\'s edit panel and change their status to INACTIVE or SUSPENDED. Suspended users cannot log in.',
      },
    ],
  },
  {
    title: 'Course Management',
    icon: BookOpen,
    color: 'text-indigo-600',
    items: [
      {
        question: 'How do I create a course?',
        answer: 'Go to Courses → click "New Course" → fill in the title, category, level, price, and optionally upload a cover image. Save as DRAFT first, then publish when ready.',
      },
      {
        question: 'How do I assign a teacher to a course?',
        answer: 'When creating or editing a course, select a teacher from the "Instructor" dropdown. Only users with the TEACHER role appear in this list.',
      },
      {
        question: 'How do I enroll a student in a course?',
        answer: 'Go to Users → find the student → click "Enroll in Course" → select the course. You can also manage enrollments from the Courses section.',
      },
      {
        question: 'How do I upload a cover image for a course?',
        answer: 'In the Course edit modal, hover over the gradient header area and click the camera icon. Upload a JPG, PNG, or WebP image up to 5 MB.',
      },
    ],
  },
  {
    title: 'Applications & Invoices',
    icon: ClipboardList,
    color: 'text-amber-600',
    items: [
      {
        question: 'How do I process a student application?',
        answer: 'Go to Applications → review the applicant\'s details → change the status to APPROVED to enroll them, or REJECTED to decline. Approved applicants become active students.',
      },
      {
        question: 'How do I create an invoice?',
        answer: 'Go to Invoices → click "New Invoice" → select a student, enter amount in UGX, due date, and description. Send it as PENDING or mark it as PAID directly.',
      },
    ],
  },
  {
    title: 'System Settings',
    icon: Settings,
    color: 'text-muted-foreground',
    items: [
      {
        question: 'How do I update platform information?',
        answer: 'Go to Settings → update the platform name, contact email, timezone, and notification preferences. Changes take effect immediately.',
      },
    ],
  },
];

const teacherFaq: FaqSection[] = [
  {
    title: 'My Courses',
    icon: BookOpen,
    color: 'text-blue-600',
    items: [
      {
        question: 'How do I add content to my course?',
        answer: 'Go to Courses → click "Preview" on a course → use the left sidebar to add sections and lessons. Click "Add Section", then add lessons within each section. Each lesson can hold video URLs, documents, notes, or be a live session link.',
      },
      {
        question: 'How do I add a YouTube video to a lesson?',
        answer: 'In the lesson editor, paste the full YouTube URL (e.g. https://www.youtube.com/watch?v=...) in the Content/URL field. It will automatically embed as a video player for students.',
      },
      {
        question: 'Can I rearrange sections and lessons?',
        answer: 'Currently sections and lessons are ordered by creation time. To reorder, delete and recreate them in the desired order, or contact the admin to update the order numbers directly.',
      },
    ],
  },
  {
    title: 'Assignments',
    icon: ClipboardList,
    color: 'text-indigo-600',
    items: [
      {
        question: 'How do I create an assignment?',
        answer: 'Go to Assignments → click "Create Assignment" → fill in the title, select a course, add a description and instructions, set the due date and max score. You can upload a file (question paper, reading material) and save as Draft or publish as Active.',
      },
      {
        question: 'How do I attach a question paper?',
        answer: 'In the Create/Edit Assignment drawer, find the "Attachment" section. Click the upload area or drag and drop a file (PDF, Word, Excel, images, ZIP — up to 20 MB). Students will see a download link when viewing the assignment.',
      },
      {
        question: 'How do I grade student submissions?',
        answer: 'Go to Assignments → find the assignment → click "Grade". A panel opens showing all student submissions. Click "Grade" next to a student to enter their score and optional feedback.',
      },
    ],
  },
  {
    title: 'Students',
    icon: Users,
    color: 'text-emerald-600',
    items: [
      {
        question: 'Where can I see my students?',
        answer: 'Go to Students to see all students enrolled in your courses. You can see their progress, enrollment status, and contact details.',
      },
    ],
  },
  {
    title: 'Analytics',
    icon: GraduationCap,
    color: 'text-amber-600',
    items: [
      {
        question: 'What does the Analytics page show?',
        answer: 'Analytics shows submission rates, student performance, assignment completion trends, and engagement metrics across all your courses.',
      },
    ],
  },
];

const studentFaq: FaqSection[] = [
  {
    title: 'My Courses',
    icon: GraduationCap,
    color: 'text-blue-600',
    items: [
      {
        question: 'Why don\'t I see any courses?',
        answer: 'Courses are assigned by the admin after your application is approved and payment is processed. Contact support if you believe you should have access.',
      },
      {
        question: 'How do I mark a lesson as complete?',
        answer: 'Open a course → click a lesson from the sidebar → read or watch the content → click "Mark as Complete" at the bottom of the lesson. Your progress updates immediately.',
      },
      {
        question: 'How is my progress percentage calculated?',
        answer: 'Progress is the number of completed lessons divided by the total lessons in the course. Complete all lessons to reach 100% and get your certificate.',
      },
    ],
  },
  {
    title: 'Assignments',
    icon: ClipboardList,
    color: 'text-indigo-600',
    items: [
      {
        question: 'How do I submit an assignment?',
        answer: 'Go to Assignments → find the assignment → click "Submit". You can type your answer in the text area and/or upload a file (PDF, Word, images, ZIP — up to 20 MB). Click "Submit Assignment" when ready.',
      },
      {
        question: 'Can I see the question paper?',
        answer: 'If your teacher attached a file to the assignment, you\'ll see a download link labeled "Assignment File" in the assignment details. Click it to download.',
      },
      {
        question: 'Can I resubmit after submitting?',
        answer: 'Yes — if the due date has not passed, you can submit again. Your latest submission replaces the previous one.',
      },
      {
        question: 'How do I know if my assignment was graded?',
        answer: 'Check Assignments — graded assignments show your score and any feedback from the teacher. You\'ll also receive a notification when graded.',
      },
    ],
  },
  {
    title: 'Certificates',
    icon: Award,
    color: 'text-amber-600',
    items: [
      {
        question: 'When do I get a certificate?',
        answer: 'A certificate is issued when you complete 100% of all lessons in a course and the admin marks your enrollment as COMPLETED. Check the Certificates page to download your certificates.',
      },
    ],
  },
  {
    title: 'Account',
    icon: UserCircle,
    color: 'text-muted-foreground',
    items: [
      {
        question: 'How do I update my profile picture?',
        answer: 'Go to My Profile (bottom of the sidebar) → click on your avatar → upload a JPG, PNG, or WebP image up to 3 MB.',
      },
      {
        question: 'How do I change my password?',
        answer: 'Go to My Profile → click "Change Password" → enter your current password and then the new one. If you forgot your password, use the "Forgot Password" link on the login page.',
      },
    ],
  },
];

const faqByRole: Record<string, FaqSection[]> = {
  ADMIN: adminFaq,
  TEACHER: teacherFaq,
  STUDENT: studentFaq,
};

// ─── FAQ Item Component ───────────────────────────────────────────────────────

function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-card hover:bg-muted/40 transition-colors"
      >
        <span className="text-sm font-semibold text-foreground pr-4">{item.question}</span>
        {open
          ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        }
      </button>
      {open && (
        <div className="px-4 py-3.5 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          {item.answer}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HelpCenterPage() {
  const { user } = useAuth();
  const role = user?.role ?? 'STUDENT';
  const sections = faqByRole[role] ?? studentFaq;
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const query = search.trim().toLowerCase();
  const filtered = sections.map((sec) => ({
    ...sec,
    items: query
      ? sec.items.filter(
          (item) =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query),
        )
      : sec.items,
  })).filter((sec) => sec.items.length > 0);

  return (
    <div className="max-w-4xl pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-blue/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-primary-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Help Center</h1>
            <p className="text-sm text-muted-foreground">Find answers, guides, and support</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for help…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
          />
        </div>
      </div>

      {/* Quick nav pills */}
      {!query && (
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.title;
            return (
              <button
                key={sec.title}
                onClick={() => {
                  setActiveSection(isActive ? null : sec.title);
                  if (!isActive) {
                    setTimeout(() => {
                      document.getElementById(`section-${sec.title}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                  isActive
                    ? 'bg-primary-blue text-white border-primary-blue'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {sec.title}
              </button>
            );
          })}
        </div>
      )}

      {/* FAQ sections */}
      <div className="space-y-8">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center text-center">
            <Lightbulb className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="font-heading font-semibold text-foreground mb-1">No results found</p>
            <p className="text-sm text-muted-foreground">Try different keywords or contact support below.</p>
          </div>
        ) : (
          filtered.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.title} id={`section-${sec.title}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={cn('w-4 h-4', sec.color)} />
                  <h2 className="font-heading font-bold text-foreground text-base">{sec.title}</h2>
                </div>
                <div className="space-y-2">
                  {sec.items.map((item) => (
                    <FaqAccordion key={item.question} item={item} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Contact support */}
      <div className="mt-10 bg-gradient-to-br from-[#023064] to-blue-800 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-card/15 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-lg mb-1">Still need help?</h3>
            <p className="text-sm text-white/70 mb-4">
              Our support team is available Monday–Friday, 8 AM – 6 PM (EAT).
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:support@cyberteks-it.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/15 hover:bg-card/25 text-sm font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@cyberteks-it.com
              </a>
              <a
                href="tel:+256700000000"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/15 hover:bg-card/25 text-sm font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                +256 700 000 000
              </a>
              <a
                href="/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/15 hover:bg-card/25 text-sm font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick tips */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          { icon: Shield, title: 'Security', desc: 'Never share your password. Use the Forgot Password flow if locked out.', color: 'text-red-500' },
          { icon: Bell, title: 'Notifications', desc: 'Check the bell icon for assignment grades, messages, and announcements.', color: 'text-amber-500' },
          { icon: Settings, title: 'Profile', desc: 'Keep your profile photo and contact info up to date for a better experience.', color: 'text-muted-foreground' },
        ].map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-card border border-border rounded-2xl p-4">
            <Icon className={cn('w-5 h-5 mb-2', color)} />
            <p className="font-semibold text-sm text-foreground mb-1">{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
