import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { TotalLayoutHeader } from '@bubbles-ui/components';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { ModuleCardIcon } from '@learning-paths/components/ModuleCardIcon';
import addAction from '../../helpers/addAction';

function Header({ localizations, onCancel = noop }) {
  const [sharedData] = useModuleSetupContext();
  const [isLoading, setIsLoading] = useState(false);
  const eventBase = 'plugin.learning-paths.modules.edit';

  useEffect(() => addAction(`${eventBase}.onSave`, () => setIsLoading(true)), [setIsLoading]);

  useEffect(
    () => addAction(`${eventBase}.onSave.finished`, () => setIsLoading(false)),
    [setIsLoading]
  );

  const title = sharedData?.id ? localizations?.editTitle : localizations?.title;

  /*
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
*/
  return (
    <TotalLayoutHeader
      title={title}
      formTitlePlaceholder={
        sharedData?.basicData?.name ? sharedData.basicData.name : localizations?.subtitlePlaceholder
      }
      icon={<ModuleCardIcon width={24} height={24} />}
      onCancel={onCancel}
      mainActionLabel={localizations?.cancel}
    />
  );
}

Header.propTypes = {
  localizations: PropTypes.object,
  onCancel: PropTypes.func,
};

export { Header };
