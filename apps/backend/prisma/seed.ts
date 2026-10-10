// ==============================================================================
// MAIN PRISMA DATABASE SEED RUNNER
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import path from 'path';
import dotenv from 'dotenv';
import { createPrismaClient } from '../src/database/prisma-client.factory';

import { seedRolesAndPermissions } from './seeds/roles-permissions.seed';
import { seedFacultiesAndDepartments } from './seeds/faculties-departments.seed';
import { seedSemesters } from './seeds/semesters.seed';
import { seedLecturers } from './seeds/lecturers.seed';
import { seedClassesAndStudents } from './seeds/classes-students.seed';
import { seedAccounts } from './seeds/accounts.seed';

// Load .env from multiple probable locations in monorepo
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../.env'),
];

for (const p of envPaths) {
  dotenv.config({ path: p });
}

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:root_password@localhost:5432/utc2_thesis_db?schema=public';

// Sử dụng tập trung 1 factory duy nhất để khởi tạo kết nối DB
const { prisma, pool } = createPrismaClient(connectionString, true);

async function main() {
  console.log('====================================================================');
  console.log('[Seed] STARTING DATABASE SEEDING PROCESS: UTC2-DAMS (SPRINT 1)');
  console.log('====================================================================');

  const startTime = Date.now();

  // 1. Seed Roles & 45+ Permissions
  console.log('\n[Seed] Step 1/6: Seeding RBAC (Roles & Granular Permissions)...');
  const { roleMap } = await seedRolesAndPermissions(prisma);

  // 2. Seed Faculty, Majors & Departments
  console.log('\n[Seed] Step 2/6: Seeding Institutional Structure (Faculty, Majors, Departments)...');
  const { faculty, majorMap, departmentMap } = await seedFacultiesAndDepartments(prisma);

  // 3. Seed Semester & Timelines
  console.log('\n[Seed] Step 3/6: Seeding Semesters & Defense Timelines...');
  await seedSemesters(prisma);

  // 4. Seed Lecturers & Assign HODs
  console.log('\n[Seed] Step 4/6: Seeding Lecturers & Department Heads...');
  const { lecturerMap } = await seedLecturers(prisma, departmentMap);

  // 5. Seed Classes & Students
  console.log('\n[Seed] Step 5/6: Seeding Classes & Student Profiles...');
  const { studentMap } = await seedClassesAndStudents(prisma, majorMap, lecturerMap);

  // 6. Seed Accounts & AccountRoles
  console.log('\n[Seed] Step 6/6: Seeding User Accounts & Scoped Roles...');
  await seedAccounts(prisma, roleMap, faculty.id, departmentMap, lecturerMap, studentMap);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n====================================================================');
  console.log(`[Seed] DATABASE SEEDING COMPLETED SUCCESSFULLY IN ${duration}s!`);
  console.log('====================================================================');
  console.log('DEMO CREDENTIALS:');
  console.log('   - Admin:      username: admin        | password: Admin@123456');
  console.log('   - Giao vu:    username: gvk_cntt     | password: Utc2@123456');
  console.log('   - BCN Khoa:   username: dean_cntt    | password: Utc2@123456');
  console.log('   - Truong BM:  username: hod_cnpm     | password: Utc2@123456');
  console.log('   - Giang vien: username: gv_mienpt    | password: Utc2@123456');
  console.log('   - Sinh vien:  username: sv_6551071001| password: Utc2@123456');
  console.log('====================================================================\n');
}

main()
  .catch((e) => {
    console.error('[Seed Error] Database Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
