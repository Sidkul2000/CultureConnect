import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.eventAttendee.deleteMany();
  await prisma.eventDetails.deleteMany();
  await prisma.post.deleteMany();
  await prisma.story.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create test users
  const password = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    // User 1: American Male
    prisma.user.create({
      data: {
        email: 'john@example.com',
        password,
        firstName: 'John',
        lastName: 'Smith',
        birthday: new Date('1995-05-15'),
        gender: 'MALE',
        orientation: 'WOMEN',
        userType: 'AMERICAN',
        location: 'San Francisco, CA',
        relationshipGoal: 'BOTH',
        bio: 'Software engineer who loves exploring different cultures. Looking for someone to share adventures with! 🌎',
        culturalJourney: 'Growing up in a diverse city taught me to appreciate different perspectives and traditions.',
        interests: ['Travel', 'Technology', 'Food Adventures', 'Hiking', 'Music'],
        languages: ['English', 'Spanish'],
        photos: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face'
        ],
        profileCompleted: true,
        minAge: 22,
        maxAge: 35
      }
    }),

    // User 2: Brazilian Female
    prisma.user.create({
      data: {
        email: 'sofia@example.com',
        password,
        firstName: 'Sofia',
        lastName: 'Rodriguez',
        birthday: new Date('1996-08-22'),
        gender: 'FEMALE',
        orientation: 'MEN',
        userType: 'NON_AMERICAN',
        nationality: 'Brazilian',
        location: 'Miami, FL',
        relationshipGoal: 'RELATIONSHIP',
        bio: 'Marketing professional who loves salsa dancing and exploring new cultures. Looking for genuine connections! 💃🌎',
        culturalJourney: 'Growing up in São Paulo taught me that the best conversations happen over good food and music.',
        interests: ['Salsa Dancing', 'Food Adventures', 'Beach Volleyball', 'Live Music', 'Travel'],
        languages: ['Portuguese', 'English', 'Spanish'],
        photos: [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1494790108755-2616b332c1c2?w=400&h=600&fit=crop&crop=face'
        ],
        profileCompleted: true,
        minAge: 25,
        maxAge: 38,
        isOnline: true
      }
    }),

    // User 3: Indian Female
    prisma.user.create({
      data: {
        email: 'priya@example.com',
        password,
        firstName: 'Priya',
        lastName: 'Sharma',
        birthday: new Date('1998-03-10'),
        gender: 'FEMALE',
        orientation: 'MEN',
        userType: 'NON_AMERICAN',
        nationality: 'Indian',
        location: 'San Francisco, CA',
        relationshipGoal: 'BOTH',
        bio: 'Tech enthusiast by day, classical dancer by evening! Love hiking and deep conversations. ✨🎭',
        culturalJourney: 'My journey from Mumbai to Silicon Valley has been amazing! I love blending tradition with innovation.',
        interests: ['Classical Dance', 'Hiking', 'Cooking', 'Meditation', 'Technology'],
        languages: ['Hindi', 'English', 'Gujarati'],
        photos: [
          'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&crop=face'
        ],
        profileCompleted: true,
        minAge: 24,
        maxAge: 32
      }
    }),

    // User 4: Japanese Male
    prisma.user.create({
      data: {
        email: 'kenji@example.com',
        password,
        firstName: 'Kenji',
        lastName: 'Nakamura',
        birthday: new Date('1995-11-28'),
        gender: 'MALE',
        orientation: 'WOMEN',
        userType: 'NON_AMERICAN',
        nationality: 'Japanese',
        location: 'Los Angeles, CA',
        relationshipGoal: 'RELATIONSHIP',
        bio: 'Software engineer with a passion for traditional Japanese arts. Love surfing and ramen! 🏄‍♂️🍜',
        culturalJourney: 'Balancing my Japanese heritage with life in California has taught me to appreciate both tradition and change.',
        interests: ['Surfing', 'Martial Arts', 'Anime', 'Ramen', 'Gaming'],
        languages: ['Japanese', 'English'],
        photos: [
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face'
        ],
        profileCompleted: true,
        minAge: 23,
        maxAge: 35,
        isOnline: true
      }
    }),

    // User 5: Mexican Female
    prisma.user.create({
      data: {
        email: 'maria@example.com',
        password,
        firstName: 'Maria',
        lastName: 'Garcia',
        birthday: new Date('1997-06-18'),
        gender: 'FEMALE',
        orientation: 'MEN',
        userType: 'NON_AMERICAN',
        nationality: 'Mexican',
        location: 'Austin, TX',
        relationshipGoal: 'BOTH',
        bio: 'Artist and teacher passionate about cultural exchange. Love cooking traditional Mexican dishes! 🎨🌮',
        culturalJourney: 'Moving to Texas made me appreciate my Mexican roots even more while embracing new experiences.',
        interests: ['Art', 'Cooking', 'Photography', 'Languages', 'Travel'],
        languages: ['Spanish', 'English'],
        photos: [
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face'
        ],
        profileCompleted: true,
        minAge: 25,
        maxAge: 35
      }
    })
  ]);

  console.log(`Created ${users.length} users`);

  // Create some sample posts
  const now = new Date();
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        type: 'EVENT',
        title: 'Brazilian Carnival Night 🎭',
        content: 'Join us for an authentic Brazilian Carnival celebration with live samba music, traditional food, and dancing lessons!',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop',
        location: 'Miami, FL',
        culturalTheme: 'Brazilian',
        authorId: users[1].id,
        eventDetails: {
          create: {
            date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            time: '7:00 PM - 11:00 PM',
            address: '101 W Flagler St, Miami, FL 33130',
            price: 25,
            maxAttendees: 100
          }
        }
      }
    }),

    prisma.post.create({
      data: {
        type: 'USER_POST',
        title: 'My Cultural Exchange Journey 🌍',
        content: 'Just got back from the most amazing cultural exchange in Tokyo! The tea ceremony workshop changed my perspective on mindfulness and tradition.',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=300&fit=crop',
        authorId: users[2].id
      }
    }),

    prisma.post.create({
      data: {
        type: 'EVENT',
        title: 'Holi Festival of Colors 🌈',
        content: 'Celebrate spring and new beginnings with the joyful Indian festival of Holi! Throw colorful powders, dance to Bollywood beats, enjoy delicious Indian sweets.',
        image: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=500&h=300&fit=crop',
        location: 'San Francisco, CA',
        culturalTheme: 'Indian',
        authorId: users[2].id,
        eventDetails: {
          create: {
            date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
            time: '2:00 PM - 6:00 PM',
            address: 'Golden Gate Park, San Francisco, CA 94117',
            price: 15,
            maxAttendees: 150
          }
        }
      }
    })
  ]);

  console.log(`Created ${posts.length} posts`);

  console.log('✅ Database seeded successfully!');
  console.log('\nTest accounts:');
  console.log('- john@example.com (Male, American)');
  console.log('- sofia@example.com (Female, Brazilian)');
  console.log('- priya@example.com (Female, Indian)');
  console.log('- kenji@example.com (Male, Japanese)');
  console.log('- maria@example.com (Female, Mexican)');
  console.log('\nPassword for all accounts: password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
