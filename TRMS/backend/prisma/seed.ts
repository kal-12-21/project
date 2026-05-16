/*import { PrismaClient, Role, Priority, ReferralStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TRMS database...');

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trms.gov' },
    update: {},
    create: {
      email: 'admin@trms.gov',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      role: Role.ADMINISTRATOR,
      status: 'ACTIVE',
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Create Facilities
  const facilitiesData = [
    { code: 'AYDER', name: 'Ayder Comprehensive Specialized Hospital', region: 'Tigray', zone: 'Mekelle', status: 'OPERATIONAL' as const },
    { code: 'AXUM', name: 'Axum Comprehensive Hospital', region: 'Tigray', zone: 'Central', status: 'OPERATIONAL' as const },
    { code: 'ADIGRAT', name: 'Adigrat General Hospital', region: 'Tigray', zone: 'Eastern', status: 'OPERATIONAL' as const },
    { code: 'SHIRE', name: 'Suhul Shire General Hospital', region: 'Tigray', zone: 'North Western', status: 'OPERATIONAL' as const },
    { code: 'LEMLEM', name: 'Lemlem Karl Hospital', region: 'Tigray', zone: 'Southern', status: 'OPERATIONAL' as const },
  ];

  for (const f of facilitiesData) {
    await prisma.facility.upsert({
      where: { code: f.code },
      update: { status: f.status },
      create: f,
    });
  }
  console.log('Facilities seeded.');

  const ayder = await prisma.facility.findUnique({ where: { code: 'AYDER' } });
  const axum = await prisma.facility.findUnique({ where: { code: 'AXUM' } });

  // 3. Create a Nurse in Axum
  const nurse = await prisma.user.upsert({
    where: { email: 'nurse@axum.gov' },
    update: {},
    create: {
      email: 'nurse@axum.gov',
      passwordHash,
      firstName: 'Tigist',
      lastName: 'Hailu',
      role: Role.NURSE,
      facilityId: axum?.id,
      status: 'ACTIVE',
    },
  });

  // 4. Create some Services for Ayder
  if (ayder) {
    const emergencyService = await prisma.clinicalServiceDirectory.findUnique({ where: { name: 'Emergency' } });
    if (emergencyService) {
      await prisma.facilityService.create({
        data: {
          facilityId: ayder.id,
          clinicalServiceId: emergencyService.id,
          status: 'OPERATIONAL',
        }
      });
    }
  }

  // 5. Create some initial referrals for analytics
  const patient = await prisma.patient.upsert({
    where: { mrn: 'MRN-20481' },
    update: {},
    create: {
      mrn: 'MRN-20481',
      firstName: 'Hagos',
      lastName: 'Gebru',
      sex: 'MALE',
      age: 45,
    }
  });

  if (axum && ayder) {
    await prisma.serviceRequest.create({
      data: {
        patientId: patient.id,
        originId: axum.id,
        destId: ayder.id,
        priority: Priority.EMERGENCY,
        clinicalSummary: 'Severe head trauma from fall.',
        status: ReferralStatus.ACCEPTED,
      }
    });

    await prisma.serviceRequest.create({
      data: {
        patientId: patient.id,
        originId: axum.id,
        destId: ayder.id,
        priority: Priority.URGENT,
        clinicalSummary: 'Suspected pneumonia.',
        status: ReferralStatus.SUBMITTED,
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/