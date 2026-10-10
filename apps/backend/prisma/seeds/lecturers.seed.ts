// ==============================================================================
// SEED MODULE: LECTURERS & DEPARTMENT HEADS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import { PrismaClient } from '@prisma/client';

export async function seedLecturers(
  prisma: PrismaClient,
  departmentMap: Map<string, string>,
) {
  console.log('[Seed] Seeding Lecturers...');

  const cnpmDeptId = departmentMap.get('BM_CNPM')!;
  const htttDeptId = departmentMap.get('BM_HTTT_MANG')!;
  const khmtDeptId = departmentMap.get('BM_KHMT')!;

  const lecturersData = [
    {
      code: 'GV001',
      fullName: 'TS. Nguyễn Văn An',
      email: 'an.nguyenvan@utc2.edu.vn',
      phone: '0901234567',
      degree: 'Tiến sĩ',
      departmentId: cnpmDeptId,
      maxAdvisingQuota: 5,
    },
    {
      code: 'GV002',
      fullName: 'PGS.TS. Trần Văn Bình',
      email: 'binh.tranvan@utc2.edu.vn',
      phone: '0902345678',
      degree: 'Phó Giáo sư, Tiến sĩ',
      departmentId: cnpmDeptId,
      maxAdvisingQuota: 7,
    },
    {
      code: 'GV003',
      fullName: 'TS. Lê Thị Cẩm',
      email: 'cam.lethi@utc2.edu.vn',
      phone: '0903456789',
      degree: 'Tiến sĩ',
      departmentId: htttDeptId,
      maxAdvisingQuota: 5,
    },
    {
      code: 'GV004',
      fullName: 'ThS. Phạm Thị Miên',
      email: 'mien.phamthi@utc2.edu.vn',
      phone: '0904567890',
      degree: 'Thạc sĩ',
      departmentId: cnpmDeptId,
      maxAdvisingQuota: 5,
    },
    {
      code: 'GV005',
      fullName: 'ThS. Hoàng Văn Em',
      email: 'em.hoangvan@utc2.edu.vn',
      phone: '0905678901',
      degree: 'Thạc sĩ',
      departmentId: htttDeptId,
      maxAdvisingQuota: 3,
    },
  ];

  const lecturerMap = new Map<string, string>();

  for (const l of lecturersData) {
    const lecturer = await prisma.lecturer.upsert({
      where: { code: l.code },
      update: {
        fullName: l.fullName,
        email: l.email,
        phone: l.phone,
        degree: l.degree,
        departmentId: l.departmentId,
        maxAdvisingQuota: l.maxAdvisingQuota,
      },
      create: {
        code: l.code,
        fullName: l.fullName,
        email: l.email,
        phone: l.phone,
        degree: l.degree,
        departmentId: l.departmentId,
        maxAdvisingQuota: l.maxAdvisingQuota,
      },
    });
    lecturerMap.set(lecturer.code, lecturer.id);
  }
  console.log(`[Seed] Successfully seeded ${lecturerMap.size} lecturers.`);

  // Gán Trưởng Bộ môn (Head of Department)
  console.log('[Seed] Assigning Department Heads (Truong bo mon)...');
  const gv002Id = lecturerMap.get('GV002')!;
  const gv003Id = lecturerMap.get('GV003')!;

  await prisma.department.update({
    where: { code: 'BM_CNPM' },
    data: { headLecturerId: gv002Id },
  });

  await prisma.department.update({
    where: { code: 'BM_HTTT_MANG' },
    data: { headLecturerId: gv003Id },
  });

  console.log('[Seed] Assigned HODs to BM_CNPM and BM_HTTT_MANG.');

  return { lecturerMap };
}
