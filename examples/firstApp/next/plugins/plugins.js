module.exports = {
  plugins: [
    'user-admin'
  ],
  frontPlugins: [{
    name: 'user-admin',
    version: null,
    load: require('@user-admin/index.js')
  }]
};