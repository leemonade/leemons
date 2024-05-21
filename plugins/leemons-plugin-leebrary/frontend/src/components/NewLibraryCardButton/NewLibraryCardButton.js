import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import prefixPN from '@leebrary/helpers/prefixPN';
import { Box, UnstyledButton } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { NewLibraryCardButtonStyles } from './NewLibraryCardButton.styles';

function NewLibraryCardButton({ categoryLabel, onClick = noop }) {
  const [t] = useTranslateLoader(prefixPN('list'));
  const { classes } = NewLibraryCardButtonStyles({}, { name: 'NewLibraryCardButton' });
  return (
    <UnstyledButton className={classes.root} onClick={onClick}>
      <Box className={classes.icon}>
        <AddCircleIcon width={24} height={24} />
      </Box>
      <Box className={classes.label}>{t('newItem')}</Box>
    </UnstyledButton>
  );
}

NewLibraryCardButton.propTypes = {
  categoryLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default NewLibraryCardButton;
export { NewLibraryCardButton };
