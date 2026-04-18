import 'dotenv/config';
import { PrismaClient, Role, CourseStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Real course catalogue (from CyberteksIT fees guide) ────────────────────
const COURSE_CATALOGUE = [
  {
    title: 'Prompt Engineering',
    slug:  'prompt-engineering',
    description: 'Master the art of crafting effective prompts for AI language models. Learn how to communicate with AI systems to get precise, high-quality outputs for real-world tasks.',
    price: 750000, duration: '2 months', level: 'Beginner',
    category: 'AI', coverImage: '/assets/ict-skilling-capacity-building.jpg',
    tags: ['AI', 'ChatGPT', 'Prompting'],
  },
  {
    title: 'Augmented Reality',
    slug:  'augmented-reality',
    description: 'Explore the world of Augmented Reality (AR) and learn to design and build immersive AR experiences. Covers AR fundamentals, tools, and real-world application development.',
    price: 750000, duration: '2 months', level: 'Intermediate',
    category: 'Technology', coverImage: '/assets/ict-skilling-capacity-building.jpg',
    tags: ['AR', 'XR', 'Immersive'],
  },
  {
    title: 'Virtual Reality',
    slug:  'virtual-reality',
    description: 'Dive into Virtual Reality (VR) design and development. Learn to create immersive 3D environments and interactive VR experiences using modern VR platforms and tools.',
    price: 750000, duration: '2 months', level: 'Intermediate',
    category: 'Technology', coverImage: '/assets/ict-skilling-capacity-building.jpg',
    tags: ['VR', 'XR', '3D'],
  },
  {
    title: 'Programming (Any Language)',
    slug:  'programming-any-language',
    description: 'A comprehensive introduction to programming concepts applicable across all major languages. Learn logic, problem-solving, data structures, and build real projects in your language of choice.',
    price: 1500000, duration: '3 months', level: 'Beginner',
    category: 'Development', coverImage: '/assets/web design.jpeg',
    tags: ['Python', 'JavaScript', 'Programming', 'Coding'],
  },
  {
    title: 'AI & Robotics',
    slug:  'ai-and-robotics',
    description: 'Explore Artificial Intelligence and Robotics — from machine learning fundamentals to building intelligent robotic systems. Gain hands-on experience with AI tools and robotics hardware.',
    price: 1500000, duration: '3 months', level: 'Intermediate',
    category: 'AI', coverImage: '/assets/ict-skilling-capacity-building.jpg',
    tags: ['AI', 'Machine Learning', 'Robotics'],
  },
  {
    title: 'Web Design',
    slug:  'web-design',
    description: 'Learn modern web design from scratch — HTML, CSS, responsive layouts, UI/UX principles, and how to create beautiful, user-friendly websites that work across all devices.',
    price: 650000, duration: '2 months', level: 'Beginner',
    category: 'Design', coverImage: '/assets/web design.jpeg',
    tags: ['HTML', 'CSS', 'UI/UX', 'Responsive Design'],
  },
  {
    title: 'Graphic Design',
    slug:  'graphic-design',
    description: 'Master graphic design principles, typography, colour theory, and industry-standard tools like Adobe Photoshop, Illustrator, and Canva. Create professional logos, banners, and brand identities.',
    price: 650000, duration: '2 months', level: 'Beginner',
    category: 'Design', coverImage: '/assets/web design.jpeg',
    tags: ['Photoshop', 'Illustrator', 'Branding', 'Design'],
  },
  {
    title: 'Cyber Security',
    slug:  'cyber-security',
    description: 'Understand cybersecurity threats, vulnerabilities, and defence strategies. Covers ethical hacking, network security, incident response, and prepares you for CompTIA Security+.',
    price: 1500000, duration: '3 months', level: 'Intermediate',
    category: 'Security', coverImage: '/assets/cctv-surveillance-systems.jpg',
    tags: ['Security', 'Ethical Hacking', 'CompTIA', 'Networks'],
  },
  {
    title: 'Data Analytics',
    slug:  'data-analytics',
    description: 'Turn raw data into actionable insights. Master data cleaning, visualisation, and analysis using Excel, SQL, and Python (pandas, matplotlib). Build dashboards and present data-driven reports.',
    price: 1500000, duration: '2 months', level: 'Beginner',
    category: 'Data', coverImage: '/assets/ict-skilling-capacity-building.jpg',
    tags: ['Excel', 'SQL', 'Python', 'Data Visualisation'],
  },
  {
    title: 'Computer Networking',
    slug:  'computer-networking',
    description: 'Build a solid foundation in computer networking — TCP/IP, routing, switching, VLANs, subnetting, and network troubleshooting. Prepares you for CompTIA Network+ certification.',
    price: 1500000, duration: '3 months', level: 'Beginner',
    category: 'Networking', coverImage: '/assets/remote-it-support.jpg',
    tags: ['Networking', 'TCP/IP', 'CompTIA', 'Cisco'],
  },
  {
    title: 'Python Programming',
    slug:  'python-programming',
    description: 'A hands-on introduction to Python — the world\'s most popular programming language. Learn variables, data structures, functions, file handling, APIs, and build real projects from day one. Perfect for beginners with zero coding experience.',
    price: 0, duration: '6 weeks', level: 'Beginner',
    category: 'Development', coverImage: '/assets/web design.jpeg',
    tags: ['Python', 'Programming', 'Free', 'Bootcamp'],
  },
  {
    title: 'Cloud (Azure / AWS)',
    slug:  'cloud-azure-aws',
    description: 'Get hands-on with cloud computing using Microsoft Azure and Amazon Web Services. Learn cloud infrastructure, deployment, storage, databases, security, and cost management.',
    price: 1500000, duration: '3 months', level: 'Intermediate',
    category: 'Cloud', coverImage: '/assets/remote-it-support.jpg',
    tags: ['Azure', 'AWS', 'Cloud', 'DevOps'],
  },
  {
    title: 'Machine Learning',
    slug:  'machine-learning',
    description: 'Build intelligent systems that learn from data. Master supervised and unsupervised learning, neural networks, model evaluation, and deployment pipelines using Python, scikit-learn, and TensorFlow. Gain practical experience solving real classification, regression, and prediction problems from day one.',
    price: 1500000, duration: '3 months', level: 'Intermediate',
    category: 'AI', coverImage: '/assets/ict-skilling-capacity-building.jpg',
    tags: ['Machine Learning', 'Python', 'TensorFlow', 'AI', 'Data Science'],
  },
];

async function main() {
  console.log('Seeding database...');

  // ── Cleanup (children first to respect FK constraints) ────────────────────
  await prisma.invoice.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  const adminPassword   = await bcrypt.hash('Admin@2026!', 12);
  const teacherPassword = await bcrypt.hash('Caleb/2006', 12);

  const admin = await prisma.user.upsert({
    where:  { email: 'cnzabb@gmail.com' },
    update: { name: 'Admin', password: adminPassword, role: Role.ADMIN, isActive: true },
    create: {
      name: 'Admin', email: 'cnzabb@gmail.com', password: adminPassword,
      role: Role.ADMIN, isActive: true, emailVerified: new Date(),
    },
  });
  console.log('Admin:', admin.email);

  const teacher1 = await prisma.user.upsert({
    where:  { email: 'cyberteks-IT@gmail.com' },
    update: { name: 'Caleb Nzabanita', password: teacherPassword, role: Role.TEACHER, isActive: true },
    create: {
      name: 'Caleb Nzabanita', email: 'cyberteks-IT@gmail.com', password: teacherPassword,
      role: Role.TEACHER, isActive: true, emailVerified: new Date(),
    },
  });


  console.log('Users seeded');

  // ── Courses — all 11 from the CyberteksIT fees guide ──────────────────────
  const teachers = [teacher1];
  for (let i = 0; i < COURSE_CATALOGUE.length; i++) {
    const c = COURSE_CATALOGUE[i];
    await prisma.course.upsert({
      where:  { slug: c.slug },
      update: { price: c.price, duration: c.duration },
      create: {
        ...c,
        teacherId: teachers[i % teachers.length].id,
        status: CourseStatus.PUBLISHED,
        currency: 'UGX',
      },
    });
  }

  console.log(`Courses seeded: ${COURSE_CATALOGUE.length}`);

  // ── Free Bootcamp — Python Programming (expires 2 weeks from seed date) ───
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  await (prisma as any).freeBootcamp.upsert({
    where:  { id: 'seed-python-bootcamp' },
    update: {},
    create: {
      id:            'seed-python-bootcamp',
      title:         'Python Programming Bootcamp',
      description:   'A free 6-week hands-on Python bootcamp for beginners. No prior coding experience required. Learn programming fundamentals, build real projects, and join a community of learners. Limited spots available!',
      expiresAt:     twoWeeksFromNow,
      isActive:      true,
      groupChatLink: 'https://chat.whatsapp.com/DJ3zRjjc5QO4QiMr6RLiWR',
    },
  });
  console.log('Free bootcamp seeded');

  console.log('\nSeed complete!');
  console.log('\nLogin credentials:');
  console.log('  Admin:   cnzabb@gmail.com         /  Admin@2026!');
  console.log('  Teacher: cyberteks-IT@gmail.com   /  Caleb/2006');
  console.log('  Teacher: sarah@cyberteks-it.com   /  Caleb/2006');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
