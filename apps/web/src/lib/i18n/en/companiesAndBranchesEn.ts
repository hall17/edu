export const companiesAndBranches = {
  title: 'Companies & Branches',
  description: 'Manage companies and branches across the system.',
  tabs: {
    companies: 'Companies',
    branches: 'Branches',
  },
  buttons: {
    addCompany: 'Add Company',
    addBranch: 'Add Branch',
  },
  companies: {
    title: 'Companies',
    description: 'Manage all companies in the system.',
    table: {
      filterPlaceholder: 'Filter companies...',
      noResults: 'No companies found.',
      columns: {
        name: 'Name',
        slug: 'Slug',
        branches: 'Branches',
        classrooms: 'Classrooms',
        students: 'Students',
        status: 'Status',
      },
      filters: {
        status: 'Status',
        reset: 'Reset',
      },
      actions: {
        openMenu: 'Open menu',
        addBranch: 'Add Branch',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
      },
    },
    suspendDialog: {
      suspendTitle: 'Suspend Company',
      activateTitle: 'Activate Company',
      suspendDescription:
        'Suspend this company to temporarily restrict access.',
      activateDescription:
        'Activate this company to restore access to the system.',
      confirmMessage:
        'will be suspended and will not be accessible by users. Are you sure you want to proceed?',
      suspendedMessage:
        'will be reactivated and will regain access to the system. Are you sure you want to proceed?',
      warningTitle: 'Warning!',
      warningDescription:
        'This action will change the company status. You can revert this action later.',
      warningDescriptionWithBranches:
        'This action will change the company status and all {{count}} branch(es) associated with this company will also be suspended. You can revert this action later.',
      statusUpdateReasonLabel: 'Reason for suspension',
      statusUpdateReasonPlaceholder:
        'Please provide a reason for suspending this company...',
      statusUpdateReasonRequired: 'Suspended reason is required',
      suspendButtonText: 'Suspend',
      activateButtonText: 'Activate',
      cancel: 'Cancel',
      successMessage: 'Company status updated successfully',
      errorMessage: 'Failed to update company status. Please try again.',
    },
    viewDialog: {
      title: 'View Company',
      description: 'View company details and information.',
    },
    actionDialog: {
      addTitle: 'Add Company',
      addDescription: 'Create a new company.',
      editTitle: 'Edit Company',
      editDescription: 'Update company information.',
      description: 'Manage company information.',
      createSuccess: 'Company created successfully.',
      createError: 'Failed to create company.',
      updateSuccess: 'Company updated successfully.',
      updateError: 'Failed to update company.',
      form: {
        name: 'Name',
        slug: 'Slug',
        websiteUrl: 'Website URL',
        maximumBranches: 'Maximum Branches',
        location: 'Location',
        contact: 'Contact',
        company: 'Company',
        status: 'Status',
        selectCompany: 'Select company',
        selectStatus: 'Select status',
      },
    },
    deleteDialog: {
      title: 'Delete Company',
      description: 'Delete this company from the system.',
      confirmMessage:
        'Company "{{name}}" will be permanently removed from the system. Are you sure you want to proceed?',
      warningWithBranches:
        'All {{count}} branch(es) associated with this company will also be deleted.',
      warning: 'This action cannot be undone.',
      deleteButtonText: 'Delete Company',
      successMessage: 'Company deleted successfully.',
      errorMessage: 'Failed to delete company.',
    },
  },
  branches: {
    title: 'Branches',
    description: 'Manage all branches in the system.',
    table: {
      filterPlaceholder: 'Filter branches...',
      noResults: 'No branches found.',
      columns: {
        name: 'Name',
        slug: 'Slug',
        location: 'Location',
        contact: 'Contact',
        company: 'Company',
        status: 'Status',
        modules: 'Modules',
        students: 'Students',
        parents: 'Parents',
        roles: 'Roles',
        users: 'Users',
      },
      filters: {
        status: 'Status',
        reset: 'Reset',
      },
      actions: {
        openMenu: 'Open menu',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
      },
    },
    actionDialog: {
      addTitle: 'Add Branch',
      addDescription: 'Create a new branch.',
      editTitle: 'Edit Branch',
      editDescription: 'Update branch information.',
      createSuccess: 'Branch created successfully.',
      createError: 'Failed to create branch.',
      updateSuccess: 'Branch updated successfully.',
      updateError: 'Failed to update branch.',
      form: {
        name: 'Name',
        slug: 'Slug',
        location: 'Location',
        contact: 'Contact',
        canBeDeleted: 'Can Be Deleted',
        maximumStudents: 'Maximum Students',
        company: 'Company',
        status: 'Status',
        selectCompany: 'Select company',
        selectStatus: 'Select status',
        selectCanBeDeleted: 'Select option',
      },
    },
    deleteDialog: {
      title: 'Delete Branch',
      description: 'Delete this branch from the system.',
      confirmMessage:
        'Branch "{{name}}" will be permanently removed from the system. Are you sure you want to proceed?',
      warning: 'This action cannot be undone.',
      deleteButtonText: 'Delete Branch',
      successMessage: 'Branch deleted successfully.',
      errorMessage: 'Failed to delete branch.',
    },
    suspendDialog: {
      suspendTitle: 'Suspend Branch',
      activateTitle: 'Activate Branch',
      suspendDescription: 'Suspend this branch to temporarily restrict access.',
      activateDescription:
        'Activate this branch to restore access to the system.',
      warningTitle: 'Warning!',
      warningDescription:
        'This action will change the branch status. You can revert this action later.',
      statusUpdateReasonLabel: 'Reason for suspension',
      statusUpdateReasonPlaceholder:
        'Please provide a reason for suspending this branch...',
      statusUpdateReasonRequired: 'Suspended reason is required',
      suspendButtonText: 'Suspend',
      activateButtonText: 'Activate',
      cancel: 'Cancel',
      confirmMessage:
        'will be suspended and will not be accessible by users. Are you sure you want to proceed?',
      suspendedMessage:
        'will be reactivated and will regain access to the system. Are you sure you want to proceed?',
      successMessage: 'Branch status updated successfully',
      errorMessage: 'Failed to update branch status. Please try again.',
    },
    viewDialog: {
      title: 'View Branch',
      description: 'View branch details and information.',
    },
  },
};
