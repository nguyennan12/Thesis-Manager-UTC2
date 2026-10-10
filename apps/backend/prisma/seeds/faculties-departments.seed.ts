// ==============================================================================
// SEED MODULE: FACULTIES, MAJORS & DEPARTMENTS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import { PrismaClient } from '@prisma/client';

export async function seedFacultiesAndDepartments(prisma: PrismaClient) {
  console.log('[Seed] Seeding Faculty (Khoa Cong nghe Thong tin)...');
  const faculty = await prisma.faculty.upsert({
    where: { code: 'CNTT' },
    update: {
      name: 'Khoa Công nghệ Thông tin',
      description: 'Khoa Công nghệ Thông tin – Trường ĐH Giao thông Vận tải Phân hiệu tại TP.HCM',
    },
    create: {
      code: 'CNTT',
      name: 'Khoa Công nghệ Thông tin',
      description: 'Khoa Công nghệ Thông tin – Trường ĐH Giao thông Vận tải Phân hiệu tại TP.HCM',
    },
  });
  console.log(`[Seed] Faculty: ${faculty.name} (${faculty.code})`);

  console.log('[Seed] Seeding Majors (Nganh dao tao)...');
  const majorsData = [
    {
      code: 'CNPM',
      name: 'Kỹ thuật Phần mềm',
      facultyId: faculty.id,
    },
    {
      code: 'HTTT',
      name: 'Hệ thống Thông tin',
      facultyId: faculty.id,
    },
    {
      code: 'CNTT',
      name: 'Công nghệ Thông tin',
      facultyId: faculty.id,
    },
  ];

  const majorMap = new Map<string, string>();
  for (const m of majorsData) {
    const major = await prisma.major.upsert({
      where: { code: m.code },
      update: {
        name: m.name,
        facultyId: m.facultyId,
      },
      create: {
        code: m.code,
        name: m.name,
        facultyId: m.facultyId,
      },
    });
    majorMap.set(major.code, major.id);
  }
  console.log(`[Seed] Successfully seeded ${majorMap.size} majors.`);

  console.log('[Seed] Seeding Departments (Bo mon truc thuoc)...');
  const departmentsData = [
    {
      code: 'BM_CNPM',
      name: 'Bộ môn Công nghệ Phần mềm',
      facultyId: faculty.id,
    },
    {
      code: 'BM_HTTT_MANG',
      name: 'Bộ môn Hệ thống Thông tin & Mạng máy tính',
      facultyId: faculty.id,
    },
    {
      code: 'BM_KHMT',
      name: 'Bộ môn Khoa học Máy tính',
      facultyId: faculty.id,
    },
  ];

  const departmentMap = new Map<string, string>();
  for (const d of departmentsData) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: {
        name: d.name,
        facultyId: d.facultyId,
      },
      create: {
        code: d.code,
        name: d.name,
        facultyId: d.facultyId,
      },
    });
    departmentMap.set(dept.code, dept.id);
  }
  console.log(`[Seed] Successfully seeded ${departmentMap.size} departments.`);

  return { faculty, majorMap, departmentMap };
}
