import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '../helpers/prefixPN';
import { prepareAsset } from '../helpers/prepareAsset';
import { LibraryForm } from './LibraryForm/LibraryForm';

const AssetForm = ({
  file,
  asset: assetProp,
  editing,
  children,
  onSubmit = () => {},
  ...props
}) => {
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));

  // ··············································································
  // LABELS & STATICS

  const formLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.assetSetup.basicData;
      data.labels.title = editing ? data.header.titleEdit : data.header.titleNew;
      data.labels.submitForm = editing ? data.labels.submitChanges : data.labels.submitForm;
      return data;
    }
    return {};
  }, [translations]);

  const preparedAsset = useMemo(() => {
    if (assetProp) {
      return prepareAsset(assetProp);
    }
    return {};
  }, [assetProp]);

  // ··············································································
  // HANDLERS

  const handleOnSubmit = async (data) => {
    let { coverFile } = data;
    if (coverFile === preparedAsset.cover) {
      coverFile = assetProp.cover;
    }
    const asset = { ...data, coverFile };

    onSubmit(asset);
  };

  // ··············································································
  // RENDER

  return (
    <LibraryForm
      {...props}
      {...formLabels}
      asset={{ ...assetProp, file, cover: preparedAsset.cover }}
      onSubmit={handleOnSubmit}
    >
      {children}
    </LibraryForm>
  );
};

AssetForm.propTypes = {
  editing: PropTypes.bool,
  file: PropTypes.instanceOf(Object),
  asset: PropTypes.instanceOf(Object),
  form: PropTypes.any,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
};

export { AssetForm };
export default AssetForm;
