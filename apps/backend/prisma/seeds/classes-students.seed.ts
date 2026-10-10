// ==============================================================================
// SEED MODULE: CLASSES & STUDENTS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import { PrismaClient, Gender, StudentStatus } from '@prisma/client';

export async function seedClassesAndStudents(
  prisma: PrismaClient,
  majorMap: Map<string, string>,
  lecturerMap: Map<string, string>,
) {
  console.log('[Seed] Seeding Classes (Lop sinh vien)...');

  const cnpmMajorId = majorMap.get('CNPM')!;
  const htttMajorId = majorMap.get('HTTT')!;
  const gv004Id = lecturerMap.get('GV004')!;
  const gv005Id = lecturerMap.get('GV005')!;

  const classesData = [
    {
      code: 'CQ.65.CNTT',
      name: 'Lớp Chính quy K65 - Công nghệ Thông tin',
      majorId: cnpmMajorId,
      academicYear: '2022-2026',
      homeroomAdvisorId: gv004Id,
    },
    {
      code: 'CQ.65.HTTT',
      name: 'Lớp Chính quy K65 - Hệ thống Thông tin',
      majorId: htttMajorId,
      academicYear: '2022-2026',
      homeroomAdvisorId: gv005Id,
    },
  ];

  const classMap = new Map<string, string>();

  for (const c of classesData) {
    const cls = await prisma.class.upsert({
      where: { code: c.code },
      update: {
        name: c.name,
        majorId: c.majorId,
        academicYear: c.academicYear,
        homeroomAdvisorId: c.homeroomAdvisorId,
      },
      create: {
        code: c.code,
        name: c.name,
        majorId: c.majorId,
        academicYear: c.academicYear,
        homeroomAdvisorId: c.homeroomAdvisorId,
      },
    });
    classMap.set(cls.code, cls.id);
  }
  console.log(`[Seed] Successfully seeded ${classMap.size} classes.`);

  console.log('[Seed] Seeding Students (Ho so Sinh vien lam do an)...');
  const cnttClassId = classMap.get('CQ.65.CNTT')!;
  const htttClassId = classMap.get('CQ.65.HTTT')!;

  const studentsData = [
    {
      code: '6551071001',
      fullName: 'Dư Nguyên An',
      gender: Gender.MALE,
      dob: new Date('2003-05-15'),
      email: '6551071001@sv.utc2.edu.vn',
      phone: '0912345678',
      classId: cnttClassId,
      gpaCumulative: 3.65,
      creditsAccumulated: 125,
      status: StudentStatus.STUDYING,
    },
    {
      code: '6551071002',
      fullName: 'Nguyễn Văn Phúc',
      gender: Gender.MALE,
      dob: new Date('2003-08-20'),
      email: '6551071002@sv.utc2.edu.vn',
      phone: '0912345679',
      classId: cnttClassId,
      gpaCumulative: 3.20,
      creditsAccumulated: 120,
      status: StudentStatus.STUDYING,
    },
    {
      code: '6551071003',
      fullName: 'Trần Thị Mai',
      gender: Gender.FEMALE,
      dob: new Date('2003-11-10'),
      email: '6551071003@sv.utc2.edu.vn',
      phone: '0912345680',
      classId: htttClassId,
      gpaCumulative: 2.85,
      creditsAccumulated: 115,
      status: StudentStatus.STUDYING,
    },
    {
      code: '6551071004',
      fullName: 'Lê Hoàng Long',
      gender: Gender.MALE,
      dob: new Date('2003-02-28'),
      email: '6551071004@sv.utc2.edu.vn',
      phone: '0912345681',
      classId: htttClassId,
      gpaCumulative: 1.85, // Dưới ngưỡng GPA 2.0 theo BR-01 để kiểm thử
      creditsAccumulated: 95,
      status: StudentStatus.STUDYING,
    },
  ];

  const studentMap = new Map<string, string>();

  for (const s of studentsData) {
    const student = await prisma.student.upsert({
      where: { code: s.code },
      update: {
        fullName: s.fullName,
        gender: s.gender,
        dob: s.dob,
        email: s.email,
        phone: s.phone,
        classId: s.classId,
        gpaCumulative: s.gpaCumulative,
        creditsAccumulated: s.creditsAccumulated,
        status: s.status,
      },
      create: {
        code: s.code,
        fullName: s.fullName,
        gender: s.gender,
        dob: s.dob,
        email: s.email,
        phone: s.phone,
        classId: s.classId,
        gpaCumulative: s.gpaCumulative,
        creditsAccumulated: s.creditsAccumulated,
        status: s.status,
      },
    });
    studentMap.set(student.code, student.id);
  }
  console.log(`[Seed] Successfully seeded ${studentMap.size} students.`);

  return { classMap, studentMap };
}
