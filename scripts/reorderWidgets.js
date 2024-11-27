const _ = require('lodash');
const { MongoClient } = require('mongodb');

const { MONGO_URI, DEPLOYMENT_TYPE } = process.env;
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

const ZONE_ORDERS = {
  'dashboard.program.left': [
    'board-messages.dashboard',
    'academic-portfolio.user.classes.swiper',
    'dashboard.dashboard.welcome',
    'assignables.dashboard.progress',
    'assignables.dashboard.need-your-attention',
    'sessions.dashboard.sessions',
    'communities.dashboard.communities',
    'calendar.user.program.calendar',
    'calendar.user.program.kanban',
  ],
  'dashboard.class.tabs': [
    'sessions.class.tabs.detail',
    'assignables.class.tab.ongoing',
    'calendar.class.tab.kanban',
    'calendar.class.tab.calendar',
    'academic-portfolio.class.tab.detail',
    'attendance-control.class.tabs.detail',
    'learning-paths.class.tab.modules',
    'assignables.class.tab.progress',
  ],
  'assignables.class.ongoing': [
    'board-messages.class-dashboard',
    'dashboard.dashboard.class.welcome',
    'assignables.dashboard.subject.need-your-attention',
    'assignables.class.ongoing',
  ],
  'academic-portfolio.class.detail': ['board-messages.class-dashboard'],
  'leebrary.drawer.tabs': ['leebrary.drawer.tabs.library', 'leebrary.drawer.tabs.new'],
};

async function init() {
  await client.connect();
  database = client.db();
}

async function getDeployments() {
  const deployments = database.collection('package-manager_deployments');
  const query = {};

  if (typeof DEPLOYMENT_TYPE === 'string' && DEPLOYMENT_TYPE.length > 1) {
    query.type = DEPLOYMENT_TYPE;
  }

  return deployments.find(query).toArray();
}

async function getProfiles(deploymentID) {
  const profiles = database.collection('v1::users_profiles');
  return profiles.find({ deploymentID, sysName: { $in: ['student', 'teacher'] } }).toArray();
}

async function getWidgetZone(key) {
  const widgetZone = database.collection('v1::widgets_widgetzones');
  const widgetItem = database.collection('v1::widgets_widgetitems');

  const [zone, items] = await Promise.all([
    widgetZone.findOne({ key }),
    widgetItem.find({ zoneKey: key }).toArray(),
  ]);

  const widgetItems = _.orderBy(items, ['order'], ['asc']);
  return {
    ...zone,
    widgetItems: _.map(widgetItems, (item) => ({
      ...item,
      properties: JSON.parse(item.properties || null),
    })),
  };
}

async function updateOrderItemsInZone(items) {
  const collection = database.collection('v1::widgets_widgetitems');
  const count = await collection.countDocuments({
    id: { $in: _.map(items, 'id') },
  });

  if (count !== items.length) {
    throw new Error('Some items do not exist');
  }

  return Promise.all(
    _.map(items, (item) => collection.updateOne({ id: item.id }, { $set: { order: item.order } }))
  );
}

async function updateProfileItemsInZone(items) {
  const profilesCollection = database.collection('v1::users_profiles');
  const widgetItemProfilesCollection = database.collection('v1::widgets_widgetitemprofiles');

  let profiles = [];
  _.forEach(items, (item) => {
    profiles = profiles.concat(item.profiles);
  });
  // ES: Comprobamos que existan los perfiles
  if (_.isArray(profiles) && profiles.length > 0) {
    const existsProfiles = await profilesCollection.countDocuments({
      id: { $in: _.uniq(profiles) },
    });
    if (existsProfiles !== profiles.length) {
      throw new Error('Profiles does not exist');
    }
  }

  // ES:  Borramos los perfiles actuales de los items
  await Promise.all(
    _.map(items, (item) =>
      widgetItemProfilesCollection.deleteMany({
        zoneKey: item.zoneKey,
        key: item.key,
      })
    )
  );

  // ES: Insertamos los nuevos perfiles
  return Promise.all(
    _.map(items, (item) =>
      Promise.all(
        _.map(item.profiles, (profile) =>
          widgetItemProfilesCollection.insertOne({
            profile,
            zoneKey: item.zoneKey,
            key: item.key,
          })
        )
      )
    )
  );
}

async function processDeploymentLoop(deploymentID, deployments) {
  const profiles = await getProfiles(deploymentID);

  const studentProfile = profiles.find((profile) => profile.sysName === 'student');
  const teacherProfile = profiles.find((profile) => profile.sysName === 'teacher');

  const itemProfiles = [
    {
      zoneKey: 'dashboard.class.tabs',
      key: 'tasks.class.tab.students.tasks',
      profiles: [studentProfile?.id].filter(Boolean),
    },
  ];

  const zones = await Promise.all(
    _.map(Object.keys(ZONE_ORDERS), (zoneKey) => getWidgetZone(zoneKey))
  );

  // console.dir(zones, { depth: null });

  const itemsToUpdate = [];
  _.forEach(zones, (zone) => {
    const itemKeys = ZONE_ORDERS[zone.key];
    _.forEach(zone.widgetItems, (item) => {
      const index = itemKeys.indexOf(item.key);
      if (index !== -1) {
        itemsToUpdate.push({
          id: item.id,
          order: index,
        });
      }
    });
  });

  await updateOrderItemsInZone(itemsToUpdate);
  if (studentProfile?.id) {
    await updateProfileItemsInZone(itemProfiles);
  }

  if (deployments.length === 0) {
    return true;
  }

  const nextDeployment = deployments.pop();
  return processDeploymentLoop(nextDeployment.id, deployments);
}

(async () => {
  try {
    await init();

    const deployments = await getDeployments();
    const currentDeployment = deployments.pop();
    await processDeploymentLoop(currentDeployment.id, deployments);

    await client.close();
  } catch (error) {
    console.error('error', error);
    await client.close();
  }
})();
