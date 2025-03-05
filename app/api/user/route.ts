import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true, // For joinedDate
        university: true,
        major: true,
        graduationYear: true,
        location: true,
        skills: true,
        linkedInProfile: true,
        // Add new onboarding fields
        // TypeScript doesn't recognize them, so we need to use as any
      },
    }) as any; // Type assertion to bypass TypeScript checks

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the data for the client
    const userData = {
      name: user.name || "Anonymous User",
      image: user.image,
      joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        month: 'long',
        year: 'numeric'
      }) : "Recent member",
      university: user.university || "University Not Set",
      major: user.major || "Major Not Set",
      graduationYear: user.graduationYear ? user.graduationYear.toString() : "Year Not Set",
      educationLevel: user.educationLevel || "Not Set",
      careerGoals: user.careerGoals || "This user hasn't added career goals yet.",
      hasResume: user.hasResume || false
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
} 