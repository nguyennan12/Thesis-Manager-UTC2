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
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const userPasswordHash = await bcrypt.hash('Utc2@123456', 10);

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
  console.log('[Seed] Seeding Academic Affairs Staff Account (gvk_cntt / Utc2@123456)...');
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
  console.log('[Seed] Seeding Faculty Dean Account (dean_cntt / Utc2@123456)...');
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
  console.log('[Seed] Seeding HOD CNPM Account (hod_cnpm / Utc2@123456)...');
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

  // 5. Trưởng Bộ môn HTTT (HOD - GV003)
  console.log('[Seed] Seeding HOD HTTT Account (hod_httt / Utc2@123456)...');
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

  // 6. Giảng viên thường (GV004, GV005)
  console.log('[Seed] Seeding Lecturer Accounts (gv_mienpt, gv_emhv / Utc2@123456)...');
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

  const gv005Id = lecturerMap.get('GV005')!;
  const gv005Account = await prisma.account.upsert({
    where: { username: 'gv_emhv' },
    update: {
      passwordHash: userPasswordHash,
      email: 'em.hoangvan@utc2.edu.vn',
      lecturerId: gv005Id,
      isActive: true,
    },
    create: {
      username: 'gv_emhv',
      passwordHash: userPasswordHash,
      email: 'em.hoangvan@utc2.edu.vn',
      lecturerId: gv005Id,
      isActive: true,
    },
  });
  await assignAccountRole(prisma, gv005Account.id, lecturerRoleId, ROLE_SCOPES.OWNER, undefined);

  // 7. Sinh viên làm đồ án (SV001 -> SV004)
  console.log('[Seed] Seeding Student Accounts (sv_6551071001 -> 1004 / Utc2@123456)...');
  const studentCodes = ['6551071001', '6551071002', '6551071003', '6551071004'];
  for (const code of studentCodes) {
    const studentId = studentMap.get(code)!;
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

  console.log('[Seed] Successfully seeded all User Accounts & Scoped Roles.');
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
