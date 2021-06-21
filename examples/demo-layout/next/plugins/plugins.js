module.exports = {
  plugins: [
    'classroom',
		'users',
		'layout'
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
  }]
};