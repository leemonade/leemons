module.exports = {
  user_data_page: {
    page_title: 'User data',
    page_description:
      'In this section you can configure the dataset fields for your users. The identification data are mandatory for the operation of the platform and mandatory for all users of any profile. The common fields are those shared by all users, they can be mandatory or optional (they are useful to save time when defining fields common to all users of the platform such as a name or surname). <br/> Last but not least, profiles have their own data sets that you can consult in the profiles section.',
    tabs: {
      login_data: 'Login data',
      basic_data: 'Basic data',
    },
    login: {
      description:
        'Mandatory fields in order to create user accounts (you cannot edit o delete it)',
    },
    basic: {
      description: 'Configuration of general fields for your users',
      table: {
        name: 'Name',
        description: 'Description',
        type: 'Type',
        actions: 'Actions',
      },
      edit: 'Edit',
      delete: 'Delete',
    },
    dataset: {
      description: 'Configuration of general fields for your users',
      filter_by_center: 'Filter by center',
      add_field: 'Add field',
      no_data_in_table: 'No data available yet',
      deleted_done: 'Dataset item deleted',
    },
    remove_modal: {
      title: 'Do you want to delete the item?',
      message: 'This action cannot be undone',
      cancel: 'No',
      action: 'Delete',
    },
  },
  welcome_page: {
    page_title: 'Welcome to Users Admin',
    page_description:
      'Here we recommend you the first steps to config properly your Users Administration setup.',
  },
  hero_bg: {
    text:
      '“I don’t know the meaning of half those long words, and, what’s more, I don’t believe you do either!”',
    author: 'Alice in Wonderland <br/> Lewis Carrol',
  },
  list_profiles: {
    page_title: 'Profiles',
    page_description:
      'Use the user profiles to manage permissions for applications. Each time you install a new leemon we will ask you to define permissions for each existing profile.',
    name: 'Name',
    overview: 'Overview',
    actions: 'Actions',
    view: 'View',
  },
  detail_profile: {
    profile_name: 'Profile name',
    description: 'Profile description',
    leemon: 'Leemon',
    permissions_all: 'All',
    permissions: 'Permissions',
    select_permissions: 'Select a Leemon to assign permissions',
    dataset: 'Dataset',
    save_done: 'Profile created',
    update_done: 'Profile updated',
    translations: 'Translations',
    options_modal: {
      title: 'Translation',
      description: 'Add here the translations of the profile info to your system languages',
      accept: 'Accept',
      cancel: 'Cancel',
      profile_name: 'Profile name',
      profile_description: 'Profile description',
    },
    dataset_tab: {
      description: 'Configure the extra fields for this profile',
      filter_by_center: 'Filter by center',
      add_field: 'Add field',
      no_data_in_table: 'No data available yet',
      deleted_done: 'Dataset item deleted',
      table: {
        name: 'Name',
        description: 'Description',
        type: 'Type',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
      },
    },
    remove_modal: {
      title: 'Do you want to delete the item?',
      message: 'This action cannot be undone',
      cancel: 'No',
      action: 'Delete',
    },
  },
  login: {
    title: 'Login to your account',
    email: 'Email',
    password: 'Password',
    remember_password: 'I cant remember my password',
    log_in: 'Log in',
    not_registered: 'I am not registered',
    form_error: 'Email or password does not match',
  },
  selectProfile: {
    title: 'Hi {name}',
    number_of_profiles:
      'You have {profiles} profiles on leemons, please select the one with you want to access',
    use_always_profile: 'Always use this profile for quick access',
    change_easy:
      'You can easily change your profile by clicking on your avatar in the sidebar of the application',
    log_in: 'Log in',
  },
};
