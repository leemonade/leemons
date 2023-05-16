import { duplicateAssetRequest, deleteAssetRequest } from '@leebrary/request';
import _ from 'lodash';
import { prepareAsset } from './prepareAsset';

async function newAssetForTextEditor(props) {
  const { asset: duplicatedAsset } = await duplicateAssetRequest(props.id, {
    preserveName: true,
    indexable: false,
    public: true,
  });

  const preparedAsset = prepareAsset(duplicatedAsset);

  let url = preparedAsset.url || preparedAsset.cover;

  if (props.filetype === 'bookmark') {
    url = props.url;
  }

  return {
    ...props,
    url,
    cover: preparedAsset.cover,
    id: preparedAsset.id,
    processed: true,
  };
}

function propsToObject(propsStr) {
  const propsArray = propsStr.split(/ (?=\w+?=)/g);
  const propsObj = Object.fromEntries(
    propsArray
      .map((propTuple) => propTuple.split('='))
      .map(([key, value]) => {
        if (value.startsWith('"')) {
          return [key, value.substring(1, value.length - 1)];
        }
        if (value === 'null') {
          return [key, null];
        }
        if (value === 'true' || value === 'false') {
          return [key, value === 'true'];
        }

        return [key, value];
      })
  );

  return propsObj;
}

function getHtmlAssets(html, { onlyProcessed }) {
  if (!html) {
    return [];
  }

  const regex = /<library (.*?)><\/library>/g;
  const assets = [];
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(html)) !== null) {
    const [, props] = match;

    const propsObj = propsToObject(props);

    if (!onlyProcessed || propsObj.processed) {
      assets.push(propsObj.id);
    }
  }

  return _.uniq(assets);
}

export async function libraryProcessor(html, oldHtml, { force }) {
  const regex = /<library (.*?)><\/library>/g;
  const parsedAssets = {};
  let processedHTML = html;

  const oldHtmlAssets = force ? [] : getHtmlAssets(oldHtml, { onlyProcessed: true });
  const newHtmlAssets = [];

  try {
    if (html?.length) {
      let match;
      // eslint-disable-next-line no-cond-assign
      while ((match = regex.exec(html)) !== null) {
        const [component, props] = match;

        const propsObj = propsToObject(props);

        if (propsObj.processed && !force) {
          newHtmlAssets.push(propsObj.id);
        } else {
          let newProps = parsedAssets[propsObj.id];
          if (!newProps) {
            // eslint-disable-next-line no-await-in-loop
            newProps = await newAssetForTextEditor(propsObj);
            parsedAssets[propsObj.id] = newProps;

            newHtmlAssets.push(propsObj.id);
          }

          const stringifiedProps = Object.entries(newProps)
            .map(([key, value]) => `${key}=${typeof value === 'string' ? `"${value}"` : value}`)
            .join(' ');

          processedHTML = processedHTML.replace(
            component,
            `<library ${stringifiedProps}></library>`
          );
        }
      }
    }
  } catch (e) {
    throw new Error('Error processing library assets');
  }

  const unusedAssets = _.difference(oldHtmlAssets, newHtmlAssets);

  try {
    await Promise.all(unusedAssets.map((asset) => deleteAssetRequest(asset)));
  } catch (e) {
    throw new Error('Error removing old library assets');
  }

  return processedHTML || html;
}

export default libraryProcessor;
