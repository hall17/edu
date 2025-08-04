import { TokenUser } from '@api/types';
import { MODULE_CODES, PERMISSIONS, SYSTEM_ROLES } from '@edusama/common';

export function hasPermission(
  requestedBy: TokenUser,
  module: (typeof MODULE_CODES)[keyof typeof MODULE_CODES],
  permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
) {
  if (
    requestedBy.roles.some((role) => role.code === SYSTEM_ROLES.superAdmin) ||
    requestedBy.roles.some((role) => role.code === SYSTEM_ROLES.admin)
  ) {
    return true;
  }

  // if the permission is delete, check if the user is a module manager for the module
  if (permission === PERMISSIONS.delete) {
    const isUserModuleManager = requestedBy.roles.some(
      (role) =>
        role.code === SYSTEM_ROLES.moduleManager &&
        role.module?.code === module &&
        role.branchId === requestedBy.activeBranchId
    );

    if (isUserModuleManager) {
      return true;
    }

    return false;
  }

  return requestedBy.permissions?.includes(
    `${requestedBy.activeBranchId}:${module}:${permission}`
  );
}
