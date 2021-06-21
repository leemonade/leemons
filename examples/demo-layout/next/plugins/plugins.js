module.exports = {
  plugins: [
    'classroom',
		'users',
		'layout',
		'users-groups-roles'
  ],
  frontPlugins: [{
    name: 'classroom',
    version: null,
    load: require('@classroom/index.js')
  },
	{
    name: 'users',
    version: null,
    load: require('@users/index.js')
  },
	{
    name: 'layout',
    version: null,
    load: require('@layout/index.js')
  },
	{
    name: 'users-groups-roles',
    version: null,
    load: require('@users-groups-roles/index.js')
  }]
};