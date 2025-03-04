import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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
        // Add other profile fields you want to expose
        // Don't include sensitive information
      },
    });

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
      // Add mock data for fields not yet in database
      // In a real app, you'd expand your user model to include these
      university: "University Not Set",
      major: "Major Not Set",
      graduationYear: "Year Not Set",
      bio: "This user hasn't added a bio yet."
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