console.log('cargando el archivo de configuración de Babel');

module.exports = {
  sourceType: 'unambiguous',
  presets: ['@babel/preset-env', '@babel/preset-react'],
  // presets: [
  //   [
  //     '@babel/preset-env',
  //     {
  //       targets: {
  //         chrome: 100,
  //         safari: 15,
  //         firefox: 91,
  //       },
  //     },
  //   ],
  //   '@babel/preset-react',
  // ],
  plugins: ['@babel/plugin-syntax-dynamic-import'],
};
