import React, { useMemo } from 'react';
import _, { noop } from 'lodash';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { useFormWithTheme } from '@common/hooks/useFormWithTheme';

// Components that only the super admin or users with the permission to create users will have access to
function UserDataset({ dataset, isEditMode, formActions = noop }) {
  const [store, render] = useStore({
    data: dataset,
  });

  React.useEffect(() => {
    store.data = dataset;
    render();
  }, [dataset]);

  const datasetProps = useMemo(
    () => ({ formData: store.data?.value }),
    [JSON.stringify(store.data?.value)]
  );

  const datasetConfig = useMemo(() => {
    const response = _.cloneDeep(store.data);
    if (!isEditMode && response?.jsonSchema) {
      response.jsonSchema.required = [];

      _.forIn(response.jsonSchema.properties, (value, key) => {
        if (!store?.data?.value[key]?.value) {
          delete response.jsonSchema.properties[key];
          delete response.jsonUI[key];
          return;
        }

        response.jsonSchema.properties[key].description = false;

        if (!response.jsonUI[key]) {
          response.jsonUI[key] = {};
        }

        response.jsonUI[key]['ui:readonly'] = true;
        response.jsonUI[key]['ui:help'] = false;
      });
    }
    return response;
  }, [store.data, isEditMode]);

  const [form, _formActions] = useFormWithTheme(
    datasetConfig?.jsonSchema,
    datasetConfig?.jsonUI,
    undefined,
    datasetProps
  );

  if (!dataset) {
    return null;
  }

  formActions(_formActions);

  return form;
}

UserDataset.propTypes = {
  dataset: PropTypes.any,
  formActions: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export { UserDataset };
