-- CreateTable
CREATE TABLE "CustomerClothe" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "CustomerClothe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerClothe" ADD CONSTRAINT "CustomerClothe_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
