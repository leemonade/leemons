module.exports = {
  plugins: [
    'user-admin',
		'users'
  ],
  frontPlugins: [{
    name: 'user-admin',
    version: null,
    load: require('@user-admin/index.js')
  },
	{
    name: 'users',
    version: null,
    load: require('@users/index.js')
  }]
};