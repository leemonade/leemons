import { ContextContainer } from '@bubbles-ui/components';
import { TagsAutocomplete, unflatten, useRequestErrorMessage } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import prefixPN from '../../helpers/prefixPN';
import { prepareAsset } from '../../helpers/prepareAsset';
import { getAssetRequest, newAssetRequest, updateAssetRequest } from '../../request';
import { LibraryForm } from '../LibraryForm/LibraryForm';

const BookmarkBasicData = ({
  asset: assetProp,
  editing,
  advancedConfig,
  categoryId,
  onSave = () => {},
  onNext = () => {},
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
    let { cover } = data;
    if (cover === preparedAsset.cover) {
      cover = assetProp.cover;
    }

    const requestMethod = editing ? updateAssetRequest : newAssetRequest;

    setLoading(true);

    try {
      const { asset } = await requestMethod({ ...data, cover, tags }, categoryId, 'bookmarks');
      const response = await getAssetRequest(asset.id);
      onSave(prepareAsset(response.asset));
      setLoading(false);
      addSuccessAlert(
        editing ? t('basicData.labels.updatedSuccess') : t('basicData.labels.createdSuccess')
      );
      onNext();
    } catch (err) {
      console.error(err);
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  // ··············································································
  // RENDER

  return (
    <LibraryForm
      {...formLabels}
      advancedConfig={advancedConfig}
      asset={{ ...assetProp, cover: preparedAsset.cover }}
      type="bookmarks"
      loading={loading}
      onSubmit={handleOnSubmit}
    >
      <ContextContainer subtitle="Tags" spacing={1}>
        <TagsAutocomplete
          pluginName="leebrary"
          labels={{ addButton: formLabels?.labels?.addTag }}
          placeholder={formLabels?.placeholders?.tagsInput}
          value={tags}
          onChange={handleOnTagsChange}
        />
      </ContextContainer>
    </LibraryForm>
  );
};

BookmarkBasicData.propTypes = {
  categoryId: PropTypes.string.isRequired,
  editing: PropTypes.bool,
  asset: PropTypes.instanceOf(Object),
  advancedConfig: PropTypes.any,
  onSave: PropTypes.func,
  onNext: PropTypes.func,
};

export { BookmarkBasicData };
export default BookmarkBasicData;
