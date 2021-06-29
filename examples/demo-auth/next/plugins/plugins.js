module.exports = {
  plugins: [
    'emails',
		'multilanguage',
		'onboarding',
		'users-groups-roles',
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
    name: 'users-groups-roles',
    version: null,
    load: require('@users-groups-roles/index.js')
  },
	{
    name: 'provider-emails-amazon-ses',
    version: null,
    load: require('@provider-emails-amazon-ses/index.js')
  }]
};