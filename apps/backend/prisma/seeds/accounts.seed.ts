// ==============================================================================
// SEED MODULE: USER ACCOUNTS & SCOPED ROLE ASSIGNMENTS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ROLES, ROLE_SCOPES } from '../../src/common/constants';

export async function seedAccounts(
  prisma: PrismaClient,
  roleMap: Map<string, string>,
  facultyId: string,
  departmentMap: Map<string, string>,
  lecturerMap: Map<string, string>,
  studentMap: Map<string, string>,
) {
  console.log('[Seed] Generating Bcrypt password hashes (Salt 10)...');
  const adminPasswordHash = await bcrypt.hash(
    getSeedPassword('DEMO_ADMIN_PASSWORD', 'Admin@123456'),
    10,
  );
  const userPasswordHash = await bcrypt.hash(
    getSeedPassword('DEMO_ACCOUNT_PASSWORD', 'Utc2@123456'),
    10,
  );

  const adminRoleId = roleMap.get(ROLES.ADMIN)!;
  const staffRoleId = roleMap.get(ROLES.STAFF)!;
  const lecturerRoleId = roleMap.get(ROLES.LECTURER)!;
  const studentRoleId = roleMap.get(ROLES.STUDENT)!;

  const cnpmDeptId = departmentMap.get('BM_CNPM')!;
  const htttDeptId = departmentMap.get('BM_HTTT_MANG')!;

  // 1. Super Admin Account
  console.log('[Seed] Seeding Super Admin Account ...');
  const adminAccount = await prisma.account.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: adminPasswordHash,
      email: 'admin@utc2.edu.vn',
      isActive: true,
    },
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      email: 'admin@utc2.edu.vn',
      isActive: true,
    },
  });

  await assignAccountRole(prisma, adminAccount.id, adminRoleId, ROLE_SCOPES.GLOBAL, undefined);

  // 2. Giáo vụ Khoa (Academic Affairs Staff)
  console.log('[Seed] Seeding Academic Affairs Staff Account (gvk_cntt)...');
  const staffAccount = await prisma.account.upsert({
    where: { username: 'gvk_cntt' },
    update: {
      passwordHash: userPasswordHash,
      email: 'gvk.cntt@utc2.edu.vn',
      isActive: true,
    },
    create: {
      username: 'gvk_cntt',
      passwordHash: userPasswordHash,
      email: 'gvk.cntt@utc2.edu.vn',
      isActive: true,
    },
  });
  await assignAccountRole(prisma, staffAccount.id, staffRoleId, ROLE_SCOPES.FACULTY, facultyId);

  // 3. Ban Chủ nhiệm Khoa (Dean - GV001)
  console.log('[Seed] Seeding Faculty Dean Account (dean_cntt)...');
  const gv001Id = lecturerMap.get('GV001')!;
  const deanAccount = await prisma.account.upsert({
    where: { username: 'dean_cntt' },
    update: {
      passwordHash: userPasswordHash,
      email: 'an.nguyenvan@utc2.edu.vn',
      lecturerId: gv001Id,
      isActive: true,
    },
    create: {
      username: 'dean_cntt',
      passwordHash: userPasswordHash,
      email: 'an.nguyenvan@utc2.edu.vn',
      lecturerId: gv001Id,
      isActive: true,
    },
  });
  await assignAccountRole(prisma, deanAccount.id, lecturerRoleId, ROLE_SCOPES.FACULTY, facultyId);

  // 4. Trưởng Bộ môn CNPM (HOD - GV002)
  console.log('[Seed] Seeding HOD CNPM Account (hod_cnpm)...');
  const gv002Id = lecturerMap.get('GV002')!;
  const hodCnpmAccount = await prisma.account.upsert({
    where: { username: 'hod_cnpm' },
    update: {
      passwordHash: userPasswordHash,
      email: 'binh.tranvan@utc2.edu.vn',
      lecturerId: gv002Id,
      isActive: true,
    },
    create: {
      username: 'hod_cnpm',
      passwordHash: userPasswordHash,
      email: 'binh.tranvan@utc2.edu.vn',
      lecturerId: gv002Id,
      isActive: true,
    },
  });
  await assignAccountRole(prisma, hodCnpmAccount.id, lecturerRoleId, ROLE_SCOPES.DEPARTMENT, cnpmDeptId);

  // 5. Trưởng Bộ môn HTTT (HOD - GV003) & KHMT (HOD - GV006)
  console.log('[Seed] Seeding HOD Accounts (hod_httt, hod_khmt)...');
  const gv003Id = lecturerMap.get('GV003')!;
  const hodHtttAccount = await prisma.account.upsert({
    where: { username: 'hod_httt' },
    update: {
      passwordHash: userPasswordHash,
      email: 'cam.lethi@utc2.edu.vn',
      lecturerId: gv003Id,
      isActive: true,
    },
    create: {
      username: 'hod_httt',
      passwordHash: userPasswordHash,
      email: 'cam.lethi@utc2.edu.vn',
      lecturerId: gv003Id,
      isActive: true,
    },
  });
  await assignAccountRole(prisma, hodHtttAccount.id, lecturerRoleId, ROLE_SCOPES.DEPARTMENT, htttDeptId);

  const khmtDeptId = departmentMap.get('BM_KHMT');
  const gv006Id = lecturerMap.get('GV006');
  if (khmtDeptId && gv006Id) {
    const hodKhmtAccount = await prisma.account.upsert({
      where: { username: 'hod_khmt' },
      update: {
        passwordHash: userPasswordHash,
        email: 'trong.vuduc@utc2.edu.vn',
        lecturerId: gv006Id,
        isActive: true,
      },
      create: {
        username: 'hod_khmt',
        passwordHash: userPasswordHash,
        email: 'trong.vuduc@utc2.edu.vn',
        lecturerId: gv006Id,
        isActive: true,
      },
    });
    await assignAccountRole(prisma, hodKhmtAccount.id, lecturerRoleId, ROLE_SCOPES.DEPARTMENT, khmtDeptId);
  }

  // 6. Giảng viên (Đảm bảo có tài khoản gv_mienpt, gv_emhv, gv_binhtv và tất cả GV001->GV018)
  console.log('[Seed] Seeding Lecturer Accounts (gv_mienpt, gv_binhtv, and gv_001 -> gv_018)...');
  const gv004Id = lecturerMap.get('GV004')!;
  const gv004Account = await prisma.account.upsert({
    where: { username: 'gv_mienpt' },
    update: {
      passwordHash: userPasswordHash,
      email: 'mien.phamthi@utc2.edu.vn',
      lecturerId: gv004Id,
      isActive: true,
    },
    create: {
      username: 'gv_mienpt',
      passwordHash: userPasswordHash,
      email: 'mien.phamthi@utc2.edu.vn',
      lecturerId: gv004Id,
      isActive: true,
    },
  });
  await assignAccountRole(prisma, gv004Account.id, lecturerRoleId, ROLE_SCOPES.OWNER, undefined);

  const gv018Id = lecturerMap.get('GV018');
  if (gv018Id) {
    const gv018Account = await prisma.account.upsert({
      where: { username: 'gv_binhtv' },
      update: {
        passwordHash: userPasswordHash,
        email: 'binh.trinhvinh@utc2.edu.vn',
        lecturerId: gv018Id,
        isActive: true,
      },
      create: {
        username: 'gv_binhtv',
        passwordHash: userPasswordHash,
        email: 'binh.trinhvinh@utc2.edu.vn',
        lecturerId: gv018Id,
        isActive: true,
      },
    });
    await assignAccountRole(prisma, gv018Account.id, lecturerRoleId, ROLE_SCOPES.OWNER, undefined);
  }

  // Các giảng viên đã có tài khoản đặc thù (dean, hod, gv_mienpt, gv_binhtv)
  const seededLecturerIds = new Set<string>();
  if (gv001Id) seededLecturerIds.add(gv001Id);
  if (gv002Id) seededLecturerIds.add(gv002Id);
  if (gv003Id) seededLecturerIds.add(gv003Id);
  if (gv004Id) seededLecturerIds.add(gv004Id);
  if (gv006Id) seededLecturerIds.add(gv006Id);
  if (gv018Id) seededLecturerIds.add(gv018Id);

  // Tạo tài khoản cho các giảng viên còn lại
  for (const [code, lecturerId] of lecturerMap.entries()) {
    if (seededLecturerIds.has(lecturerId)) continue;

    const existing = await prisma.account.findUnique({
      where: { lecturerId },
    });

    if (existing) {
      await assignAccountRole(prisma, existing.id, lecturerRoleId, ROLE_SCOPES.OWNER, undefined);
      continue;
    }

    const username = `gv_${code.toLowerCase()}`;
    const email = `${code.toLowerCase()}@utc2.edu.vn`;

    const lecturerAccount = await prisma.account.upsert({
      where: { username },
      update: {
        passwordHash: userPasswordHash,
        email,
        lecturerId,
        isActive: true,
      },
      create: {
        username,
        passwordHash: userPasswordHash,
        email,
        lecturerId,
        isActive: true,
      },
    });
    await assignAccountRole(prisma, lecturerAccount.id, lecturerRoleId, ROLE_SCOPES.OWNER, undefined);
  }

  // 7. Sinh viên làm đồ án (Tạo tài khoản cho toàn bộ 100 sinh viên)
  console.log(`[Seed] Seeding 100 Student Accounts (sv_6551071001 -> sv_6551071100)...`);
  for (const [code, studentId] of studentMap.entries()) {
    const existing = await prisma.account.findUnique({
      where: { studentId },
    });

    if (existing) {
      await assignAccountRole(prisma, existing.id, studentRoleId, ROLE_SCOPES.OWNER, undefined);
      continue;
    }

    const username = `sv_${code}`;
    const email = `${code}@sv.utc2.edu.vn`;

    const studentAccount = await prisma.account.upsert({
      where: { username },
      update: {
        passwordHash: userPasswordHash,
        email,
        studentId,
        isActive: true,
      },
      create: {
        username,
        passwordHash: userPasswordHash,
        email,
        studentId,
        isActive: true,
      },
    });
    await assignAccountRole(prisma, studentAccount.id, studentRoleId, ROLE_SCOPES.OWNER, undefined);
  }

  console.log('[Seed] Successfully seeded all User Accounts & Scoped Roles for 18 Lecturers & 100 Students.');
}

/**
 * Helper gán vai trò và phạm vi Scope cho tài khoản
 */
async function assignAccountRole(
  prisma: PrismaClient,
  accountId: string,
  roleId: string,
  scopeType: string,
  scopeId?: string,
) {
  const existing = await prisma.accountRole.findFirst({
    where: {
      accountId,
      roleId,
    },
  });

  if (existing) {
    await prisma.accountRole.update({
      where: { id: existing.id },
      data: {
        scopeType,
        scopeId,
        isActive: true,
      },
    });
  } else {
    await prisma.accountRole.create({
      data: {
        accountId,
        roleId,
        scopeType,
        scopeId,
        isActive: true,
      },
    });
  }
}

function getSeedPassword(name: string, localFallback: string): string {
  const configuredPassword = process.env[name];
  if (configuredPassword) return configuredPassword;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} must be configured when seeding production accounts.`);
  }

  return localFallback;
}
