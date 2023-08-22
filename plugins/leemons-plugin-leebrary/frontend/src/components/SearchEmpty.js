import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Title, ImageLoader, Box, Paragraph } from '@bubbles-ui/components';
import { useLayout } from '@layout/context';

const SearchEmpty = ({ t }) => {
  const { theme } = useLayout();
  return (
    <Stack alignItems="center" justifyContent="center" direction="column" spacing={5}>
      <Box style={{ maxWidth: 350, textAlign: 'center' }}>
        <Title order={3}>{t('labels.searchListEmpty')}</Title>
      </Box>
      {theme.usePicturesEmptyStates && (
        <ImageLoader src="/public/leebrary/search-empty.png" height={200} />
      )}
      <Box style={{ maxWidth: 350 }}>
        <Paragraph align="center">{t('labels.searchListEmptyDescription')}</Paragraph>
      </Box>
    </Stack>
  );
};

SearchEmpty.propTypes = {
  t: PropTypes.func.isRequired,
};

export { SearchEmpty };
export default SearchEmpty;
