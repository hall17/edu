export const roles = {
  title: 'Roles Management',
  description: 'Manage user roles and permissions',
  createTitle: 'Create Role',
  createDescription: 'Create a new role with specific permissions',
  editTitle: 'Edit Role',
  editDescription: 'Update role information and permissions',
  viewTitle: 'View Role',
  viewDescription: 'View role details and information',
  noRoles: 'No roles found',
  buttons: {
    addRole: 'Add Role',
    create: 'Create Role',
    update: 'Update Role',
    managePermissions: 'Manage Permissions',
  },
  tabs: {
    general: 'General',
    permissions: 'Permissions',
  },
  permissions: {
    name: 'Permission',
    permission: 'Permission',
    access: 'Access',
    fullAccess: 'Full Access',
    noModulesAvailable: 'No modules available',
    title: 'Permissions Management',
    description:
      'Manage permissions for this role by toggling switches for each module',
    types: {
      read: 'View and access data',
      write: 'Create and modify data',
      delete: 'Remove data permanently',
    },
    messages: {
      assignSuccess: 'Permission assigned successfully',
      assignError: 'Failed to assign permission',
      removeSuccess: 'Permission removed successfully',
      removeError: 'Failed to remove permission',
    },
  },
  table: {
    filterPlaceholder: 'Filter roles...',
    statusChangeWarning:
      "Changing the status will affect the role's availability and related activities.",
    columns: {
      isSystem: 'Type',
    },
    filters: {
      status: 'Status',
      type: 'Type',
    },
    actions: {
      view: 'View',
      edit: 'Edit',
      suspend: 'Suspend',
      activate: 'Activate',
      delete: 'Delete',
      cannotDeleteSystemRole: 'Cannot delete system roles',
      cannotSuspendSystemRole: 'Cannot suspend system roles',
    },
  },
  updateStatusSuccess: 'Role status updated successfully',
  updateStatusError: 'Failed to update role status',
  form: {
    active: 'Active',
    code: 'Code',
    name: 'Name',
    description: 'Description',
    status: 'Status',
    visible: 'Visible',
    systemRoleTooltip:
      'System roles cannot be modified or deactivated as they are essential for system functionality.',
    permissionsCreateNote:
      'You can configure permissions after creating the role. Save the role first, then edit it to set permissions.',
    placeholders: {
      code: 'Enter role code',
      name: 'Enter role name',
      description: 'Enter role description',
      status: 'Select status',
    },
  },
  status: {
    active: 'Active',
    inactive: 'Inactive',
  },
  messages: {
    createSuccess: 'Role created successfully',
    createError: 'Failed to create role',
    updateSuccess: 'Role updated successfully',
    updateError: 'Failed to update role',
    deleteSuccess: 'Role deleted successfully',
    deleteError: 'Failed to delete role',
  },
  deleteDialog: {
    title: 'Delete Role',
    description:
      'Are you sure you want to delete this role? This action cannot be undone.',
    warningTitle: 'Warning',
    warningDescription:
      'Deleting role "{{name}}" will remove it from all users. Make sure no users are assigned to this role before deleting.',
  },
  viewDialog: {
    basicInfo: 'Basic Information',
    roleType: 'Role Type',
    systemRole: 'System Role',
    customRole: 'Custom Role',
  },
  suspendDialog: {
    suspendTitle: 'Suspend Role',
    activateTitle: 'Activate Role',
    suspendDescription: 'Suspend this role to temporarily restrict its usage.',
    activateDescription: 'Activate this role to restore its functionality.',
    confirmMessage:
      'will be suspended and will not be available for assignment. Are you sure you want to proceed?',
    suspendedMessage:
      'will be reactivated and will be available for assignment. Are you sure you want to proceed?',
    warningTitle: 'Warning!',
    warningDescription:
      'This action will change the role status. You can revert this action later.',
    statusUpdateReasonLabel: 'Reason for suspension',
    statusUpdateReasonPlaceholder:
      'Please provide a reason for suspending this role...',
    statusUpdateReasonRequired: 'Suspended reason is required',
    suspendButtonText: 'Suspend',
    activateButtonText: 'Activate',
    cancel: 'Cancel',
    successMessage: 'Role status updated successfully',
    errorMessage: 'Failed to update role status. Please try again.',
  },
  statusDialog: {
    title: 'Change Role Status',
    description: 'Change the status for {{name}}.',
    currentStatus: 'Current Status',
    newStatus: 'New Status',
    updateButton: 'Update Status',
    success: 'Role status updated successfully',
  },
};
