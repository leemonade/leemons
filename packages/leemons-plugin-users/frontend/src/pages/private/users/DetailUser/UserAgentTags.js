import React from 'react';
import PropTypes from 'prop-types';
import { Col, Grid, InputWrapper, TagsInput } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { getUserAgentDetailForPageRequest } from '../../../../request';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserAgentTags({ t, userAgent, form, isEditMode }) {
  async function init() {
    const { data } = await getUserAgentDetailForPageRequest(userAgent.id);
    form.setValue('tags', data.tags);
  }

  React.useEffect(() => {
    init();
  }, [JSON.stringify(userAgent)]);

  return (
    <Grid columns={100}>
      <Col span={35}>
        <InputWrapper label={t('tags')} />
      </Col>
      <Col span={65}>
        <Controller
          name="tags"
          control={form.control}
          render={({ field }) => (
            <TagsInput {...field} disabled={!isEditMode} labels={{ addButton: t('addTag') }} />
          )}
        />
      </Col>
    </Grid>
  );
}

UserAgentTags.propTypes = {
  t: PropTypes.func,
  form: PropTypes.object,
  userAgent: PropTypes.object,
  isEditMode: PropTypes.bool,
};

export default UserAgentTags;
