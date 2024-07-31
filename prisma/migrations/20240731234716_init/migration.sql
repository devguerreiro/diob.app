-- CreateTable
CREATE TABLE "UserModel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "document" VARCHAR(11) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "contact" VARCHAR(25) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientModel" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "address_cep" VARCHAR(9) NOT NULL,
    "address_number" INTEGER NOT NULL,
    "address_complement" VARCHAR(20),

    CONSTRAINT "ClientModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderModel" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

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
    "estimated_duration" INTEGER NOT NULL,

    CONSTRAINT "ProviderWorkJobModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogModel" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "by_id" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "service_request_id" TEXT NOT NULL,

    CONSTRAINT "LogModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequestModel" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "estimated_duration" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequestModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequestWorkModel" (
    "id" TEXT NOT NULL,
    "provider_work_id" TEXT NOT NULL,
    "service_request_id" TEXT NOT NULL,

    CONSTRAINT "ServiceRequestWorkModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequestWorkJobModel" (
    "id" TEXT NOT NULL,
    "provider_work_job_id" TEXT NOT NULL,
    "service_request_id" TEXT NOT NULL,

    CONSTRAINT "ServiceRequestWorkJobModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_document_key" ON "UserModel"("document");

-- CreateIndex
CREATE UNIQUE INDEX "ClientModel_user_id_key" ON "ClientModel"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderModel_user_id_key" ON "ProviderModel"("user_id");

-- AddForeignKey
ALTER TABLE "ClientModel" ADD CONSTRAINT "ClientModel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderModel" ADD CONSTRAINT "ProviderModel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "LogModel" ADD CONSTRAINT "LogModel_by_id_fkey" FOREIGN KEY ("by_id") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogModel" ADD CONSTRAINT "LogModel_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "ServiceRequestModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestModel" ADD CONSTRAINT "ServiceRequestModel_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "ClientModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestModel" ADD CONSTRAINT "ServiceRequestModel_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "ProviderModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestWorkModel" ADD CONSTRAINT "ServiceRequestWorkModel_provider_work_id_fkey" FOREIGN KEY ("provider_work_id") REFERENCES "ProviderWorkModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestWorkModel" ADD CONSTRAINT "ServiceRequestWorkModel_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "ServiceRequestModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestWorkJobModel" ADD CONSTRAINT "ServiceRequestWorkJobModel_provider_work_job_id_fkey" FOREIGN KEY ("provider_work_job_id") REFERENCES "ProviderWorkJobModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestWorkJobModel" ADD CONSTRAINT "ServiceRequestWorkJobModel_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "ServiceRequestWorkModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
