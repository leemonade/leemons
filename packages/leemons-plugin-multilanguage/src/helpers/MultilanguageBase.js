module.exports = class MultilanguageBase {
  constructor({ caller, private: isPrivate } = {}) {
    this.private = isPrivate;
    this.caller = caller;
  }

  /**
   * Checks if the caller is the owner of the key
   *
   * To determine the owner, we compare it with the key beggining
   *
   * @param {LocalizationKey} key
   */
  isOwner(key) {
    // TODO: Add to the callers the plugins prefix
    return key.startsWith(`plugins.${this.caller}`);
  }
};
