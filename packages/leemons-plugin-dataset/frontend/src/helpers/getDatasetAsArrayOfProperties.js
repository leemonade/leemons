import * as _ from 'lodash';

function getDatasetAsArrayOfProperties(dataset) {
  const items = [];

  _.forIn(dataset.jsonSchema.properties, (value, key) => {
    items.push({ schema: value, id: key, ui: dataset.jsonUI[key] });
  });

  return items;
}

export default getDatasetAsArrayOfProperties;
