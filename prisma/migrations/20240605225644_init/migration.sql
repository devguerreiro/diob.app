-- CreateTable
CREATE TABLE "ClientModel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "document" VARCHAR(14) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "contact" VARCHAR(25) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "address_cep" VARCHAR(9) NOT NULL,
    "address_number" INTEGER NOT NULL,
    "address_complement" VARCHAR(20),

    CONSTRAINT "ClientModel_pkey" PRIMARY KEY ("id")
);
