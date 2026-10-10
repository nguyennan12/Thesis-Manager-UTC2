// ==============================================================================
// SEED MODULE: SEMESTERS & TIMELINES
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import { PrismaClient } from '@prisma/client';

export async function seedSemesters(prisma: PrismaClient) {
  console.log('[Seed] Seeding Academic Semester (2026-2027_HK1)...');

  const semester = await prisma.semester.upsert({
    where: { code: '2026-2027_HK1' },
    update: {
      name: 'Học kỳ 1 Năm học 2026-2027',
      academicYear: '2026-2027',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2027-01-15'),
      topicRegistrationStart: new Date('2026-09-10T00:00:00.000Z'),
      topicRegistrationEnd: new Date('2026-09-30T23:59:59.000Z'),
      thesisSubmissionEnd: new Date('2026-12-25T23:59:59.000Z'),
      defenseStart: new Date('2027-01-05T08:00:00.000Z'),
      defenseEnd: new Date('2027-01-12T17:00:00.000Z'),
      isCurrent: true,
    },
    create: {
      code: '2026-2027_HK1',
      name: 'Học kỳ 1 Năm học 2026-2027',
      academicYear: '2026-2027',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2027-01-15'),
      topicRegistrationStart: new Date('2026-09-10T00:00:00.000Z'),
      topicRegistrationEnd: new Date('2026-09-30T23:59:59.000Z'),
      thesisSubmissionEnd: new Date('2026-12-25T23:59:59.000Z'),
      defenseStart: new Date('2027-01-05T08:00:00.000Z'),
      defenseEnd: new Date('2027-01-12T17:00:00.000Z'),
      isCurrent: true,
    },
  });

  console.log(`[Seed] Current Semester: ${semester.name} (${semester.code})`);
  return { semester };
}
