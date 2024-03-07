function getAssignationObject() {
  return {
    id: 'test-id',
    instance: 'test-instance',
    indexable: true,
    user: 'userAgentId',
    classes: {},
    metadata: {},
    emailSended: false,
    rememberEmailSended: true,
  };
}

module.exports = { getAssignationObject };
