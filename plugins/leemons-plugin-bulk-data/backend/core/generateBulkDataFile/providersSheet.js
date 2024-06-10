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
    { header: 'smtpHost', key: 'smtpHost', width: 30 },
    { header: 'smtpUser', key: 'smtpUser', width: 30 },
    { header: 'smtpPass', key: 'smtpPass', width: 30 },
    { header: 'smtpPort', key: 'smtpPort', width: 10 },
    { header: 'smtpSecure', key: 'smtpSecure', width: 10 },
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
    smtpHost: 'SMTP >Host',
    smtpUser: 'email',
    smtpPass: 'password',
    smtpPort: 'port',
    smtpSecure: 'secure',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  worksheet.addRow({ root: 'storage' });
  worksheet.addRow({ root: 'email' });
  worksheet.addRow({ root: 'iot' });
}

module.exports = { createProvidersSheet };
