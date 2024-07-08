import { noop } from 'lodash';

export function getReadOnlyKeys(jsonUI) {
  return Object.keys(jsonUI).filter((key) => jsonUI[key]['ui:readonly']);
}

export function areOptionalKeys({ errors, readOnlyKeys }) {
  const errorProperties = errors.map((error) => error.property);
  return errorProperties.every((property) => readOnlyKeys.includes(property));
}

export function getRequiredKeysOnlyForMe({ dataset, profileId: userProfileId }) {
  if (!dataset?.jsonSchema) {
    return null;
  }

  if (!userProfileId) {
    return dataset.jsonSchema.required;
  }

  const { properties } = dataset.jsonSchema;

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

export async function checkForms({
  profileId,
  datasets = [],
  formActions = [],
  handleSave = noop,
  skipOptional,
}) {
  const submitPromises = formActions.filter((form) => form.isLoaded()).map((form) => form.submit());

  if (submitPromises.length !== formActions.length) {
    return false;
  }

  await Promise.all(submitPromises);

  // Process form results
  const newForms = datasets.map((dataset, i) => {
    const form = formActions[i];
    const errors = form.getErrors();

    if (errors.length && !skipOptional) {
      return null;
    }

    const readOnlyKeys = dataset.data.jsonSchema.required.filter(
      (key) => !getRequiredKeysOnlyForMe({ dataset: dataset.data, profileId }).includes(key)
    );

    const areOptional = areOptionalKeys({
      errors,
      readOnlyKeys,
    });

    if (errors.length && !areOptional) {
      return null; // Invalid form
    }

    return { ...dataset, newValues: form.getValues() };
  });

  if (newForms.some((form) => form === null)) {
    return false;
  }

  return handleSave(newForms);
}
