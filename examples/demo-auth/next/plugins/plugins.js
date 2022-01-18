module.exports = {
  plugins: [
    'assets',
		'common',
		'emails',
		'layout',
		'onboarding',
		'socket-io',
		'users',
		'multilanguage',
		'dataset',
		'academic-portfolio',
		'calendar',
		'classroom',
		'curriculum',
		'dataset-test',
		'families',
		'families-emergency-numbers',
		'grades',
		'media-library',
		'menu-builder',
		'mvp-template',
		'package-manager',
		'provider-emails-amazon-ses',
		'provider-media-library-aws-s3'
  ],
  frontPlugins: [{
    name: 'layout',
    version: '0.0.1',
    load: require('@layout/index.js')
  },
	{
    name: 'multilanguage',
    version: '0.0.1',
    load: require('@multilanguage/index.js')
  },
	{
    name: 'curriculum',
    version: '0.0.1',
    load: require('@curriculum/index.js')
  },
	{
    name: 'families',
    version: '0.0.1',
    load: require('@families/index.js')
  },
	{
    name: 'families-emergency-numbers',
    version: '0.0.1',
    load: require('@families-emergency-numbers/index.js')
  },
	{
    name: 'package-manager',
    version: '0.0.1',
    load: require('@package-manager/index.js')
  }]
};