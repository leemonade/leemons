import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, ImageLoader, Paragraph, Box } from '@bubbles-ui/components';
import { useLayout } from '@layout/context';

const ListEmpty = ({ t }) => {
  const { theme } = useLayout();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      direction="column"
      spacing={5}
      fullWidth
      fullHeight
    >
      <Stack direction="column" style={{ maxWidth: 400, textAlign: 'center' }}>
        <Text size="md" color="soft">
          {t('labels.listEmpty')}
        </Text>
        <Text size="md" color="soft">
          {t('labels.listEmptyDescription')}
        </Text>
      </Stack>
      {theme.usePicturesEmptyStates && (
        <ImageLoader src="/public/leebrary/empty.png" height={200} />
      )}
    </Stack>
  );
};

ListEmpty.propTypes = {
  t: PropTypes.func.isRequired,
};

export { ListEmpty };
export default ListEmpty;
