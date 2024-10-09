import { noop, pickBy } from 'lodash';

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
  const newForms = await Promise.all(
    datasets.map(async (dataset, i) => {
      const form = formActions[i];
      if (!form.isLoaded()) {
        return null;
      }

      let toSave = form.getValues();

      // Get the required keys for the user's profile
      const requiredOnlyForMe = getRequiredKeysOnlyForMe({ dataset: dataset.data, profileId });
      const requiredKeys = dataset.data.jsonSchema.required;

      // If there are no required keys, skip submission and error validation
      if (requiredOnlyForMe.length === 0 || requiredKeys.length === 0) {
        toSave = pickBy(toSave, (value) => !!value.value);
        return { ...dataset, newValues: toSave };
      }

      // Only submit the form if there are required keys
      await form.submit();
      const errors = form.getErrors();

      if (errors.length && !skipOptional) {
        return null;
      }

      const readOnlyKeys = requiredKeys.filter((key) => !requiredOnlyForMe.includes(key));

      const areOptional = areOptionalKeys({
        errors,
        readOnlyKeys,
      });

      if (errors.length && !areOptional) {
        return null; // Invalid form
      }

      return { ...dataset, newValues: toSave };
    })
  );

  if (newForms.some((form) => form === null)) {
    return false;
  }

  return handleSave(newForms);
}
