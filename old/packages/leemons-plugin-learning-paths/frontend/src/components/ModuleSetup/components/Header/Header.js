import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { Box, PageHeader } from '@bubbles-ui/components';
import { PluginLearningPathsIcon } from '@bubbles-ui/icons/outline';

import { fireEvent } from 'leemons-hooks';

import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import addAction from '../../helpers/addAction';

// eslint-disable-next-line import/prefer-default-export
export function Header({ localizations }) {
  const [sharedData] = useModuleSetupContext();
  const [isLoading, setIsLoading] = useState(false);
  const eventBase = 'plugin.learning-paths.modules.edit';

  useEffect(() => addAction(`${eventBase}.onSave`, () => setIsLoading(true)), [setIsLoading]);

  useEffect(
    () => addAction(`${eventBase}.onSave.finished`, () => setIsLoading(false)),
    [setIsLoading]
  );

  const title = sharedData?.basicData?.name || localizations?.title;

  return (
    <Box>
      <PageHeader
        values={{
          title,
        }}
        icon={<PluginLearningPathsIcon />}
        buttons={{
          cancel: localizations?.buttons?.save,
        }}
        loading={isLoading ? 'cancel' : undefined}
        onCancel={() => fireEvent('plugin.learning-paths.modules.edit.onSaveDraft')}
        fullWidth
      />
    </Box>
  );
}

Header.propTypes = {
  localizations: PropTypes.object,
};
