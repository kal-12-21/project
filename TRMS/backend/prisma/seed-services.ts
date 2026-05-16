
// This is the testing script for the services directory  
/*import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const SERVICES = [
  { name: 'ICU', category: 'Critical Care', description: 'Intensive Care Unit' },
  { name: 'NICU', category: 'Critical Care', description: 'Neonatal Intensive Care Unit' },
  { name: 'Emergency', category: 'Emergency', description: 'Emergency Department' },
  { name: 'General Surgery', category: 'Surgery', description: 'General Surgery' },
  { name: 'Maternity', category: 'Obstetrics', description: 'Maternity and Labor Delivery' },
  { name: 'Pediatrics', category: 'Pediatrics', description: 'General Pediatrics' },
  { name: 'Orthopedics', category: 'Surgery', description: 'Orthopedic Surgery' },
  { name: 'Cardiology', category: 'Specialized', description: 'Cardiology Clinic and Interventions' },
  { name: 'Neurology', category: 'Specialized', description: 'Neurology Clinic' },
];

async function main() {
  console.log('Seeding Clinical Service Directory...');
  for (const s of SERVICES) {
    await prisma.clinicalServiceDirectory.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }
  console.log('Done seeding.');
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