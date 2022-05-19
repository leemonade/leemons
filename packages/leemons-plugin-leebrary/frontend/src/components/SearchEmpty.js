import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Title } from '@bubbles-ui/components';
import { CommonFileSearchIcon } from '@bubbles-ui/icons/outline';

const SeachEmpty = ({ t }) => (
  <Stack
    alignItems="center"
    direction="column"
    spacing={2}
    sx={(theme) => ({ color: theme.colors.text05 })}
  >
    <CommonFileSearchIcon style={{ fontSize: 24 }} />
    <Title order={4} color="soft">
      {t('labels.nothingFound')}
    </Title>
  </Stack>
);

SeachEmpty.propTypes = {
  t: PropTypes.func.isRequired,
};

export { SeachEmpty };
export default SeachEmpty;
