import { Box, UnstyledButton, Stack } from '@bubbles-ui/components';
import { AddCircleIcon, UploadIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { noop, capitalize } from 'lodash';
import PropTypes from 'prop-types';

import { NewLibraryCardButtonStyles } from './NewLibraryCardButton.styles';

import prefixPN from '@leebrary/helpers/prefixPN';

function NewLibraryCardButton({
  categoryKey,
  categoryLabel,
  onClickNew = noop,
  onClickBulkUpload = noop,
}) {
  const isMultipleButton = categoryKey.includes('media');
  const [t] = useTranslateLoader(prefixPN('list'));
  const { classes } = NewLibraryCardButtonStyles(
    { isMultipleButton },
    { name: 'NewLibraryCardButton' }
  );
  const secondaryButtonLabel = {
    'media-files': t('uploadBulk'),
  }[categoryKey];

  return (
    <Stack direction="column" spacing={6} fullWidth>
      <UnstyledButton className={classes.root} onClick={onClickNew}>
        <Box className={classes.icon}>
          <AddCircleIcon width={24} height={24} />
        </Box>
        <Box className={classes.label}>{t('genericNew', { label: capitalize(categoryLabel) })}</Box>
      </UnstyledButton>
      {isMultipleButton && (
        <UnstyledButton className={classes.root} onClick={onClickBulkUpload}>
          <Box className={classes.icon}>
            <UploadIcon width={24} height={24} />
          </Box>
          <Box className={classes.label}>{secondaryButtonLabel}</Box>
        </UnstyledButton>
      )}
    </Stack>
  );
}

NewLibraryCardButton.propTypes = {
  categoryLabel: PropTypes.string.isRequired,
  onClickNew: PropTypes.func.isRequired,
  onClickBulkUpload: PropTypes.func.isRequired,
  categoryKey: PropTypes.string.isRequired,
};

export default NewLibraryCardButton;
export { NewLibraryCardButton };
