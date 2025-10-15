import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const siddhant = await prisma.user.findFirst({
    where: { firstName: 'Siddhant' },
    select: {
      firstName: true,
      birthday: true,
      gender: true,
      orientation: true,
      profileCompleted: true
    }
  });

  if (siddhant) {
    const age = new Date().getFullYear() - new Date(siddhant.birthday).getFullYear();
    console.log(`Siddhant: ${siddhant.gender}, seeking ${siddhant.orientation}, age ${age}, completed: ${siddhant.profileCompleted}`);
  }

  const sofia = await prisma.user.findFirst({
    where: { firstName: 'Sofia' },
    select: {
      minAge: true,
      maxAge: true
    }
  });

  console.log(`Sofia seeks ages ${sofia?.minAge}-${sofia?.maxAge}`);
}

main().finally(() => prisma.$disconnect());
