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
      maxAdvisingQuota: 4,
    },
    {
      code: 'GV006',
      fullName: 'TS. Vũ Đức Trọng',
      email: 'trong.vuduc@utc2.edu.vn',
      phone: '0906789012',
      degree: 'Tiến sĩ',
      departmentId: khmtDeptId,
      maxAdvisingQuota: 6,
    },
    {
      code: 'GV007',
      fullName: 'ThS. Đặng Thị Ánh',
      email: 'anh.dangthi@utc2.edu.vn',
      phone: '0907890123',
      degree: 'Thạc sĩ',
      departmentId: cnpmDeptId,
      maxAdvisingQuota: 5,
    },
    {
      code: 'GV008',
      fullName: 'PGS.TS. Trịnh Quốc Bảo',
      email: 'bao.trinhquoc@utc2.edu.vn',
      phone: '0908901234',
      degree: 'Phó Giáo sư, Tiến sĩ',
      departmentId: khmtDeptId,
      maxAdvisingQuota: 7,
    },
    {
      code: 'GV009',
      fullName: 'TS. Ngô Thành Long',
      email: 'long.ngothanh@utc2.edu.vn',
      phone: '0909012345',
      degree: 'Tiến sĩ',
      departmentId: cnpmDeptId,
      maxAdvisingQuota: 5,
    },
    {
      code: 'GV010',
      fullName: 'ThS. Bùi Đình Thắng',
      email: 'thang.buidinh@utc2.edu.vn',
      phone: '0910123456',
      degree: 'Thạc sĩ',
      departmentId: htttDeptId,
      maxAdvisingQuota: 4,
    },
    {
      code: 'GV011',
      fullName: 'ThS. Đỗ Phương Nam',
      email: 'nam.dophuong@utc2.edu.vn',
      phone: '0911234567',
      degree: 'Thạc sĩ',
      departmentId: khmtDeptId,
      maxAdvisingQuota: 4,
    },
    {
      code: 'GV012',
      fullName: 'TS. Lâm Hoài Thương',
      email: 'thuong.lamhoai@utc2.edu.vn',
      phone: '0912345670',
      degree: 'Tiến sĩ',
      departmentId: cnpmDeptId,
      maxAdvisingQuota: 5,
    },
    {
      code: 'GV013',
      fullName: 'ThS. Võ Minh Trí',
      email: 'tri.vominh@utc2.edu.vn',
      phone: '0913456781',
      degree: 'Thạc sĩ',
      departmentId: htttDeptId,
      maxAdvisingQuota: 4,
    },
    {
      code: 'GV014',
      fullName: 'TS. Phan Bá Đạt',
      email: 'dat.phanba@utc2.edu.vn',
      phone: '0914567892',
      degree: 'Tiến sĩ',
      departmentId: khmtDeptId,
      maxAdvisingQuota: 5,
    },
    {
      code: 'GV015',
      fullName: 'ThS. Huỳnh Gia Bảo',
      email: 'bao.huynhgia@utc2.edu.vn',
      phone: '0915678903',
      degree: 'Thạc sĩ',
      departmentId: cnpmDeptId,
      maxAdvisingQuota: 4,
    },
    {
      code: 'GV016',
      fullName: 'TS. Mai Thanh Tùng',
      email: 'tung.maithanh@utc2.edu.vn',
      phone: '0916789014',
      degree: 'Tiến sĩ',
      departmentId: htttDeptId,
      maxAdvisingQuota: 5,
    },
    {
      code: 'GV017',
      fullName: 'ThS. Lê Hoàng Yến',
      email: 'yen.lehoang@utc2.edu.vn',
      phone: '0917890125',
      degree: 'Thạc sĩ',
      departmentId: cnpmDeptId,
      maxAdvisingQuota: 4,
    },
    {
      code: 'GV018',
      fullName: 'TS. Trịnh Vĩnh Bình',
      email: 'binh.trinhvinh@utc2.edu.vn',
      phone: '0918901236',
      degree: 'Tiến sĩ',
      departmentId: cnpmDeptId,
      maxAdvisingQuota: 6,
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
  const gv006Id = lecturerMap.get('GV006')!;

  await prisma.department.update({
    where: { code: 'BM_CNPM' },
    data: { headLecturerId: gv002Id },
  });

  await prisma.department.update({
    where: { code: 'BM_HTTT_MANG' },
    data: { headLecturerId: gv003Id },
  });

  await prisma.department.update({
    where: { code: 'BM_KHMT' },
    data: { headLecturerId: gv006Id },
  });

  console.log('[Seed] Assigned HODs to BM_CNPM, BM_HTTT_MANG and BM_KHMT.');

  return { lecturerMap };
}
