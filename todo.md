1. Product Requirements Document (PRD)
   1.1 Product Overview
   Alumo is a SaaS platform designed to help college students and young professionals launch their careers. Inspired by a traditional college career center, Alumo goes further by providing:

AI-driven recommendations (resume advice, LinkedIn advice, cold email templates, etc.)
Alumni networking (access to an alumni database, direct messaging, informational interviews)
Resource library (videos, articles, interactive content on career tips and tricks)
Intuitive UI (simplifying user journeys from discovery to action)
From the screenshot, we see key elements such as a side navigation (Explore, AI Chat), university affiliation, recommended videos, and the possibility to reply to an alumni or employer message. These inform the main features and layout.

1.2 Target Users
College Students seeking internships, part-time jobs, or career guidance.
Recent Graduates looking to land full-time roles.
Career Switchers wanting easy-to-use resources and a supportive community.
Alumni who can offer advice, job referrals, or mentorship.
1.3 Key Features & User Flows
Dashboard/Home Screen

Displays personalized videos (e.g., “Career Tips & Tricks”).
Shows incoming messages or notifications (e.g., “Reply to Alexia Coupar…”).
Highlights recommended content (articles, events, mentors).
AI Chat

Central location for users to interact with the AI assistant.
Guidance on resume writing, LinkedIn profile optimization, cold emails.
Dynamic, context-aware responses, pulling from user’s academic background, interests, or prior usage history.
Alumni Database & Networking

Browse or search the alumni directory.
Filter by job title, company, graduation year, etc.
Send direct messages or requests for informational interviews.
Content Library

Curated videos, tutorials, and articles on job search strategies, interview prep, resume tips.
Tagging system by category (e.g., “Career Success,” “Resume,” “Interview Techniques”).
Personalized “Videos for you” section based on the user’s profile and previous engagement.
Notifications & Messaging

Show new messages from alumni or recruiters.
Alerts for new recommended content, application deadlines, or campus events.
User Profile

Personal details, academic info, major, graduation date.
Resume uploads, LinkedIn link, job preferences.
Track watch history of content, completed steps (e.g., “Resume draft uploaded”).
1.4 Tech Stack & Hosting
Frontend: React
Backend: Express (Node.js)
Hosting: Hetzner (via Coolify for deployment and CI/CD pipelines)
AI: Integrations via custom ML models or external APIs (e.g., OpenAI) for chat and recommendations.
1.5 Success Metrics
User Engagement: Time on platform, returning visitors, content views.
Conversion: Successful job placements, # of resumes improved, # of alumni connections made.
User Satisfaction: Positive feedback, NPS (Net Promoter Score). 2. Database Design
Below is a simplified schema to support the core features. (Adjust fields/types to your actual needs and best practices.)

2.1 Tables
users

id (PK)
first_name
last_name
email (unique)
password (hashed)
university_id (FK -> universities.id)
role (student, alumni, admin, etc.)
linkedin_url
resume_url
created_at, updated_at
universities

id (PK)
name
location
created_at, updated_at
videos (or content)

id (PK)
title
description
thumbnail_url
video_url
category (e.g., “Career Success,” “Interview Tips”)
created_at, updated_at
user_videos (tracks user’s engagement with video)

id (PK)
user_id (FK -> users.id)
video_id (FK -> videos.id)
status (watched, in-progress, saved)
created_at, updated_at
messages

id (PK)
sender_id (FK -> users.id)
recipient_id (FK -> users.id)
content (text body)
created_at, updated_at
alumni_details (optional, if separate from users table)

id (PK)
user_id (FK -> users.id)
company
job_title
graduation_year
created_at, updated_at
jobs (future extension)

id (PK)
title
description
company
location
posted_by (FK -> users.id)
created_at, updated_at 3. Color Palette
Based on the screenshot (with a lavender/purple accent and soft white/gray backgrounds), here’s a suggested palette:

Primary Color: #7C4DFF (lavender/purple accent)
Secondary Color: #512DA8 (darker purple for hover states, text highlights)
Background: #F9FAFB (off-white / light gray)
Surface/Panel: #FFFFFF (main card or panel background)
Text Primary: #1F2937 (dark gray for text)
Text Secondary: #4B5563 (lighter gray for secondary text)
Highlight/Success: #34D399 (teal/green)
Warning/Alert: #F87171 (soft red or pink)
You can adjust the exact hex values to match brand identity, but this palette complements the purple highlights seen in the screenshot.

4. Page & Feature Structure
   Below is a high-level structure reflecting the UI:

Global Navigation (Side Menu)

Logo/Brand: “Alumo” at the top left.
Explore: Links to the main content feed with recommended videos/resources.
AI Chat: Opens the AI chatbot interface.
Top Bar

University Name / Switcher (if user belongs to multiple networks).
Notifications Icon: When a user has new messages or updates.
User Profile Avatar: Dropdown with “Profile,” “Settings,” “Logout.”
Main Content Area

Reply to [Alumni/Recruiter Name]: Banner or pinned message at the top for quick response.
Videos for You: Personalized carousel or list of recommended videos.
Each video card shows thumbnail, title (“Career Tips & Tricks”), and publisher/author.
Additional Sections: Could include “Trending Articles,” “Upcoming Webinars,” or “Career Insights.”
AI Chat Page

Conversation interface with the AI assistant.
Suggestion prompts (e.g., “Resume feedback,” “LinkedIn optimization,” “Cold email template”).
Option to attach or upload documents for context (resume, cover letter).
Alumni/Networking Page

Search or filter by name, company, job title, graduation year.
Results displayed as cards with profile info.
Click to view profile, send message, or request an intro.
Profile Page

User’s own profile details (photo, name, major, year, about section).
Upload / update resume.
LinkedIn link.
Progress stats (videos watched, hours spent, messages sent).
Messaging Inbox

List of conversations with alumni, recruiters, or the AI system.
Click into a conversation for a full chat experience.
