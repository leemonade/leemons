module.exports = {
  plugins: [
    'layouts',
		'users',
		'multilanguage'
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
  },
	{
    name: 'multilanguage',
    version: null,
    load: require('@multilanguage/index.js')
  }]
};