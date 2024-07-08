const { keys, trim, isEmpty, isNil, toLower } = require('lodash');
const { v4: uuidv4 } = require('uuid');

const itemsImport = require('./helpers/simpleListImport');

function convertYesNoToBoolean(value) {
  if (toLower(value) === 'no') {
    return false;
  }
  if (toLower(value) === 'yes') {
    return true;
  }
  return value;
}

async function importModules({
  filePath,
  config: { users, tasks, tests, contentCreatorDocs, programs, assets, nonIndexableAssets },
}) {
  const items = await itemsImport(filePath, 'lp_modules', 40, false);

  await Promise.all(
    keys(items)
      .filter((key) => !isNil(key) && !isEmpty(key))
      .map(async (key) => {
        const module = items[key];

        let cover = module.cover || null;
        if (cover && !cover.startsWith('http')) {
          const matchedAsset = assets[cover];
          if (matchedAsset?.cover?.id) {
            cover = matchedAsset.cover.id;
          } else {
            cover = null;
          }
        }

        const tags = (module.tags || '')
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val));

        const program = programs[module.program];
        const subjects = (module.subjects || '')
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((val) => ({
            subject: program.subjects[val]?.id,
            program: program.id,
          }));

        const creator = users[module.creator];

        // ·····················································
        // RESOURCES

        const resources = (module.resources || '')
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((val) => {
            const match = assets[val] ?? nonIndexableAssets?.[val];
            return match ? match.id : null;
          })
          .filter(Boolean);

        // ·····················································
        // SUBMISSION

        let submission = null;
        const activities = module.submission
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((val) => {
            let type = 'activity';
            let match = tasks[val] ?? tests[val] ?? contentCreatorDocs[val];

            if (!match) {
              match = assets[val] ?? nonIndexableAssets?.[val];
              type = 'asset';
            }

            if (!match) return null;

            const id = uuidv4();
            const activity = match.assignable ?? match.fullId ?? match.id;
            return { activity, type, id };
          })
          .filter(Boolean);

        submission = {
          activities,
        };

        items[key] = {
          creator,
          asset: {
            name: module.name,
            tagline: module.tagline || null,
            description: module.description || null,
            tags,
            color: module.color || null,
            cover,
          },
          center: null,
          gradable: true,
          published: convertYesNoToBoolean(module.published),
          subjects,
          resources,
          submission,
          statement: 'Module', // follows the current implementation of module creation
        };
      })
  );

  return items;
}

module.exports = importModules;
