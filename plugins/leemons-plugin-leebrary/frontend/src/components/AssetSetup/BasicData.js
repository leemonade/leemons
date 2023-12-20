/* eslint-disable no-param-reassign */
import React, {  useMemo, useState, useContext } from 'react';
import { ContextContainer, TotalLayoutStepContainer, InputWrapper } from '@bubbles-ui/components';
import { TagsAutocomplete, unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import LibraryContext from '../../context/LibraryContext';

import prefixPN from '../../helpers/prefixPN';
import { useFormContext } from 'react-hook-form';
import AssetFormInput from '../AssetFormInput';

const BasicData = ({ advancedConfig, editing, isLoading, categoryKey, Footer, ZoneOne }) => {
  const form = useFormContext();
  const { asset, category } = useContext(LibraryContext);
  const [t, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [tags, setTags] = useState(asset?.tags || []);

  // ··············································································
  // FORM LABELS & STATICS

  const formLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.leebrary.assetSetup.basicData;
      data.labels.title = data.labels.content;
      data.labels.submitForm = editing ? data.labels.submitChanges : data.labels.submitForm;
      return data;
    }
    return {};
  }, [translations]);

  // ··············································································
  // TAGS
  const handleOnTagsChange = (val) => {
    setTags(val);
  };

  return (
    <TotalLayoutStepContainer Footer={Footer}>
      <AssetFormInput
        {...formLabels}
        advancedConfig={advancedConfig}
        isLoading={isLoading}
        category={category?.key || categoryKey}
        form={form}
        preview
      >
        <ContextContainer spacing={2}>
          <InputWrapper label={t('basicData.labels.tags')}>
            <TagsAutocomplete
              pluginName="leebrary"
              type={prefixPN('')}
              labels={{ addButton: formLabels?.labels?.addTag }}
              placeholder={formLabels?.placeholders?.tagsInput}
              value={tags}
              onChange={handleOnTagsChange}
            />
          </InputWrapper>
        </ContextContainer>
      </AssetFormInput>
    </TotalLayoutStepContainer>
  );
};

BasicData.propTypes = {
  advancedConfig: PropTypes.instanceOf(Object),
  editing: PropTypes.bool,
  isLoading: PropTypes.bool,
  categoryType: PropTypes.string,
  Footer: PropTypes.element,
};

export { BasicData };
export default BasicData;
