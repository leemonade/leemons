// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const glob = require('glob');
const path = require('path');
const _ = require('lodash');

export default (req, res) => {
  const pagesDir = path.join(__dirname, '../../../../pages');
  let result = glob.sync(`${pagesDir}/**/*.js`);
  result = _.map(result, (item) => item.replace(`${pagesDir}/`, '').replace('.js', ''));
  result = _.filter(result, (item) => item.startsWith('components') || item.startsWith('demos'));

  result = _.map(result, (url) => {
    let label = _.capitalize(url.replace('components/', '').replace('demos/', ''));

    if (label.indexOf('/') > 0) {
      label = _.map(label.split('/'), (item) => _.capitalize(item)).join('/');
    }

    if (label.indexOf('-') > 0) {
      label = _.map(label.split('-'), (item) => _.capitalize(item)).join(' ');
    }

    return {
      label,
      url: `/${url}`,
    };
  });

  const components = _.filter(result, (item) => item.url.startsWith('/components'));
  const demos = _.filter(result, (item) => item.url.startsWith('/demos'));

  res.status(200).json({ components, demos });
};
