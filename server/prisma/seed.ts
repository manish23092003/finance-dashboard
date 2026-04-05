import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

// ─── Seed Data ──────────────────────────────────────────────────────────────

const USERS = [
  {
    name: 'Vikram Singh',
    email: 'vikram.admin@zorvyn.in',
    role: 'ADMIN',
  },
  {
    name: 'Neha Sharma',
    email: 'neha.analyst@zorvyn.in',
    role: 'ANALYST',
  },
  {
    name: 'Rahul Desai',
    email: 'rahul.viewer@zorvyn.in',
    role: 'VIEWER',
  },
];

const INCOME_NOTES = [
  'Client Invoice - Reliance Retail',
  'Consulting Fee - TechMahindra',
  'Software Subscription Revenue',
  'Q3 Retainer'
];

const EXPENSE_NOTES = [
  'Office Rent (HSR Layout)',
  'GST Payment',
  'Vendor Payment - TCS',
  'Internet - Jio Enterprise',
  'AWS Cloud Hosting',
  'Employee Salaries',
  'Razorpay Transaction Fees',
  'Diwali Bonus'
];

/**
 * Generate a random number between min and max (inclusive).
 */
function rand(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/**
 * Generate a random date within a given month (0-indexed) and year.
 */
function randomDateInMonth(year: number, month: number): Date {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  return new Date(year, month, day, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
}

/**
 * Generate realistic financial records for a user across the last 6 months.
 */
function generateRecords(userId: string): Array<{
  userId: string;
  amount: number;
  type: string;
  category: string;
  date: Date;
  notes: string;
}> {
  const records: Array<{
    userId: string;
    amount: number;
    type: string;
    category: string;
    date: Date;
    notes: string;
  }> = [];

  // Generate records across Oct 2025 – Mar 2026 (6 months)
  const months = [
    { year: 2025, month: 9 },  // Oct 2025
    { year: 2025, month: 10 }, // Nov 2025
    { year: 2025, month: 11 }, // Dec 2025
    { year: 2026, month: 0 },  // Jan 2026
    { year: 2026, month: 1 },  // Feb 2026
    { year: 2026, month: 2 },  // Mar 2026
  ];

  for (const { year, month } of months) {
    // 1-3 income records per month
    const incomeCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < incomeCount; i++) {
      const notes = INCOME_NOTES[Math.floor(Math.random() * INCOME_NOTES.length)];
      
      // Determine category based on note
      const category = notes.includes('Software') ? 'SaaS Revenue' : 
                       notes.includes('Retainer') ? 'Retainer' : 
                       'Consulting';

      // Generate large realistic INR amounts
      const amount = notes.includes('Reliance') ? rand(250000, 500000) :
                     notes.includes('TechMahindra') ? rand(150000, 300000) :
                     rand(50000, 100000);

      records.push({
        userId,
        amount,
        type: 'INCOME',
        category,
        date: randomDateInMonth(year, month),
        notes: `${notes} - ${new Date(year, month).toLocaleString('default', { month: 'short', year: 'numeric' })}`,
      });
    }

    // 4-8 expense records per month
    const expenseCount = Math.floor(Math.random() * 5) + 4;
    for (let i = 0; i < expenseCount; i++) {
      const notes = EXPENSE_NOTES[Math.floor(Math.random() * EXPENSE_NOTES.length)];
      
      const category = notes.includes('Rent') ? 'Rent' :
                       notes.includes('GST') ? 'Taxes' :
                       notes.includes('Vendor') ? 'Contractors' :
                       notes.includes('Salaries') || notes.includes('Bonus') ? 'Payroll' :
                       notes.includes('AWS') || notes.includes('Internet') ? 'Infrastructure' :
                       'Platform Fees';

      // Realistic INR expenses
      const amount = category === 'Rent' ? rand(50000, 80000) :
                     category === 'Payroll' ? rand(150000, 350000) :
                     category === 'Taxes' ? rand(10000, 45000) :
                     category === 'Infrastructure' ? rand(15000, 35000) :
                     category === 'Contractors' ? rand(25000, 95000) :
                     rand(5000, 15000); // generic smaller fees

      records.push({
        userId,
        amount,
        type: 'EXPENSE',
        category,
        date: randomDateInMonth(year, month),
        notes: notes,
      });
    }
  }

  return records;
}

// ─── Main Seed Function ─────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data
  console.log('  Cleaning existing data...');
  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('  Creating users...');
  const createdUsers: { id: string; name: string; role: string }[] = [];

  const defaultPasswordHash = await bcrypt.hash('Admin123!', 10);

  for (const userData of USERS) {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        passwordHash: defaultPasswordHash,
        role: userData.role,
      },
    });
    createdUsers.push({ id: user.id, name: user.name, role: user.role });
    console.log(`    ✅ ${user.name} (${userData.role}) — ${userData.email}`);
  }

  // Create financial records for each user
  console.log('\n  Creating financial records...');
  let totalRecords = 0;

  for (const user of createdUsers) {
    const records = generateRecords(user.id);
    await prisma.financialRecord.createMany({ data: records });
    totalRecords += records.length;
    console.log(`    ✅ ${records.length} records for ${user.name}`);
  }

  // Summary
  console.log(`\n┌─────────────────────────────────────────────┐`);
  console.log(`│  🌱 Seed Complete                           │`);
  console.log(`│  Users: ${createdUsers.length.toString().padEnd(5)}                              │`);
  console.log(`│  Records: ${totalRecords.toString().padEnd(5)}                            │`);
  console.log(`└─────────────────────────────────────────────┘`);
  console.log(`\n  Login credentials:`);
  console.log(`  ─────────────────`);
  console.log(`  ADMIN:   vikram.admin@zorvyn.in   / Admin123!`);
  console.log(`  ANALYST: neha.analyst@zorvyn.in   / Admin123!`);
  console.log(`  VIEWER:  rahul.viewer@zorvyn.in   / Admin123!\n`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
