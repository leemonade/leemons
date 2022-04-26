import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { ContextContainer } from '@bubbles-ui/components';
import { unflatten, TagsAutocomplete, useRequestErrorMessage } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { LibraryForm } from '../LibraryForm/LibraryForm';
import prefixPN from '../../helpers/prefixPN';
import { prepareAsset } from '../../helpers/prepareAsset';
import { newAssetRequest, updateAssetRequest } from '../../request';

const BasicData = ({
  file,
  asset: assetProp,
  categoryId,
  editing,
  onSave = () => {},
  onNext = () => {},
  ...props
}) => {
  const [t, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(assetProp?.tags || []);
  const [, , , getErrorMessage] = useRequestErrorMessage();

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

  const handleOnTagsChange = (val) => {
    setTags(val);
  };

  const handleOnSubmit = async (data) => {
    let { coverFile } = data;
    if (coverFile === preparedAsset.cover) {
      coverFile = assetProp.cover;
    }

    const requestMethod = editing ? updateAssetRequest : newAssetRequest;

    setLoading(true);

    try {
      const { asset } = await requestMethod(
        { ...data, coverFile, tags },
        categoryId,
        'media-files'
      );

      onSave(prepareAsset(asset));
      setLoading(false);
      addSuccessAlert(
        editing ? t('basicData.labels.updatedSuccess') : t('basicData.labels.createdSuccess')
      );
      onNext();
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  // ··············································································
  // RENDER

  return (
    <LibraryForm
      {...props}
      {...formLabels}
      loading={loading}
      asset={{ ...assetProp, file, cover: preparedAsset.cover }}
      onSubmit={handleOnSubmit}
    >
      <ContextContainer subtitle="Tags" spacing={1}>
        <TagsAutocomplete
          pluginName="leebrary"
          type={prefixPN('')}
          labels={{ addButton: formLabels?.labels?.addTag }}
          placeholder={formLabels?.placeholders?.tagsInput}
          value={tags}
          onChange={handleOnTagsChange}
        />
      </ContextContainer>
    </LibraryForm>
  );
};

BasicData.propTypes = {
  categoryId: PropTypes.string.isRequired,
  editing: PropTypes.bool,
  file: PropTypes.instanceOf(Object),
  asset: PropTypes.instanceOf(Object),
  onSave: PropTypes.func,
  onNext: PropTypes.func,
};

export { BasicData };
export default BasicData;
