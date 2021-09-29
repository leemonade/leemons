module.exports = {
  plugins: [
    'onboarding',
		'layout',
		'emails',
		'common',
		'assets',
		'multilanguage',
		'dataset',
		'users',
		'package-manager',
		'mvp-template',
		'menu-builder',
		'families-emergency-numbers',
		'families',
		'dataset-test',
		'classroom',
		'calendar',
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
    name: 'package-manager',
    version: '0.0.1',
    load: require('@package-manager/index.js')
  },
	{
    name: 'families-emergency-numbers',
    version: '0.0.1',
    load: require('@families-emergency-numbers/index.js')
  },
	{
    name: 'families',
    version: '0.0.1',
    load: require('@families/index.js')
  },
	{
    name: 'calendar',
    version: '0.0.1',
    load: require('@calendar/index.js')
  },
	{
    name: 'provider-emails-amazon-ses',
    version: '0.0.1',
    load: require('@provider-emails-amazon-ses/index.js')
  }]
};