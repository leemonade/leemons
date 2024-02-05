import _ from 'lodash';

async function newAssetForTextEditor(props) {
  return {
    ...props,
  };
}

function propsToObject(propsStr) {
  const propsArray = propsStr.split(/ (?=\w+?=)/g);
  return Object.fromEntries(
    propsArray
      .map((propTuple) => propTuple.split('='))
      .map(([key, ..._value]) => {
        const value = _value.join('=');
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
}

export async function mathProcessor(html, oldHtml, { force }) {
  const regex = /<math (.*?)><\/math>/g;
  const parsedAssets = {};
  let processedHTML = html;

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

          processedHTML = processedHTML.replace(component, `<math ${stringifiedProps}></math>`);
        }
      }
    }
  } catch (e) {
    throw new Error('Error processing library assets');
  }

  return processedHTML || html;
}

export default mathProcessor;
