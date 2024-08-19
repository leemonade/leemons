export function getReadOnlyKeys(jsonUI) {
  return Object.keys(jsonUI).filter((key) => jsonUI[key]['ui:readonly']);
}

export function areOptionalKeys({ errors, readOnlyKeys }) {
  const errorProperties = errors.map((error) => error.property);
  return errorProperties.every((property) => readOnlyKeys.includes(property));
}

export function getRequiredKeysOnlyForMe({ dataset, profileId: userProfileId }) {
  if (!dataset?.compileJsonSchema) {
    return null;
  }

  if (!userProfileId) {
    return dataset.compileJsonSchema.required;
  }

  const { properties } = dataset.compileJsonSchema;

  return Object.keys(properties).filter((key) => {
    const { permissions } = properties[key];
    return Object.keys(permissions).every((profileId) => {
      if (profileId === userProfileId) {
        return permissions[profileId].includes('edit');
      }
      return !permissions[profileId].includes('edit');
    });
  });
}
