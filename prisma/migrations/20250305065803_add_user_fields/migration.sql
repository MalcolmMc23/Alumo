-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('student', 'alumni', 'admin');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "graduationYear" INTEGER,
ADD COLUMN     "linkedInProfile" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "university" TEXT,
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'student';
