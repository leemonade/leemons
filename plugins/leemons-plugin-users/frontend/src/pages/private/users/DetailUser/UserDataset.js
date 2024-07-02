import React, { useMemo } from 'react';
import _, { noop } from 'lodash';
import PropTypes from 'prop-types';
import { Title, Box } from '@bubbles-ui/components';
import { useStore } from '@common';
import { useFormWithTheme } from '@common/hooks/useFormWithTheme';

// Components that only the super admin or users with the permission to create users will have access to
function UserDataset({ dataset, title, showTitle, isEditMode, formActions = noop }) {
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
      _.forIn(response.jsonSchema.properties, (value, key) => {
        if (!store?.data?.value?.[key]?.value) {
          store.data.value = {
            ...store.data.value,
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
    return response;
  }, [store.data, isEditMode]);

  const [form, actions] = useFormWithTheme(
    datasetConfig?.jsonSchema,
    datasetConfig?.jsonUI,
    undefined,
    datasetProps
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
};

export { UserDataset };
