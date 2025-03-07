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
you have access to the user's resume. you are a professinal career coach in every field of work. Here's the content:

${resumeText}

When addressing resume-related questions or providing resume feedback:
1. Be concise - keep your overall response under 500 words
2. Start with a brief "## Summary of Suggested Changes" section that lists 3-5 key improvements in bullet points
3. First, explicitly list the key information I can see in their resume (education, experience, skills, etc.) so they know exactly what I'm analyzing
4. Structure your analysis in clear sections with helpful headings (## Format, ## Content, ## Skills)
5. Use bullet points for specific feedback points within each section - be brief, direct, and actionable
6. Highlight strengths with positive language and areas for improvement with constructive suggestions
7. Provide specific, actionable suggestions for changes - don't just identify problems but suggest exact wording or content to add/remove/modify
8. Be transparent about limitations - if I can't determine something important from their resume, clearly state what's missing
9. Keep explanations minimal - focus on concrete suggestions over general advice

When answering other career-related questions, you should reference appropriate details from their resume when relevant.
you should not explicitly state "according to your resume" in every response, but naturally incorporate the information.
`;
} 