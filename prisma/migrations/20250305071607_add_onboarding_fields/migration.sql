-- AlterTable
ALTER TABLE "user" ADD COLUMN     "careerGoals" TEXT,
ADD COLUMN     "educationLevel" TEXT,
ADD COLUMN     "hasResume" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resumeFileName" TEXT,
ADD COLUMN     "resumeFileType" TEXT,
ADD COLUMN     "resumeText" TEXT;
