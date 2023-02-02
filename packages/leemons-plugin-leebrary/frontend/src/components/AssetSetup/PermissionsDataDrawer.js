import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@leebrary/helpers/prefixPN';
import PermissionsData from './PermissionsData';

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
    <Drawer
      opened={opened}
      back={t('header.back')}
      close={t('header.close')}
      onClose={onClose}
      onBack={onClose}
      {...props}
    >
      <PermissionsData
        {...{ asset, loading, sharing, onNext, onSavePermissions }}
        isDrawer
        drawerTranslations={[t, translations]}
      />
    </Drawer>
  );
};

PermissionsDataDrawer.propTypes = {
  opened: PropTypes.bool,
  asset: PropTypes.object,
  loading: PropTypes.bool,
  sharing: PropTypes.bool,
  onNext: PropTypes.func,
  onSavePermissions: PropTypes.func,
  onClose: PropTypes.func,
};

export { PermissionsDataDrawer };
