import { Col, Grid, InputWrapper } from '@bubbles-ui/components';
import { useStore } from '@common';
import formWithTheme from '@common/formWithTheme';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserDataset({ t, dataset, isEditMode, formActions }) {
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
    if (!isEditMode) {
      if (response && response.jsonSchema) {
        _.forIn(response.jsonSchema.properties, (value, key) => {
          if (!response.jsonUI[key]) response.jsonUI[key] = {};
          response.jsonUI[key]['ui:disabled'] = true;
        });
      }
    }
    return response;
  }, [store.data, isEditMode]);

  const [form, _formActions] = formWithTheme(
    datasetConfig?.jsonSchema,
    datasetConfig?.jsonUI,
    undefined,
    datasetProps
  );

  formActions(_formActions);

  return (
    <Grid columns={100}>
      <Col span={35}>
        <InputWrapper label={t('otherInformationLabel')} />
      </Col>
      <Col span={65}>{form}</Col>
    </Grid>
  );
}

UserDataset.propTypes = {
  t: PropTypes.func,
  formActions: PropTypes.func,
  dataset: PropTypes.any,
  isEditMode: PropTypes.bool,
};

export default UserDataset;
