-- CreateTable
CREATE TABLE "Tip" (
    "old_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "tip" TEXT NOT NULL,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "old_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "astrological_sign" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "old_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "work" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "old_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "old_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "max_participants" INTEGER NOT NULL,
    "location_x" TEXT NOT NULL,
    "location_y" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "location_name" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "old_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clothe" (
    "old_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Clothe_pkey" PRIMARY KEY ("id")
);
