export const users = {
  title: 'Users & Roles',
  description: 'Manage your users and roles here.',
  tabs: {
    users: 'Users',
    roles: 'Roles',
  },
  buttons: {
    inviteUser: 'Invite User',
    addUser: 'Add User',
    manageRoles: 'Manage Roles',
  },
  table: {
    filterPlaceholder: 'Filter users...',
    noResults: 'No results.',
    statusChangeWarning:
      "Changing the status will affect the user's access to the system and related activities.",
    columns: {
      name: 'Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      status: 'Status',
      role: 'Role',
    },
    filters: {
      status: 'Status',
      role: 'Role',
      reset: 'Reset',
    },
    actions: {
      openMenu: 'Open menu',
      view: 'View',
      edit: 'Edit',
      suspend: 'Suspend',
      activate: 'Activate',
      changePassword: 'Change Password',
      delete: 'Delete',
    },
  },
  updateStatusSuccess: 'User status updated successfully',
  updateStatusError: 'Failed to update user status',
  inviteDialog: {
    description:
      'Invite new user to join your team by sending them an email invitation. Assign a role to define their access level.',
    form: {
      roles: 'Roles',
    },
    placeholders: {
      roles: 'Select roles',
    },
  },
  statusDialog: {
    title: 'Change User Status',
    description: 'Change the status for {{name}}.',
    currentStatus: 'Current Status',
    newStatus: 'New Status',
    updateButton: 'Update Status',
    success: 'User status updated successfully',
  },
};
