import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body data
    const body = await request.json();
    const { 
      educationLevel, 
      major, 
      graduationYear, 
      careerGoals,
      university,
      location,
      skills,
      linkedInProfile
    } = body;

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user record with onboarding information
    // Using any type to work around Prisma TypeScript issues
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        // @ts-ignore - Fields exist in the database but TypeScript doesn't recognize them yet
        educationLevel,
        major,
        graduationYear: graduationYear ? parseInt(graduationYear) : undefined,
        // @ts-ignore
        careerGoals,
        university,
        location,
        skills,
        linkedInProfile
      },
    }) as any; // Type assertion to any to bypass TypeScript checks

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        // Include profile data
        university: updatedUser.university,
        major: updatedUser.major,
        graduationYear: updatedUser.graduationYear,
        location: updatedUser.location,
        skills: updatedUser.skills,
        linkedInProfile: updatedUser.linkedInProfile,
        educationLevel: updatedUser.educationLevel,
        careerGoals: updatedUser.careerGoals,
        hasResume: updatedUser.hasResume
      }
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { 
        error: "Failed to update user profile",
        message: "An unexpected error occurred while updating your profile. Please try again."
      },
      { status: 500 }
    );
  }
} 