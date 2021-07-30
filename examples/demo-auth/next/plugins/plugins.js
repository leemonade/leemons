module.exports = {
  plugins: [
    'onboarding',
		'multilanguage',
		'layout',
		'emails',
		'dataset-test',
		'assets',
		'provider-emails-amazon-ses'
  ],
  frontPlugins: [{
    name: 'onboarding',
    version: 'null',
    load: require('@onboarding/index.js')
  },
	{
    name: 'multilanguage',
    version: 'null',
    load: require('@multilanguage/index.js')
  },
	{
    name: 'layout',
    version: 'null',
    load: require('@layout/index.js')
  },
	{
    name: 'emails',
    version: 'null',
    load: require('@emails/index.js')
  },
	{
    name: 'provider-emails-amazon-ses',
    version: 'null',
    load: require('@provider-emails-amazon-ses/index.js')
  }]
};