import React from 'react';
import { Box } from '@bubbles-ui/components';
import useDocument from '@content-creator/request/hooks/queries/useDocument';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import propTypes from 'prop-types';

import prefixPN from '@content-creator/helpers/prefixPN';

function DocumentPlayer({ asset }) {
  const { data: document } = useDocument({ id: asset?.providerData?.id });
  const [t] = useTranslateLoader(prefixPN('contentCreatorDetail'));
  return (
    <Box style={{ width: 500 }}>
      <ContentEditorInput
        useSchema
        compact
        fullWidth
        schemaLabel={t('schemaLabel')}
        labels={{
          format: t('formatLabel'),
        }}
        value={document?.content}
        openLibraryModal={false}
        readOnly
      />
    </Box>
  );
}

DocumentPlayer.propTypes = {
  asset: propTypes.object,
};

export default DocumentPlayer;
export { DocumentPlayer };
