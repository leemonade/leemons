import { useState } from 'react';

import { Box, Button } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { GiftImporterDrawer } from './GiftImporterDrawer';

import prefixPN from '@tests/helpers/prefixPN';

function GiftImporter({ onAddQuestions }) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Box>
      <Button variant="link" leftIcon={<DownloadIcon />} onClick={() => setIsDrawerOpen(true)}>
        {t('giftImport.importFile')}
      </Button>
      <GiftImporterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddQuestions={onAddQuestions}
      />
    </Box>
  );
}

GiftImporter.propTypes = {
  onAddQuestions: PropTypes.func.isRequired,
};

export { GiftImporter };
