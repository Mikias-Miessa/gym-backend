import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  const existing = await prisma.user.findUnique({ where: { email: 'admin@example.com' }});
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password,
        role: 'ADMIN'
      }
    });
    console.log('Created admin user: admin@example.com / admin123');
  } else {
    console.log('Admin user already exists');
  }

  const plans = [
    { name: 'Monthly', durationInMonths: 1, price: 20.0 },
    { name: 'Quarterly', durationInMonths: 3, price: 55.0 },
    { name: 'Half Year', durationInMonths: 6, price: 100.0 },
    { name: 'Yearly', durationInMonths: 12, price: 180.0 },
  ];

  for (const p of plans) {
    const found = await prisma.plan.findFirst({ where: { name: p.name } });
    if (!found) {
      await prisma.plan.create({ data: p });
      console.log('Created plan', p.name);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
