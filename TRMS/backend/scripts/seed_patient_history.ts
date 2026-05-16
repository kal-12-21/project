/*import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const patient = await prisma.patient.upsert({
    where: { mrn: 'PT-99999' },
    update: {
      allergies: ['Penicillin', 'Peanuts'],
      medications: ['Lisinopril 10mg daily', 'Metformin 500mg BID'],
      diagnoses: ['Type 2 Diabetes', 'Hypertension'],
      clinicalNotes: 'Patient has a history of non-compliance with medication. Needs regular follow-up for blood pressure.',
    },
    create: {
      mrn: 'PT-99999',
      firstName: 'John',
      lastName: 'Doe',
      age: 45,
      sex: 'MALE',
      phone: '+251 911 123 456',
      allergies: ['Penicillin', 'Peanuts'],
      medications: ['Lisinopril 10mg daily', 'Metformin 500mg BID'],
      diagnoses: ['Type 2 Diabetes', 'Hypertension'],
      clinicalNotes: 'Patient has a history of non-compliance with medication. Needs regular follow-up for blood pressure.',
    }
  });

  console.log('Seeded patient:', patient.mrn);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/