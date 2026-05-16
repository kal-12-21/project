/*
  Warnings:

  - You are about to drop the column `serviceCategory` on the `FacilityService` table. All the data in the column will be lost.
  - You are about to drop the column `serviceName` on the `FacilityService` table. All the data in the column will be lost.
  - You are about to drop the `Composition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clinicalServiceId` to the `FacilityService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ServiceStatus" ADD VALUE 'FULL';

-- DropForeignKey
ALTER TABLE "Composition" DROP CONSTRAINT "Composition_serviceRequestId_fkey";

-- AlterTable
ALTER TABLE "FacilityService" DROP COLUMN "serviceCategory",
DROP COLUMN "serviceName",
ADD COLUMN     "bedsAvailable" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bedsTotal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clinicalServiceId" TEXT NOT NULL,
ADD COLUMN     "statusNote" TEXT,
ADD COLUMN     "waitlistCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "allergies" TEXT[],
ADD COLUMN     "clinicalNotes" TEXT,
ADD COLUMN     "diagnoses" TEXT[],
ADD COLUMN     "medications" TEXT[];

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "referralToken" TEXT,
ADD COLUMN     "selectedServiceId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastPasswordChange" TIMESTAMP(3),
ADD COLUMN     "profilePicture" TEXT;

-- DropTable
DROP TABLE "Composition";

-- DropEnum
DROP TYPE "DocumentType";

-- CreateTable
CREATE TABLE "ClinicalServiceDirectory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalServiceDirectory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalServiceDirectory_name_key" ON "ClinicalServiceDirectory"("name");

-- AddForeignKey
ALTER TABLE "FacilityService" ADD CONSTRAINT "FacilityService_clinicalServiceId_fkey" FOREIGN KEY ("clinicalServiceId") REFERENCES "ClinicalServiceDirectory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
