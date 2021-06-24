setTimeout(() => {
  const { services } = leemons.plugins.multilanguage;

  const contents = services.contents.getProvider();
  const common = services.common.getProvider();

  // common.add('plugins.test.key', 'es', 'Clave').then((r) => {
  //   console.log("\nOK", r);
  // }).catch(e => {
  //   console.log("\nKO", e);
  // });

  // common
  //   .addMany({
  //     es: {
  //       'plugins.test.name': 'nombre',
  //       'plugins.test.surname': 'apellido'
  //     },
  //     en: {
  //       'plugins.test.name': 'name',
  //       'plugins.test.surname': 'surname'
  //     },
  //     it: {
  //       'plugins.test.name': 'nome',
  //       'plugins.test.surname': 'cognome'
  //     }
  //   })
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // common
  //   .addManyByKey('plugins.test.config', {
  //     es: 'configuración',
  //     en: 'configuration',
  //     it: 'configurazione',
  //   })
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents
  //   .countKeyStartsWith('plugins.test', 'es')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // common
  //   .countLocalesWithKey('plugins.test.config')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // common
  //   .deleteMany([['plugins.test', 'es'], ['plugins.test.config', 'en']])
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // common
  //   .deleteAll({key: 'plugins.test.pepe'})
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // common
  //   .deleteAll({locale: 'es'})
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents.has('plugins.tes.config', 'es')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents.hasMany([['plugins.test.config', 'es'], ['plugins.test.name', 'es']])
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents.get('plugins.tes.config', 'es')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents
  //   .getManyWithLocale(['plugins.test.config', 'plugins.test.name'], 'es')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents
  //   .getWithKey('plugins.tes.config')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents
  //   .getWithLocale('es')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents
  //   .getKeyValueWithLocale('es')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents
  //   .getKeyStartsWith('plugins.test', 'es')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // contents
  //   .getKeyValueStartsWith('plugins.test', 'es')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // common
  //   .setValue('plugins.test', 'es', 'Test')
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // common
  //   .setKey('plugins.test', {
  //     es: 'Test',
  //     en: 'Test',
  //     it: 'Test'
  //   })
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });

  // common
  //   .setMany({
  //     es: {
  //       'plugins.test.name': 'Nombre',
  //       'plugins.test.surname': 'Apellido',
  //       'plugins.test.email': 'Correo Electrónico'
  //     },
  //     en: {
  //       'plugins.test.name': 'Name',
  //       'plugins.test.surname': 'Surname',
  //       'plugins.test.email': 'Email'
  //     },
  //     it: {
  //       'plugins.test.name': 'Nome',
  //       'plugins.test.surname': 'Cognome',
  //       'plugins.test.email': 'Posta Elettronica'
  //     }
  //   })
  //   .then((r) => {
  //     console.log('\nOK', r);
  //   })
  //   .catch((e) => {
  //     console.log('\nKO', e);
  //   });
}, 1000);
