const { keys, trim, isEmpty, isNil } = require('lodash');
const itemsImport = require('./helpers/simpleListImport');

async function importLibrary(filePath, { users }) {
  const items = await itemsImport(filePath, 'library', 30, true, true);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const asset = items[key];

      asset.canAccess = asset.canAccess
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((userItem) => {
          const [user, role] = userItem.split('|');
          return {
            user: users[user],
            userAgent: users[user]?.userAgents[0].id,
            role,
          };
        });

      asset.creator = asset.canAccess.find((item) => item.role === 'owner').user;

      asset.tags = (asset.tags || '')
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));

      items[key] = asset;
    });

  return items;
}

module.exports = importLibrary;
