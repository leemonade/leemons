function tLoader(prefix, translations) {
  return (key) => {
    const tKey = `${prefix}.${key}`;
    if (
      translations &&
      translations.items &&
      Object.prototype.hasOwnProperty.call(translations.items, tKey)
    ) {
      return translations.items[tKey];
    }
    return null;
  };
}

module.exports = tLoader;
