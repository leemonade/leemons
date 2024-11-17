import { BaseDrawer } from '@bubbles-ui/components';
import prefixPN from '@leebrary/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';
import React from 'react';
import { PermissionsData } from './PermissionsData';

const PermissionsDataDrawer = ({
  opened,
  asset,
  loading,
  sharing,
  onNext,
  onSavePermissions,
  onClose,
  ...props
}) => {
  const [t, translations] = useTranslateLoader(prefixPN('assetSetup'));

  return (
    <BaseDrawer
      opened={opened}
      close={false}
      onClose={onClose}
      onBack={onClose}
      size={728}
      empty
      {...props}
    >
      <PermissionsData
        {...{ asset, loading, sharing, onNext, onSavePermissions, onClose }}
        isDrawer
        drawerTranslations={[t, translations]}
      />
    </BaseDrawer>
  );
};

PermissionsDataDrawer.propTypes = {
  opened: PropTypes.bool,
  asset: PropTypes.object,
  loading: PropTypes.bool,
  sharing: PropTypes.bool,
  hasBack: PropTypes.bool,
  onNext: PropTypes.func,
  onSavePermissions: PropTypes.func,
  onClose: PropTypes.func,
};

export default PermissionsDataDrawer;
export { PermissionsDataDrawer };
