module.exports = {
  plugins: [
    'user-admin',
		'emails'
  ],
  frontPlugins: [{
    name: 'user-admin',
    version: null,
    load: require('@user-admin/index.js')
  }]
};