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
CREATE TABLE "WorkModel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "WorkModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkJobModel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "work_id" TEXT NOT NULL,

    CONSTRAINT "WorkJobModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderWorkModel" (
    "id" TEXT NOT NULL,
    "work_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "min_cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProviderWorkModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderWorkJobModel" (
    "id" TEXT NOT NULL,
    "provider_work_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProviderWorkJobModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestModel" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RequestModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestProviderWorkModel" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "provider_work_id" TEXT NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RequestProviderWorkModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestProviderWorkJobModel" (
    "id" TEXT NOT NULL,
    "request_provider_work_id" TEXT NOT NULL,
    "provider_work_job_id" TEXT NOT NULL,

    CONSTRAINT "RequestProviderWorkJobModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkJobModel" ADD CONSTRAINT "WorkJobModel_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "WorkModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderWorkModel" ADD CONSTRAINT "ProviderWorkModel_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "WorkModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderWorkModel" ADD CONSTRAINT "ProviderWorkModel_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "ProviderModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderWorkJobModel" ADD CONSTRAINT "ProviderWorkJobModel_provider_work_id_fkey" FOREIGN KEY ("provider_work_id") REFERENCES "ProviderWorkModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderWorkJobModel" ADD CONSTRAINT "ProviderWorkJobModel_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "WorkJobModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestModel" ADD CONSTRAINT "RequestModel_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "ClientModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestModel" ADD CONSTRAINT "RequestModel_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "ProviderModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestProviderWorkModel" ADD CONSTRAINT "RequestProviderWorkModel_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "RequestModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestProviderWorkModel" ADD CONSTRAINT "RequestProviderWorkModel_provider_work_id_fkey" FOREIGN KEY ("provider_work_id") REFERENCES "ProviderWorkModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestProviderWorkJobModel" ADD CONSTRAINT "RequestProviderWorkJobModel_request_provider_work_id_fkey" FOREIGN KEY ("request_provider_work_id") REFERENCES "RequestProviderWorkModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestProviderWorkJobModel" ADD CONSTRAINT "RequestProviderWorkJobModel_provider_work_job_id_fkey" FOREIGN KEY ("provider_work_job_id") REFERENCES "ProviderWorkJobModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
