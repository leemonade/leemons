module.exports = {
  plugins: [
    'dataset',
		'dataset-test',
		'emails',
		'menu-builder',
		'multilanguage',
		'mvp-template',
		'onboarding',
		'users',
		'provider-emails-amazon-ses'
  ],
  frontPlugins: [{
    name: 'emails',
    version: null,
    load: require('@emails/index.js')
  },
	{
    name: 'multilanguage',
    version: null,
    load: require('@multilanguage/index.js')
  },
	{
    name: 'onboarding',
    version: null,
    load: require('@onboarding/index.js')
  },
	{
    name: 'users',
    version: null,
    load: require('@users/index.js')
  },
	{
    name: 'provider-emails-amazon-ses',
    version: null,
    load: require('@provider-emails-amazon-ses/index.js')
  }]
};