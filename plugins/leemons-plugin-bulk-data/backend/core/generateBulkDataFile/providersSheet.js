const { styleCell } = require('./helpers');

async function createProvidersSheet({ workbook }) {
  const worksheet = workbook.addWorksheet('providers');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'provider', key: 'provider', width: 20 },
    { header: 'region', key: 'region', width: 20 },
    { header: 'accessKey', key: 'accessKey', width: 30 },
    { header: 'secretAccessKey', key: 'secretAccessKey', width: 40 },
    { header: 'bucket', key: 'bucket', width: 40 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkId',
    name: 'Name',
    provider: 'Provider',
    region: 'Region',
    accessKey: 'Access Key',
    secretAccessKey: 'Access Secret Key',
    bucket: 'Bucket',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  // TODO: ask if we should get providers data. It seems weird.
  // We could pass data here as enviroment variables
  worksheet.addRow({ root: 'storage' });
  worksheet.addRow({ root: 'email' });
  worksheet.addRow({ root: 'iot' });
}

module.exports = { createProvidersSheet };
