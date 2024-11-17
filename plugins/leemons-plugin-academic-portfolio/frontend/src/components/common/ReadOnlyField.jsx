import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Text } from '@bubbles-ui/components';

const ReadOnlyField = ({ value, label }) => (
  <Stack spacing={1}>
    {label && <Text sx={(theme) => theme.other.badge.content.typo['md--bold']}>{`${label}:`}</Text>}
    <Text sx={(theme) => theme.other.badge.content.typo.md}>{value ?? ''}</Text>
  </Stack>
);

ReadOnlyField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ReadOnlyField;
