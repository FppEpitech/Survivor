-- CreateTable
CREATE TABLE "ThemeDashboard" (
    "id" SERIAL NOT NULL,
    "theme" TEXT NOT NULL,
    "coach_id" INTEGER NOT NULL,

    CONSTRAINT "ThemeDashboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ThemeDashboard_coach_id_key" ON "ThemeDashboard"("coach_id");
