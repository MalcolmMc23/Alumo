import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function findOrCreateUser(profile: any) {
  try {
    const existing = await prisma.user.findFirst({
      where: {
        google_sub: profile?.sub,
      },
    });

    if (!existing) {
      // If new user, insert a new record
      await prisma.user.create({
        data: {
          google_sub: profile?.sub,
          email: profile?.email,
          display_name: profile?.name,
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Database error in findOrCreateUser:", error);
    return false;
  }
}
