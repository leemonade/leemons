const config = require('../config/awsEmailConfig');

async function addAWSEmailAsProvider() {
  await leemons
    .getPlugin('emails')
    .services.email.addProvider({ providerName: 'emails-amazon-ses', config });
}

module.exports = addAWSEmailAsProvider;
