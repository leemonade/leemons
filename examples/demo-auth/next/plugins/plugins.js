module.exports = {
  plugins: [
    'users-groups-roles'
  ],
  frontPlugins: [{
    name: 'users-groups-roles',
    version: null,
    load: require('@users-groups-roles/index.js')
  }]
};