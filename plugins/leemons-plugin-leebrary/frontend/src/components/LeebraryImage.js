import React from 'react';
import PropTypes from 'prop-types';
import { isString } from 'lodash';
import { getAssetUrl, getFileUrl, prepareAsset } from '../helpers/prepareAsset';

const LeebraryImage = ({ value, src, ...props }) => {
  const _src = React.useMemo(() => {
    const val = value || src;
    if (isString(val)) {
      if (val.includes('@')) {
        return getAssetUrl(val);
      }
      return getFileUrl(val);
    }
    if (val.id && val.cover) {
      const preparedAsset = prepareAsset(val);
      return preparedAsset.cover;
    }
    if (val.name && val.path) {
      return URL.createObjectURL(val);
    }

    return null;
  }, [value, src]);

  return <img {...props} src={_src} />;
};

LeebraryImage.defaultProps = {};
LeebraryImage.propTypes = {
  value: PropTypes.any,
  src: PropTypes.any,
};

export { LeebraryImage };
export default LeebraryImage;
