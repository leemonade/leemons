module.exports = {
  plugins: [
    'onboarding',
		'layout',
		'emails',
		'common',
		'assets',
		'dataset',
		'multilanguage',
		'users',
		'mvp-template',
		'menu-builder',
		'provider-emails-amazon-ses'
  ],
  frontPlugins: [{
    name: 'onboarding',
    version: '0.0.1',
    load: require('@onboarding/index.js')
  },
	{
    name: 'layout',
    version: '0.0.1',
    load: require('@layout/index.js')
  },
	{
    name: 'emails',
    version: '0.0.1',
    load: require('@emails/index.js')
  },
	{
    name: 'multilanguage',
    version: '0.0.1',
    load: require('@multilanguage/index.js')
  },
	{
    name: 'users',
    version: '0.0.1',
    load: require('@users/index.js')
  },
	{
    name: 'provider-emails-amazon-ses',
    version: '0.0.1',
    load: require('@provider-emails-amazon-ses/index.js')
  }]
};