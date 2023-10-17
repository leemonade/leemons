import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import formWithTheme from '@common/formWithTheme';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function Form({ data, formActions }) {
  const datasetProps = useMemo(
    () => ({ formData: data.data.value }),
    [JSON.stringify(data.data.value)]
  );

  const [form, _formActions] = formWithTheme(
    data.data.jsonSchema,
    data.data.jsonUI,
    undefined,
    datasetProps
  );

  formActions(_formActions);

  return <Box>{form}</Box>;
}

Form.propTypes = {
  data: PropTypes.object,
  formActions: PropTypes.func,
};

export default Form;
