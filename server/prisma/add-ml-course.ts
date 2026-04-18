import 'dotenv/config';
import { PrismaClient, CourseStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (!teacher) throw new Error('No teacher found in DB — run seed first.');

  const course = await prisma.course.upsert({
    where:  { slug: 'machine-learning' },
    update: {
      title:       'Machine Learning',
      description: 'Build intelligent systems that learn from data. Master supervised and unsupervised learning, neural networks, model evaluation, and deployment pipelines using Python, scikit-learn, and TensorFlow. Gain practical experience solving real classification, regression, and prediction problems from day one.',
      price:       1500000,
      duration:    '3 months',
      level:       'Intermediate',
      category:    'AI',
      coverImage:  '/assets/ict-skilling-capacity-building.jpg',
      tags:        ['Machine Learning', 'Python', 'TensorFlow', 'AI', 'Data Science'],
      status:      CourseStatus.PUBLISHED,
    },
    create: {
      slug:        'machine-learning',
      title:       'Machine Learning',
      description: 'Build intelligent systems that learn from data. Master supervised and unsupervised learning, neural networks, model evaluation, and deployment pipelines using Python, scikit-learn, and TensorFlow. Gain practical experience solving real classification, regression, and prediction problems from day one.',
      price:       1500000,
      currency:    'UGX',
      duration:    '3 months',
      level:       'Intermediate',
      category:    'AI',
      coverImage:  '/assets/ict-skilling-capacity-building.jpg',
      tags:        ['Machine Learning', 'Python', 'TensorFlow', 'AI', 'Data Science'],
      status:      CourseStatus.PUBLISHED,
      teacherId:   teacher.id,
    },
  });

  console.log(`Done: "${course.title}" (id: ${course.id}) — UGX ${course.price.toLocaleString()}`);
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
