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
  const cnttMajorId = majorMap.get('CNTT') || cnpmMajorId;
  const gv004Id = lecturerMap.get('GV004')!;
  const gv005Id = lecturerMap.get('GV005')!;
  const gv006Id = lecturerMap.get('GV006') || gv004Id;

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
    {
      code: 'CQ.65.KHMT',
      name: 'Lớp Chính quy K65 - Khoa học Máy tính',
      majorId: cnttMajorId,
      academicYear: '2022-2026',
      homeroomAdvisorId: gv006Id,
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

  console.log('[Seed] Seeding 100 Students (6551071001 -> 6551071100)...');
  const cnttClassId = classMap.get('CQ.65.CNTT')!;
  const htttClassId = classMap.get('CQ.65.HTTT')!;
  const khmtClassId = classMap.get('CQ.65.KHMT')!;
  const classList = [cnttClassId, htttClassId, khmtClassId];

  const familyNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Đoàn'];
  const middleMale = ['Văn', 'Hữu', 'Đức', 'Quốc', 'Minh', 'Thành', 'Gia', 'Tuấn', 'Công', 'Khánh', 'Nhật', 'Bảo'];
  const middleFemale = ['Thị', 'Ngọc', 'Mai', 'Thanh', 'Phương', 'Bảo', 'Kim', 'Ánh', 'Diệu', 'Hồng', 'Mỹ', 'Tuyết'];
  const lastMale = ['Phúc', 'Long', 'Huy', 'Khoa', 'Tú', 'Dũng', 'Nam', 'Hiếu', 'Thịnh', 'Hùng', 'Bảo', 'Kiệt', 'Quân', 'Thắng', 'Tài', 'Trí', 'Đạt', 'Bình', 'Hải', 'Hào'];
  const lastFemale = ['Mai', 'Linh', 'Trang', 'Hương', 'Lan', 'Vy', 'Nhi', 'Trâm', 'Ngân', 'Yến', 'Thảo', 'Quyên', 'Quỳnh', 'Châu', 'Tâm', 'Hà', 'My', 'Duyên', 'Uyên', 'Thư'];

  const studentsData: any[] = [
    // Sinh viên mẫu full flow chính
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
  ];

  // Tạo thêm 99 sinh viên từ 6551071002 đến 6551071100
  for (let i = 2; i <= 100; i++) {
    const code = `6551071${String(i).padStart(3, '0')}`;
    const isFemale = i % 3 === 0;
    const gender = isFemale ? Gender.FEMALE : Gender.MALE;
    const fn = familyNames[i % familyNames.length];
    const mn = isFemale ? middleFemale[i % middleFemale.length] : middleMale[i % middleMale.length];
    const ln = isFemale ? lastFemale[i % lastFemale.length] : lastMale[i % lastMale.length];
    const fullName = `${fn} ${mn} ${ln}`;
    const classId = classList[i % classList.length];

    // Sinh viên thứ 4 có GPA thấp để test validation BR-01
    const gpaCumulative = i === 4 ? 1.85 : +(2.4 + ((i * 17) % 150) / 100).toFixed(2);
    const creditsAccumulated = i === 4 ? 95 : 110 + (i % 26);
    const birthDay = 1 + (i % 28);
    const birthMonth = 1 + (i % 12);
    const dob = new Date(`2003-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`);

    studentsData.push({
      code,
      fullName,
      gender,
      dob,
      email: `${code}@sv.utc2.edu.vn`,
      phone: `0912${String(345000 + i).slice(0, 6)}`,
      classId,
      gpaCumulative,
      creditsAccumulated,
      status: StudentStatus.STUDYING,
    });
  }

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
  console.log(`[Seed] Successfully seeded ${studentMap.size} students (100 students).`);

  return { classMap, studentMap };
}
