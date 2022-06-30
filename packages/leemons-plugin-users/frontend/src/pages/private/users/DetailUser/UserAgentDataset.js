import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Col, Grid, InputWrapper } from '@bubbles-ui/components';
import { useStore } from '@common';
import formWithTheme from '@common/formWithTheme';
import * as _ from 'lodash';
import { getUserAgentDetailForPageRequest } from '../../../../request';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserAgentDataset({ t, userAgent, isEditMode, formActions, hide }) {
  const [store, render] = useStore();

  const datasetProps = useMemo(
    () => ({ formData: store.data?.value }),
    [JSON.stringify(store.data?.value)]
  );

  async function init() {
    const { data } = await getUserAgentDetailForPageRequest(userAgent.id);
    store.data = data;
    if (!data.jsonSchema || !data.jsonUI) {
      hide();
    }
    render();
  }

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

  React.useEffect(() => {
    init();
  }, [JSON.stringify(userAgent)]);

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

UserAgentDataset.propTypes = {
  t: PropTypes.func,
  userAgent: PropTypes.object,
  formActions: PropTypes.func,
  hide: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export default UserAgentDataset;
