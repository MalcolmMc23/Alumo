import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function findOrCreateUser(profile: any) {
  try {
    const existing = await prisma.user.findFirst({
      where: {
        email: profile?.email,
      },
    });

    if (!existing) {
      // If new user, insert a new record
      await prisma.user.create({
        data: {
          email: profile?.email,
          name: profile?.name,
          image: profile?.picture,
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Database error in findOrCreateUser:", error);
    return false;
  }
}
