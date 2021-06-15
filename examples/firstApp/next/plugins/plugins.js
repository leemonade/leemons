module.exports = {
  plugins: [
    'user-admin',
		'users-groups-roles'
  ],
  frontPlugins: [{
    name: 'user-admin',
    version: null,
    load: require('@user-admin/index.js')
  },
	{
    name: 'users-groups-roles',
    version: null,
    load: require('@users-groups-roles/index.js')
  }]
};