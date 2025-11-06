import { PrismaClient } from '@api/prisma/generated/prisma/client';

const prisma = new PrismaClient();

async function script() {
  // run your script here
  console.log('Running script...');
}

script()
  .then(() => {
    console.log('Running script finished.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
