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

-- CreateTable
CREATE TABLE "ProviderWorkJobModel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "provider_work_id" TEXT NOT NULL,

    CONSTRAINT "ProviderWorkJobModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderWorkModel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "min_cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProviderWorkModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderModel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "document" VARCHAR(14) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "contact" VARCHAR(25) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProviderModelToProviderWorkModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProviderModelToProviderWorkModel_AB_unique" ON "_ProviderModelToProviderWorkModel"("A", "B");

-- CreateIndex
CREATE INDEX "_ProviderModelToProviderWorkModel_B_index" ON "_ProviderModelToProviderWorkModel"("B");

-- AddForeignKey
ALTER TABLE "ProviderWorkJobModel" ADD CONSTRAINT "ProviderWorkJobModel_provider_work_id_fkey" FOREIGN KEY ("provider_work_id") REFERENCES "ProviderWorkModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProviderModelToProviderWorkModel" ADD CONSTRAINT "_ProviderModelToProviderWorkModel_A_fkey" FOREIGN KEY ("A") REFERENCES "ProviderModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProviderModelToProviderWorkModel" ADD CONSTRAINT "_ProviderModelToProviderWorkModel_B_fkey" FOREIGN KEY ("B") REFERENCES "ProviderWorkModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
