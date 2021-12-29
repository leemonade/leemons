module.exports = async function removeFile(file, { transacting } = {}) {
  // Default provider
  if (file.provider === 'sys') {
    await leemons.fs.unlink(file.uri);

    // Other providers
  } else {
    const provider = leemons.getProvider(file.provider);
    if (provider?.services?.provider?.remove) {
      await provider.services.provider.remove(file.uri, { transacting });
    }
  }

  return true;
};
