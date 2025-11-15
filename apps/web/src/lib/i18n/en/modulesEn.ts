export const modules = {
  title: 'Modules',
  description: 'Manage system modules and their status.',
  status: {
    active: 'Active',
    inactive: 'Inactive',
    deleted: 'Deleted',
  },
  card: {
    code: 'Code',
    version: 'Version',
    default: 'Default',
    enable: 'Enable',
    disable: 'Disable',
    delete: 'Delete',
    enabled: 'Enabled',
    disabled: 'Disabled',
    expiresAt: 'Expires At',
  },
  cards: {
    loadError: 'Failed to load modules.',
    noModules: 'No modules found.',
  },
  table: {
    noResults: 'No modules found',
  },
  actions: {
    enableTitle: 'Enable Module',
    enableDesc:
      'Are you sure you want to enable this module? It will be available for use in your branch.',
    disableTitle: 'Disable Module',
    disableDesc:
      'Are you sure you want to disable this module? It will no longer be available for use in your branch.',
    deleteTitle: 'Delete Module',
    deleteDesc:
      'Are you sure you want to delete this module? This action cannot be undone and the module will be permanently removed from your branch.',
    enableSuccess: 'Module enabled successfully',
    disableSuccess: 'Module disabled successfully',
    deleteSuccess: 'Module deleted successfully',
    enableError: 'Failed to enable module',
    disableError: 'Failed to disable module',
    deleteError: 'Failed to delete module',
  },
};
