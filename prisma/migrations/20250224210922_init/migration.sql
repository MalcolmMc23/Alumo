-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "google_sub" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255),
    "role" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_google_sub_key" ON "user"("google_sub");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
