import React from 'react';
import PropTypes from 'prop-types';
import { Box, ContextContainer, Paragraph } from '@bubbles-ui/components';
import prefixPN from '@admin/helpers/prefixPN';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function Setup({ session }) {
  return (
    <Box>
      <ContextContainer title="Setup welcome" description="Lets configure everything">
        <Paragraph>OK!!</Paragraph>
      </ContextContainer>
    </Box>
  );
}

Setup.propTypes = {
  session: PropTypes.object,
};

export default Setup;
