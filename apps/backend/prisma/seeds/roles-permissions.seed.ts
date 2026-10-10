// ==============================================================================
// SEED MODULE: ROLES & PERMISSIONS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import { PrismaClient } from '@prisma/client';
import {
  SYSTEM_ROLES_METADATA,
  PERMISSIONS_METADATA,
  ROLE_DEFAULT_PERMISSIONS,
} from '../../src/common/constants';

export async function seedRolesAndPermissions(prisma: PrismaClient) {
  console.log('[Seed] Seeding 4 System Roles...');
  const roleMap = new Map<string, string>();

  for (const roleData of SYSTEM_ROLES_METADATA) {
    const role = await prisma.role.upsert({
      where: { code: roleData.code },
      update: {
        name: roleData.name,
        description: roleData.description,
        isSystem: roleData.isSystem,
        isActive: true,
      },
      create: {
        code: roleData.code,
        name: roleData.name,
        description: roleData.description,
        isSystem: roleData.isSystem,
        isActive: true,
      },
    });
    roleMap.set(role.code, role.id);
  }
  console.log(`[Seed] Successfully upserted ${roleMap.size} roles.`);

  console.log('[Seed] Seeding 45+ Granular Permissions...');
  const permMap = new Map<string, string>();

  for (const permData of PERMISSIONS_METADATA) {
    const perm = await prisma.permission.upsert({
      where: { code: permData.code },
      update: {
        name: permData.name,
        module: permData.module,
        description: permData.description,
      },
      create: {
        code: permData.code,
        name: permData.name,
        module: permData.module,
        description: permData.description,
      },
    });
    permMap.set(perm.code, perm.id);
  }
  console.log(`[Seed] Successfully upserted ${permMap.size} permissions.`);

  console.log('[Seed] Mapping Role Permissions based on RBAC Matrix...');
  let totalMappings = 0;

  for (const [roleCode, permCodes] of Object.entries(ROLE_DEFAULT_PERMISSIONS)) {
    const roleId = roleMap.get(roleCode);
    if (!roleId) continue;

    for (const permCode of permCodes) {
      const permissionId = permMap.get(permCode);
      if (!permissionId) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
      totalMappings++;
    }
  }
  console.log(`[Seed] Mapped ${totalMappings} role-permission relationships.`);

  return { roleMap, permMap };
}
