module.exports = {
  plugins: [
    'layouts',
		'users'
  ],
  frontPlugins: [{
    name: 'layouts',
    version: null,
    load: require('@layouts/index.js')
  },
	{
    name: 'users',
    version: null,
    load: require('@users/index.js')
  }]
};