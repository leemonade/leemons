import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Col, Grid, InputWrapper } from '@bubbles-ui/components';
import { useStore } from '@common';
import formWithTheme from '@common/formWithTheme';
import { getUserAgentDetailForPageRequest } from '../../../../request';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserAgentDataset({ t, userAgent, formActions, hide }) {
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

  React.useEffect(() => {
    init();
  }, [JSON.stringify(userAgent)]);

  const [form, _formActions] = formWithTheme(
    store.data?.jsonSchema,
    store.data?.jsonUI,
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
};

export default UserAgentDataset;
