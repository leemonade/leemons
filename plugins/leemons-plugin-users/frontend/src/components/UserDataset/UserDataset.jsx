import React, { useMemo } from 'react';
import _, { noop } from 'lodash';
import PropTypes from 'prop-types';
import { Title, Box } from '@bubbles-ui/components';
import { getValidateSchema } from '@bubbles-ui/leemons';
import { getSessionProfile } from '@users/session';
import { useFormWithTheme } from '@common/hooks/useFormWithTheme';
import { getRequiredKeysOnlyForMe } from '@users/helpers/dataset';

function UserDataset({
  dataset,
  title,
  showTitle,
  isEditMode,
  hideReadOnly,
  validateOnlyForMe,
  formActions = noop,
}) {
  const profileId = getSessionProfile();

  const datasetProcessed = useMemo(() => {
    const response = _.cloneDeep(dataset);

    if (!response?.jsonSchema) {
      return { schema: null, ui: null, value: null };
    }

    // ····················································
    // If isEditMode is false, we set the value to '-' if the value is not set

    if (!isEditMode) {
      _.forIn(response.jsonSchema.properties, (value, key) => {
        if (!response?.value?.[key]?.value) {
          response.value = {
            ...response.value,
            [key]: {
              value: '-',
            },
          };
          delete response.jsonUI[key];
        }

        response.jsonSchema.properties[key].description = false;

        if (!response.jsonUI[key]) {
          response.jsonUI[key] = {};
        }

        response.jsonUI[key]['ui:readonly'] = true;
        response.jsonUI[key]['ui:help'] = false;
      });

      // Finally set the required fields to an empty array
      response.jsonSchema.required = [];
    }

    if (!hideReadOnly) {
      return { schema: response.jsonSchema, ui: response.jsonUI, value: response.value };
    }

    // ····················································
    // If hideReadOnly is true, we remove the readOnly keys from the jsonSchema and jsonUI

    const { jsonSchema, jsonUI } = response;

    const readOnlyKeys = Object.keys(jsonUI).filter((key) => jsonUI[key]['ui:readonly']);

    const properties = Object.keys(jsonSchema.properties).filter(
      (key) => !readOnlyKeys.includes(key)
    );
    const resultSchema = {
      ...jsonSchema,
      // Remove all the readOnlyKeys on jsonSchema.properties
      properties: properties.reduce((acc, key) => {
        acc[key] = jsonSchema.properties[key];
        return acc;
      }, {}),
    };

    // Remove all the readOnlyKeys on jsonUI[key]
    readOnlyKeys.forEach((key) => {
      delete jsonUI[key];
    });

    return { schema: resultSchema, ui: jsonUI, value: response.value };
  }, [dataset, isEditMode, hideReadOnly]);

  const validateSchema = useMemo(() => {
    const requiredKeys = validateOnlyForMe
      ? getRequiredKeysOnlyForMe({ dataset, profileId })
      : datasetProcessed.schema.required;

    return getValidateSchema({ ...datasetProcessed.schema, required: requiredKeys });
  }, [datasetProcessed.schema, validateOnlyForMe, dataset, profileId]);

  const formData = useMemo(
    () => (isEditMode ? dataset?.value : datasetProcessed?.value),
    [isEditMode, datasetProcessed, JSON.stringify(dataset?.value)]
  );

  const [form, actions] = useFormWithTheme(
    datasetProcessed.schema,
    datasetProcessed.ui,
    undefined,
    {
      formData,
    },
    {
      customValidateSchema: validateSchema,
    }
  );

  if (!dataset) {
    return null;
  }

  formActions(actions);

  return (
    <>
      {!!title && showTitle && (
        <Box mb={6}>
          <Title order={4}>{title}</Title>
        </Box>
      )}
      {form}
    </>
  );
}

UserDataset.propTypes = {
  dataset: PropTypes.any,
  formActions: PropTypes.func,
  isEditMode: PropTypes.bool,
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  hideReadOnly: PropTypes.bool,
  validateOnlyForMe: PropTypes.bool,
};

export { UserDataset };
