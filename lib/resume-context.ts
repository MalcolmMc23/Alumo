import prisma from "@/lib/prisma";

interface ResumeUser {
  hasResume?: boolean;
  resumeText?: string;
}

/**
 * Retrieves the user's resume text to use as context in AI conversations
 * @param userId The ID of the user
 * @returns The resume text if available, or null if not found
 */
export async function getResumeContext(userId: string): Promise<string | null> {
  try {
    // Query the database for the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    }) as unknown as ResumeUser;

    // If the user doesn't exist or doesn't have a resume, return null
    if (!user || !user.hasResume || !user.resumeText) {
      return null;
    }

    return user.resumeText;
  } catch (error) {
    console.error("Error retrieving resume context:", error);
    return null;
  }
}

/**
 * Generates a system message to inform the AI about the user's resume
 * @param resumeText The user's resume text
 * @returns A system message to include in the AI conversation
 */
export function generateResumeSystemMessage(resumeText: string | null): string | null {
  if (!resumeText) {
    return null;
  }

  return `
I have access to the user's resume. Here's the content:

${resumeText}

When answering career-related questions, I should reference appropriate details from their resume when relevant.
I should not explicitly state "according to your resume" in every response, but naturally incorporate the information.
`;
} 