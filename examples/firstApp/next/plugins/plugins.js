module.exports = {
  plugins: [
    'newPlugin',
		'plugin2',
		'user-admin'
  ],
  frontPlugins: [{
    name: 'user-admin',
    version: null,
    load: require('@user-admin/index.js')
  }]
};