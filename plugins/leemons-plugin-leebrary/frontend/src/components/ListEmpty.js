import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack, Title, ImageLoader, Paragraph, Box } from '@bubbles-ui/components';
import { useLayout } from '@layout/context';

const ListEmpty = ({ t }) => {
  const { theme } = useLayout();
  return (
    <Stack alignItems="center" justifyContent="center" direction="column" spacing={5}>
      <Box style={{ maxWidth: 400, textAlign: 'center' }}>
        <Title order={3}>{t('labels.listEmpty')}</Title>
      </Box>
      {theme.usePicturesEmptyStates && (
        <ImageLoader src="/public/leebrary/empty.png" height={200} />
      )}
      {/* <Box style={{ maxWidth: 400 }}>
      <Paragraph align="center">{t('labels.listEmptyDescription')}</Paragraph>
    </Box> */}
    </Stack>
  );
};

ListEmpty.propTypes = {
  t: PropTypes.func.isRequired,
};

export { ListEmpty };
export default ListEmpty;
