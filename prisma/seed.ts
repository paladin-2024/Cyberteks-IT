import 'dotenv/config';
import { PrismaClient, Role, CourseStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Users ────────────────────────────────────────────────────────────────
  await prisma.user.deleteMany({
    where: {
      email: { in: ['james@cyberteks-it.com', 'caleb@cyberteks-it.com', 'sarah@cyberteks-it.com'] },
    },
  });

  const adminPassword   = await bcrypt.hash('Admin@2026!', 12);
  const teacherPassword = await bcrypt.hash('Caleb/2006', 12);
  const studentPassword = await bcrypt.hash('Student@2026!', 12);

  await prisma.user.deleteMany({ where: { email: 'admin@cyberteks-it.com' } });

  const admin = await prisma.user.upsert({
    where:  { email: 'cnzabb@gmail.com' },
    update: { name: 'Admin', password: adminPassword, role: Role.ADMIN, isActive: true },
    create: {
      name: 'Admin', email: 'cnzabb@gmail.com', password: adminPassword,
      role: Role.ADMIN, isActive: true, emailVerified: new Date(),
    },
  });

  const teacher1 = await prisma.user.upsert({
    where:  { email: 'cyberteks-IT@gmail.com' },
    update: { name: 'Caleb Nzabanita', password: teacherPassword, role: Role.TEACHER, isActive: true },
    create: {
      name: 'Caleb Nzabanita', email: 'cyberteks-IT@gmail.com', password: teacherPassword,
      role: Role.TEACHER, isActive: true, emailVerified: new Date(),
    },
  });

  const teacher2 = await prisma.user.upsert({
    where:  { email: 'sarah@cyberteks-it.com' },
    update: { name: 'Sarah Namukasa', password: teacherPassword, role: Role.TEACHER, isActive: true },
    create: {
      name: 'Sarah Namukasa', email: 'sarah@cyberteks-it.com', password: teacherPassword,
      role: Role.TEACHER, isActive: true, emailVerified: new Date(),
    },
  });

  const student1 = await prisma.user.upsert({
    where:  { email: 'aisha@example.com' },
    update: { name: 'Aisha Nakato', password: studentPassword, role: Role.STUDENT, isActive: true },
    create: {
      name: 'Aisha Nakato', email: 'aisha@example.com', password: studentPassword,
      role: Role.STUDENT, isActive: true, emailVerified: new Date(),
    },
  });

  const student2 = await prisma.user.upsert({
    where:  { email: 'david@example.com' },
    update: { name: 'David Ochieng', password: studentPassword, role: Role.STUDENT, isActive: true },
    create: {
      name: 'David Ochieng', email: 'david@example.com', password: studentPassword,
      role: Role.STUDENT, isActive: true, emailVerified: new Date(),
    },
  });

  console.log('Users seeded');

  // ── Courses ──────────────────────────────────────────────────────────────
  const webDevCourse = await prisma.course.upsert({
    where:  { slug: 'web-development-fundamentals' },
    update: {},
    create: {
      title: 'Web Development Fundamentals',
      slug:  'web-development-fundamentals',
      description: 'Learn HTML, CSS, JavaScript, and React from the ground up. Build real-world projects and gain job-ready skills.',
      teacherId: teacher1.id,
      status: CourseStatus.PUBLISHED,
      price: 450000, currency: 'UGX', duration: '3 months', level: 'Beginner',
      category: 'Development', coverImage: '/assets/web design.jpeg',
    },
  });

  const cyberCourse = await prisma.course.upsert({
    where:  { slug: 'cybersecurity-essentials' },
    update: {},
    create: {
      title: 'Cybersecurity Essentials',
      slug:  'cybersecurity-essentials',
      description: 'Understand threats, vulnerabilities, and how to defend networks and systems. Prepares you for CompTIA Security+.',
      teacherId: teacher2.id,
      status: CourseStatus.PUBLISHED,
      price: 380000, currency: 'UGX', duration: '2 months', level: 'Intermediate',
      category: 'Security', coverImage: '/assets/cctv-surveillance-systems.jpg',
    },
  });

  const itSupportCourse = await prisma.course.upsert({
    where:  { slug: 'it-support-networking' },
    update: {},
    create: {
      title: 'IT Support & Networking',
      slug:  'it-support-networking',
      description: 'Covers hardware, operating systems, networking fundamentals, and troubleshooting. Prepares you for CompTIA A+.',
      teacherId: teacher1.id,
      status: CourseStatus.PUBLISHED,
      price: 320000, currency: 'UGX', duration: '2 months', level: 'Beginner',
      category: 'Networking', coverImage: '/assets/remote-it-support.jpg',
    },
  });

  const dataCourse = await prisma.course.upsert({
    where:  { slug: 'data-analysis-excel-python' },
    update: {},
    create: {
      title: 'Data Analysis with Excel & Python',
      slug:  'data-analysis-excel-python',
      description: 'Master data cleaning, visualization, and analysis using Microsoft Excel and Python (pandas, matplotlib).',
      teacherId: teacher2.id,
      status: CourseStatus.PUBLISHED,
      price: 350000, currency: 'UGX', duration: '6 weeks', level: 'Beginner',
      category: 'Data', coverImage: '/assets/ict-skilling-capacity-building.jpg',
    },
  });

  await prisma.course.upsert({
    where:  { slug: 'intro-ai-machine-learning' },
    update: {},
    create: {
      title: 'Introduction to AI & Machine Learning',
      slug:  'intro-ai-machine-learning',
      description: 'Explore machine learning algorithms, neural networks, and practical AI applications using Python and scikit-learn.',
      teacherId: teacher1.id,
      status: CourseStatus.DRAFT,
      price: 500000, currency: 'UGX', duration: '2 months', level: 'Intermediate', category: 'AI',
    },
  });

  console.log('Courses seeded');

  // ── Sections & Lessons (Web Dev) ─────────────────────────────────────────
  const section1 = await prisma.section.upsert({
    where:  { id: 'section-wd-1' },
    update: {},
    create: { id: 'section-wd-1', title: 'HTML Fundamentals', order: 1, courseId: webDevCourse.id },
  });

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      { id: 'lesson-wd-1-1', title: 'Introduction to HTML',       order: 1, sectionId: section1.id, type: 'VIDEO', duration: 15 },
      { id: 'lesson-wd-1-2', title: 'HTML Document Structure',    order: 2, sectionId: section1.id, type: 'VIDEO', duration: 20 },
      { id: 'lesson-wd-1-3', title: 'Semantic HTML',              order: 3, sectionId: section1.id, type: 'VIDEO', duration: 18 },
      { id: 'lesson-wd-1-4', title: 'Forms and Input Elements',   order: 4, sectionId: section1.id, type: 'VIDEO', duration: 25 },
    ],
  });

  const section2 = await prisma.section.upsert({
    where:  { id: 'section-wd-2' },
    update: {},
    create: { id: 'section-wd-2', title: 'CSS Styling', order: 2, courseId: webDevCourse.id },
  });

  await prisma.lesson.createMany({
    skipDuplicates: true,
    data: [
      { id: 'lesson-wd-2-1', title: 'CSS Selectors & Properties', order: 1, sectionId: section2.id, type: 'VIDEO', duration: 22 },
      { id: 'lesson-wd-2-2', title: 'Box Model & Layouts',        order: 2, sectionId: section2.id, type: 'VIDEO', duration: 28 },
      { id: 'lesson-wd-2-3', title: 'Flexbox & Grid',             order: 3, sectionId: section2.id, type: 'VIDEO', duration: 35 },
      { id: 'lesson-wd-2-4', title: 'Responsive Design',          order: 4, sectionId: section2.id, type: 'VIDEO', duration: 30 },
    ],
  });

  console.log('Sections & lessons seeded');

  // ── Enrollments ──────────────────────────────────────────────────────────
  await prisma.enrollment.createMany({
    skipDuplicates: true,
    data: [
      { id: 'enroll-1', userId: student1.id, courseId: webDevCourse.id,   status: 'ACTIVE',     progressPercent: 72 },
      { id: 'enroll-2', userId: student1.id, courseId: itSupportCourse.id, status: 'COMPLETED',  progressPercent: 100, completedAt: new Date('2026-02-20') },
      { id: 'enroll-3', userId: student1.id, courseId: dataCourse.id,     status: 'ACTIVE',     progressPercent: 25 },
      { id: 'enroll-4', userId: student2.id, courseId: cyberCourse.id,    status: 'ACTIVE',     progressPercent: 40 },
    ],
  });

  console.log('Enrollments seeded');

  // ── Applications ─────────────────────────────────────────────────────────
  await prisma.application.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'app-001', fullName: 'Aisha Nakato', email: 'aisha@example.com',
        phone: '+256 772 000 001', programs: ['Web Development'],
        educationLevel: 'Undergraduate', dateOfBirth: '2000-05-12', gender: 'Female',
        cityCountry: 'Kampala, Uganda',
        motivation: 'I want to build websites for local businesses.',
        careerGoals: 'Become a full-stack developer within 2 years.',
        hoursPerWeek: '10+', hasComputer: 'Yes', deviceTypes: ['Laptop'], hasInternet: 'Yes',
        status: 'ACCEPTED',
      },
      {
        id: 'app-002', fullName: 'David Ochieng', email: 'david@example.com',
        phone: '+256 772 000 002', programs: ['Cybersecurity'],
        educationLevel: 'Diploma', dateOfBirth: '1998-11-03', gender: 'Male',
        cityCountry: 'Kampala, Uganda',
        motivation: 'Cybersecurity is the future and I want to be part of it.',
        careerGoals: 'Work as a SOC analyst for a financial institution.',
        hoursPerWeek: '10+', hasComputer: 'Yes', deviceTypes: ['Desktop'], hasInternet: 'Yes',
        status: 'UNDER_REVIEW',
      },
      {
        id: 'app-003', fullName: 'Grace Atuhaire', email: 'grace@example.com',
        phone: '+256 772 000 003', programs: ['Data Analysis'],
        educationLevel: 'Graduate', dateOfBirth: '1995-07-22', gender: 'Female',
        cityCountry: 'Entebbe, Uganda',
        motivation: 'I want to leverage data skills in my current role.',
        careerGoals: 'Transition into a data analyst position.',
        hoursPerWeek: '5-10', hasComputer: 'Yes', deviceTypes: ['Laptop'], hasInternet: 'Yes',
        status: 'PENDING',
      },
    ],
  });

  console.log('Applications seeded');

  // ── Invoices ─────────────────────────────────────────────────────────────
  await prisma.invoice.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'inv-001', invoiceNo: 'INV-001', userId: student1.id, courseId: webDevCourse.id,
        amount: 450000, currency: 'UGX', status: 'PAID',
        dueDate: new Date('2026-03-01'), paidAt: new Date('2026-03-01'),
      },
      {
        id: 'inv-002', invoiceNo: 'INV-002', userId: student2.id, courseId: cyberCourse.id,
        amount: 380000, currency: 'UGX', status: 'SENT', dueDate: new Date('2026-03-15'),
      },
    ],
  });

  console.log('Invoices seeded');
  console.log('\nSeed complete!');
  console.log('\nLogin credentials:');
  console.log('  Admin:   cnzabb@gmail.com         /  Admin@2026!');
  console.log('  Teacher: cyberteks-IT@gmail.com   /  Caleb/2006');
  console.log('  Teacher: sarah@cyberteks-it.com   /  Caleb/2006');
  console.log('  Student: aisha@example.com        /  Student@2026!');
  console.log('  Student: david@example.com        /  Student@2026!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
