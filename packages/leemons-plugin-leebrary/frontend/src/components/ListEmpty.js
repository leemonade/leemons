import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Title, ImageLoader, Paragraph, Text } from '@bubbles-ui/components';
import { CommonFileSearchIcon } from '@bubbles-ui/icons/outline';

const ListEmpty = ({ t }) => (
  <Stack
    alignItems="center"
    direction="column"
    spacing={4}
    sx={(theme) => ({ color: theme.colors.text05 })}
  >
    <Title order={4}>{t('labels.listEmpty')}</Title>
    <ImageLoader src="/public/leebrary/empty.png" height={200} />
    <Paragraph>{t('labels.listEmptyDescription')}</Paragraph>
  </Stack>
);

ListEmpty.propTypes = {
  t: PropTypes.func.isRequired,
};

export { ListEmpty };
export default ListEmpty;
