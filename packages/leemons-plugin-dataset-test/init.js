const constants = require('./config/constants');

const locationName = 'user-dataset';

const schemaValues = {
  firstName: 'Chuck',
  lastName: 'Norris',
  telephone: '1234567890',
};

const jsonSchema = {
  title: 'A registration form',
  description: 'A simple form example.',
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name',
      default: 'Chuck',
    },
    lastName: {
      type: 'string',
      title: 'Last name',
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10,
    },
  },
};

const jsonUI = {
  firstName: {
    'ui:autofocus': true,
    'ui:emptyValue': '',
    'ui:autocomplete': 'family-name',
  },
  lastName: {
    'ui:emptyValue': '',
    'ui:autocomplete': 'given-name',
  },
  age: {
    'ui:widget': 'updown',
    'ui:title': 'Age of person',
    'ui:description': '(earthian year)',
  },
  bio: {
    'ui:widget': 'textarea',
  },
  password: {
    'ui:widget': 'password',
    'ui:help': 'Hint: Make it strong!',
  },
  date: {
    'ui:widget': 'alt-datetime',
  },
  telephone: {
    'ui:options': {
      inputType: 'tel',
    },
  },
};

async function addLocation() {
  try {
    console.log('---- Start addLocation ----');
    const data = await leemons.plugins.dataset.services.dataset.addLocation({
      name: {
        'es-ES': 'Usuarios',
        en: 'Users',
      },
      description: {
        'es-ES': 'Añade datos adicionales a los usuarios',
        en: 'Adds additional data to users',
      },
      locationName,
      pluginName: constants.pluginName,
    });
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End addLocation ----');
}

async function getLocation() {
  try {
    console.log('---- Start getLocation ----');
    const data = await leemons.plugins.dataset.services.dataset.getLocation(
      locationName,
      constants.pluginName,
      { locale: 'en' }
    );
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End getLocation ----');
}

async function updateLocation() {
  try {
    console.log('---- Start updateLocation ----');
    const data = await leemons.plugins.dataset.services.dataset.updateLocation({
      name: {
        en: 'Usersssss',
      },
      locationName,
      pluginName: constants.pluginName,
    });
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End updateLocation ----');
}

async function deleteLocation() {
  try {
    console.log('---- Start deleteLocation ----');
    const data = await leemons.plugins.dataset.services.dataset.deleteLocation(
      locationName,
      constants.pluginName
    );
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End deleteLocation ----');
}

async function addSchema(schema, ui) {
  try {
    console.log('---- Start addSchema ----');
    const data = await leemons.plugins.dataset.services.dataset.addSchema({
      jsonSchema: schema,
      jsonUI: ui,
      locationName,
      pluginName: constants.pluginName,
    });
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End addSchema ----');
}

async function getSchema() {
  try {
    console.log('---- Start getSchema ----');
    const data = await leemons.plugins.dataset.services.dataset.getSchema(
      locationName,
      constants.pluginName
    );
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End getSchema ----');
}

async function addSchemaLocale(schema, ui) {
  try {
    console.log('---- Start addSchemaLocale ----');
    const data = await leemons.plugins.dataset.services.dataset.addSchemaLocale({
      schemaData: schema,
      uiData: ui,
      locationName,
      locale: 'en',
      pluginName: constants.pluginName,
    });
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End addSchemaLocale ----');
}

async function getSchemaLocale() {
  try {
    console.log('---- Start getSchemaLocale ----');
    const data = await leemons.plugins.dataset.services.dataset.getSchemaLocale(
      locationName,
      constants.pluginName,
      'en'
    );
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End getSchemaLocale ----');
}

async function getSchemaWithLocale() {
  try {
    console.log('---- Start getSchemaWithLocale ----');
    const data = await leemons.plugins.dataset.services.dataset.getSchemaWithLocale(
      locationName,
      constants.pluginName,
      'en'
    );
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End getSchemaWithLocale ----');
}

async function addValues() {
  try {
    console.log('---- Start addValues ----');
    const data = await leemons.plugins.dataset.services.dataset.addValues(
      locationName,
      constants.pluginName,
      schemaValues
    );
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End addValues ----');
}

async function getValues() {
  try {
    console.log('---- Start getValues ----');
    const data = await leemons.plugins.dataset.services.dataset.getValues(
      locationName,
      constants.pluginName,
      { keys: ['firstName', 'lastName'] }
    );
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End getValues ----');
}

async function init() {
  const schema = leemons.plugins.dataset.services.dataset.transformJsonSchema(jsonSchema);
  const ui = leemons.plugins.dataset.services.dataset.transformUiSchema(jsonUI);

  await addLocation();
  await getLocation();
  await addSchema(schema.json, ui.json);
  await addSchemaLocale(schema.values, ui.values);
  await getSchemaLocale();
  await getSchema();
  await getSchemaWithLocale();

  await addValues();
  await getValues();

  await deleteLocation();
}

module.exports = init;
