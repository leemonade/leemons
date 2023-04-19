function importConnector(connector) {
  const connectorPackage = `leemons-cache-connector-${connector}`;
  if (!connector) {
    throw new Error('Cache connector name was not specified');
  }
  try {
    // Check if the connector is installed
    require.resolve(connectorPackage);
  } catch (e) {
    throw new Error(
      `The cache connector ${connectorPackage} is not installed. try: $ yarn add ${connectorPackage}`
    );
  }

  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(connectorPackage);
  } catch (e) {
    throw new Error(`The cache connector ${connectorPackage} can not be initialized`);
  }
}

module.exports = importConnector;
