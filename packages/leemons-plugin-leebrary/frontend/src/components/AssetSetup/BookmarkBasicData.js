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
import { newAssetRequest } from '../../request';

const BookmarkBasicData = ({ categoryId, onSave = () => {}, onNext = () => {} }) => {
  const [t, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [, , , getErrorMessage] = useRequestErrorMessage();

  // ··············································································
  // HANDLERS

  const handleOnTagsChange = (val) => {
    setTags(val);
  };

  const handleOnSubmit = async (data) => {
    setLoading(true);

    try {
      console.log('categoryId:', categoryId);
      const { asset } = await newAssetRequest(data, categoryId, 'bookmarks');
      console.log(asset);
      onSave(prepareAsset(asset));
      setLoading(false);
      addSuccessAlert(t('basicData.labels.createdSuccess'));
      onNext();
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  // ··············································································
  // LABELS & STATICS

  const formLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.assetSetup.basicData;
      console.log(data);
      data.labels.title = data.bookmark.title;
      return data;
    }
    return {};
  }, [translations]);

  // ··············································································
  // RENDER

  return (
    <LibraryForm {...formLabels} type="bookmarks" loading={loading} onSubmit={handleOnSubmit}>
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
  onSave: PropTypes.func,
  onNext: PropTypes.func,
};

export { BookmarkBasicData };
export default BookmarkBasicData;
