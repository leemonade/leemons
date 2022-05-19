import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Title, ImageLoader, Paragraph, Box } from '@bubbles-ui/components';

const ListEmpty = ({ t }) => (
  <Stack alignItems="center" justifyContent="center" direction="column" spacing={5}>
    <Title order={3}>{t('labels.listEmpty')}</Title>
    <ImageLoader src="/public/leebrary/empty.png" height={200} />
    <Box style={{ maxWidth: 350 }}>
      <Paragraph align="center">{t('labels.listEmptyDescription')}</Paragraph>
    </Box>
  </Stack>
);

ListEmpty.propTypes = {
  t: PropTypes.func.isRequired,
};

export { ListEmpty };
export default ListEmpty;
