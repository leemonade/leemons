import React, { useMemo, forwardRef, useImperativeHandle } from 'react';

import { ContextContainer, LoadingOverlay } from '@bubbles-ui/components';
import { getValidateSchema } from '@bubbles-ui/leemons';
import { useLocale } from '@common/LocaleDate';
import { useFormWithTheme } from '@common/hooks/useFormWithTheme';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import { getSessionProfile } from '@users/session';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { areOptionalKeys, getRequiredKeysOnlyForMe } from '../../helpers/dataset';
import { useSaveDatasetValues } from '../../hooks/mutations';
import { useDatasetSchema, useDatasetValues } from '../../hooks/queries';

const DatasetForm = forwardRef(
  (
    {
      locationName,
      pluginName,
      targetId,
      title,
      showTitle,
      canEdit,
      hideReadOnly,
      validateOnlyForMe,
      skipOptional,
    },
    ref
  ) => {
    const profileId = getSessionProfile();
    const locale = useLocale();
    const [, , , getErrorMessage] = useRequestErrorMessage();

    const { data: dataset, isLoading } = useDatasetSchema({
      locationName,
      pluginName,
      locale,
      options: {
        enabled: !!locationName && !!pluginName && !!locale,
      },
    });

    const { data: datasetValues } = useDatasetValues({
      locationName,
      pluginName,
      targetId,
      options: { enabled: !!locationName && !!pluginName && !!targetId },
    });

    const { mutateAsync: postDatasetValues } = useSaveDatasetValues({
      locationName,
      pluginName,
      targetId,
    });

    // ····················································
    // DATA

    const datasetProcessed = useMemo(() => {
      if (!dataset) {
        return { schema: null, ui: null, value: null };
      }

      const response = _.cloneDeep(dataset);
      response.jsonSchema = response.compileJsonSchema;
      response.jsonUI = response.compileJsonUI;
      response.value = datasetValues;

      // ····················································
      // If canEdit is false, we set the value to '-' if the value is not set

      if (!canEdit) {
        _.forIn(response.jsonSchema?.properties, (value, key) => {
          if (!response.value?.[key]?.value) {
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
    }, [dataset, datasetValues, canEdit, hideReadOnly]);

    const validateSchema = useMemo(() => {
      const requiredKeys = validateOnlyForMe
        ? getRequiredKeysOnlyForMe({ dataset, profileId })
        : datasetProcessed.schema?.required;

      return getValidateSchema({ ...datasetProcessed.schema, required: requiredKeys });
    }, [datasetProcessed.schema, validateOnlyForMe, dataset, profileId]);

    const formData = useMemo(
      () => (canEdit ? datasetValues : datasetProcessed?.value),
      [canEdit, datasetProcessed, datasetValues]
    );

    const [formUI, form] = useFormWithTheme(
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

    // ····················································
    // METHODS

    async function handleSave(values, forceTargetId) {
      if (!targetId && !forceTargetId) {
        return false;
      }

      try {
        const toSave = {
          pluginName,
          locationName,
          targetId: forceTargetId ?? targetId,
          values,
        };

        await postDatasetValues(toSave);

        return true;
      } catch (error) {
        addErrorAlert(getErrorMessage(error));
        return false;
      }
    }

    async function getFormData() {
      if (!canEdit || !dataset || !form.isLoaded()) {
        return null;
      }

      let toSave = form.getValues();

      const requiredOnlyForMe = getRequiredKeysOnlyForMe({ dataset, profileId });

      if (requiredOnlyForMe.length === 0) {
        toSave = _.pickBy(toSave, (value) => !!value.value);
        return toSave;
      }

      await form.submit();

      // Process form results
      const errors = form.getErrors();

      if (errors.length && !skipOptional) {
        return null;
      }

      const readOnlyKeys = dataset.compileJsonSchema?.required.filter(
        (key) => !requiredOnlyForMe.includes(key)
      );

      const areOptional = areOptionalKeys({
        errors,
        readOnlyKeys,
      });

      const hasErrors = errors.length > 0;

      if (!hasErrors || areOptional) {
        return toSave;
      }

      return null;
    }

    async function checkForm() {
      if (!canEdit || !dataset) {
        return true;
      }

      if (!form.isLoaded()) {
        return false;
      }

      const formData = await getFormData();

      return formData !== null;
    }

    async function checkFormAndSave(forceTargetId) {
      const formData = await getFormData();

      if (!formData) {
        return false;
      }

      return handleSave(formData, forceTargetId);
    }

    useImperativeHandle(ref, () => ({
      checkForm,
      checkFormAndSave,
    }));

    // ····················································
    // RENDER

    if (!dataset) {
      return null;
    }

    if (isLoading) {
      return <LoadingOverlay visible />;
    }

    return (
      <ContextContainer title={!!title && showTitle ? title : undefined} level={1}>
        {formUI}
      </ContextContainer>
    );
  }
);

DatasetForm.displayName = '@dataset/components/DatasetForm';
DatasetForm.propTypes = {
  locationName: PropTypes.string,
  pluginName: PropTypes.string,
  targetId: PropTypes.string,
  canEdit: PropTypes.bool,
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  hideReadOnly: PropTypes.bool,
  validateOnlyForMe: PropTypes.bool,
  skipOptional: PropTypes.bool,
};

export { DatasetForm };
