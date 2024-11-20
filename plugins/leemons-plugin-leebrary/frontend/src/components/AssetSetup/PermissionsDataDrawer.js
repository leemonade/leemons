import { BaseDrawer } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { PermissionsData } from './PermissionsData';

import prefixPN from '@leebrary/helpers/prefixPN';

const PermissionsDataDrawer = ({
  opened,
  asset,
  assets,
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
        {...{ asset, assets, loading, sharing, onNext, onSavePermissions, onClose }}
        isDrawer
        drawerTranslations={[t, translations]}
      />
    </BaseDrawer>
  );
};

PermissionsDataDrawer.propTypes = {
  opened: PropTypes.bool,
  asset: PropTypes.object,
  assets: PropTypes.array,
  loading: PropTypes.bool,
  sharing: PropTypes.bool,
  hasBack: PropTypes.bool,
  onNext: PropTypes.func,
  onSavePermissions: PropTypes.func,
  onClose: PropTypes.func,
};

export default PermissionsDataDrawer;
export { PermissionsDataDrawer };
