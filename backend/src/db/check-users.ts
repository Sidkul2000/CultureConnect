import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Checking database state...\n');

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      gender: true,
      orientation: true,
      profileCompleted: true,
      minAge: true,
      maxAge: true
    }
  });

  console.log('👥 Users in database:');
  users.forEach(user => {
    console.log(`  - ${user.firstName}: ${user.gender}, seeking ${user.orientation}, ages ${user.minAge}-${user.maxAge}, completed: ${user.profileCompleted}`);
  });

  // Get all swipes
  const swipes = await prisma.swipe.findMany({
    include: {
      fromUser: { select: { firstName: true } },
      toUser: { select: { firstName: true } }
    }
  });

  console.log(`\n💫 Total swipes: ${swipes.length}`);
  if (swipes.length > 0) {
    swipes.forEach(swipe => {
      console.log(`  - ${swipe.fromUser.firstName} → ${swipe.toUser.firstName} (${swipe.action})`);
    });

    console.log('\n🧹 Clearing all swipes...');
    await prisma.swipe.deleteMany();
    console.log('✅ All swipes cleared!');
  }

  console.log('\n✅ Done!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
