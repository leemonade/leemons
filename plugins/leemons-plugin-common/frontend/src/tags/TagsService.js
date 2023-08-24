class TagsService {
  constructor(pluginName) {
    this.pluginName = pluginName;
  }

  listTags(page, size, query) {
    return TagsService.listTags(this.pluginName, page, size, query);
  }

  static listTags(pluginName, page, size, query) {
    return leemons.api(`${pluginName}/tags/list`, {
      allAgents: true,
      method: 'POST',
      body: {
        page,
        size,
        query,
      },
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
export { TagsService };
