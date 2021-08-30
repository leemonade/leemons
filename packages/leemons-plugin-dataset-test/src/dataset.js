const constants = require('../config/constants');

const teacherProfileId = 'ee387729-6e77-4677-a93f-d45d396c8c1b';
const studentProfileId = '571dfe59-d1c7-40ae-9e29-713901036d13';
const locationName = 'user-dataset';

const userAgent = {
  id: '843887b7-f6a9-45c9-9cdb-d5d30281d918',
  profile: teacherProfileId,
  reloadPermissions: 1,
};

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
      profilePermissions: {
        [teacherProfileId]: ['view'],
        [studentProfileId]: ['view', 'edit'],
      },
    },
    lastName: {
      type: 'string',
      title: 'Last name',
      profilePermissions: {
        [teacherProfileId]: ['view'],
        [studentProfileId]: ['view', 'edit'],
      },
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10,
      profilePermissions: {
        [teacherProfileId]: ['view'],
        [studentProfileId]: ['view', 'edit'],
      },
    },
  },
};

const updatedJsonSchema = {
  title: 'A registration form',
  description: 'A simple form example.',
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name',
      default: 'Chuck',
      profilePermissions: {
        [teacherProfileId]: ['view', 'edit'],
        [studentProfileId]: ['view'],
      },
    },
    lastName: {
      type: 'string',
      title: 'Last name',
      profilePermissions: {
        [teacherProfileId]: ['view', 'edit'],
        [studentProfileId]: ['view', 'edit'],
      },
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10,
      profilePermissions: {
        [teacherProfileId]: ['view'],
        [studentProfileId]: ['view', 'edit'],
      },
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
    // console.log('---- Start addLocation ----');
    const data = await leemons.getPlugin('dataset').services.dataset.addLocation({
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
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End addLocation ----');
}

async function getLocation() {
  try {
    // console.log('---- Start getLocation ----');
    const data = await leemons
      .getPlugin('dataset')
      .services.dataset.getLocation(locationName, constants.pluginName, { locale: 'en' });
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End getLocation ----');
}

async function updateLocation() {
  try {
    // console.log('---- Start updateLocation ----');
    const data = await leemons.getPlugin('dataset').services.dataset.updateLocation({
      name: {
        en: 'Usersssss',
      },
      locationName,
      pluginName: constants.pluginName,
    });
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End updateLocation ----');
}

async function deleteLocation() {
  try {
    // console.log('---- Start deleteLocation ----');
    const data = await leemons
      .getPlugin('dataset')
      .services.dataset.deleteLocation(locationName, constants.pluginName);
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End deleteLocation ----');
}

async function addSchema(schema, ui) {
  try {
    // console.log('---- Start addSchema ----');
    const data = await leemons.getPlugin('dataset').services.dataset.addSchema({
      jsonSchema: schema,
      jsonUI: ui,
      locationName,
      pluginName: constants.pluginName,
    });
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End addSchema ----');
}

async function updateSchema(schema, ui) {
  try {
    // console.log('---- Start addSchema ----');
    const data = await leemons.getPlugin('dataset').services.dataset.updateSchema({
      jsonSchema: schema,
      jsonUI: ui,
      locationName,
      pluginName: constants.pluginName,
    });
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End addSchema ----');
}

async function getSchema() {
  try {
    // console.log('---- Start getSchema ----');
    const data = await leemons
      .getPlugin('dataset')
      .services.dataset.getSchema(locationName, constants.pluginName);
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End getSchema ----');
}

async function addSchemaLocale(schema, ui) {
  try {
    // console.log('---- Start addSchemaLocale ----');
    const data = await leemons.getPlugin('dataset').services.dataset.addSchemaLocale({
      schemaData: schema,
      uiData: ui,
      locationName,
      locale: 'en',
      pluginName: constants.pluginName,
    });
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End addSchemaLocale ----');
}

async function getSchemaLocale() {
  try {
    // console.log('---- Start getSchemaLocale ----');
    const data = await leemons
      .getPlugin('dataset')
      .services.dataset.getSchemaLocale(locationName, constants.pluginName, 'en');
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End getSchemaLocale ----');
}

async function getSchemaWithLocale() {
  try {
    // console.log('---- Start getSchemaWithLocale ----');
    const data = await leemons
      .getPlugin('dataset')
      .services.dataset.getSchemaWithLocale(locationName, constants.pluginName, 'en');
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End getSchemaWithLocale ----');
}

async function addValues() {
  try {
    // console.log('---- Start addValues ----');
    const data = await leemons
      .getPlugin('dataset')
      .services.dataset.addValues(locationName, constants.pluginName, schemaValues, userAgent);
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End addValues ----');
}

async function getValues() {
  try {
    // console.log('---- Start getValues ----');
    const data = await leemons
      .getPlugin('dataset')
      .services.dataset.getValues(locationName, constants.pluginName, userAgent, {
        keys: ['firstName', 'lastName', 'telephone'],
      });
    // console.log(data);
  } catch (e) {
    console.error(e);
  }
  // console.log('---- End getValues ----');
}

async function deleteValues() {
  try {
    // console.log('---- Start deleteValues ----');
    const data = await leemons
      .getPlugin('dataset')
      .services.dataset.deleteValues(locationName, constants.pluginName);
    // console.log(data);
  } catch (e) {
    // console.error(e);
  }
  // console.log('---- End deleteValues ----');
}

async function init() {
  const schema = leemons.getPlugin('dataset').services.dataset.transformJsonSchema(jsonSchema);
  const ui = leemons.getPlugin('dataset').services.dataset.transformUiSchema(jsonUI);

  console.log(schema, ui);

  /*
  const uPschema = leemons
    .getPlugin('dataset')
    .services.dataset.transformJsonSchema(updatedJsonSchema);
  const uPui = leemons.getPlugin('dataset').services.dataset.transformUiSchema(jsonUI);

  await addLocation();
  await getLocation();
  await addSchema(schema.json, ui.json);
  await addSchemaLocale(schema.values, ui.values);
  await updateSchema(uPschema.json, uPui.json);
  await getSchemaLocale();
  await getSchema();
  await getSchemaWithLocale();

  await deleteValues();
  await addValues();
  await getValues();

  await deleteLocation();

   */
}

module.exports = init;
