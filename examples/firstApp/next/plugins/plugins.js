module.exports = {
  plugins: [
<<<<<<< HEAD
    'user-admin'
=======
    'user-admin',
		'users-groups-roles'
>>>>>>> dev
  ],
  frontPlugins: [{
    name: 'user-admin',
    version: null,
    load: require('@user-admin/index.js')
<<<<<<< HEAD
=======
  },
	{
    name: 'users-groups-roles',
    version: null,
    load: require('@users-groups-roles/index.js')
>>>>>>> dev
  }]
};