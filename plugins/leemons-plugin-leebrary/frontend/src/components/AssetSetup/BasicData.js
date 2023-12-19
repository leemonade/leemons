/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { ContextContainer, TotalLayoutStepContainer, InputWrapper } from '@bubbles-ui/components';
import { TagsAutocomplete, unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import LibraryContext from '../../context/LibraryContext';

import prefixPN from '../../helpers/prefixPN';
// eslint-disable-next-line import/no-cycle
import { LibraryBasicDataForm } from '../LibraryForm/LibraryBasicDataForm';

const BasicData = ({ advancedConfig, editing, isLoading, categoryType, Footer }) => {
  const { asset, category } = useContext(LibraryContext);
  const [t, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [tags, setTags] = useState(asset?.tags || []);

  // ··············································································
  // FORM LABELS & STATICS

  const formLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.leebrary.assetSetup.basicData;
      data.labels.title = editing ? data.header.titleEdit : data.header.titleNew;
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

  if (editing && !asset) return null;

  return (
    <TotalLayoutStepContainer Footer={Footer}>
      <LibraryBasicDataForm
        {...formLabels}
        advancedConfig={advancedConfig}
        isLoading={isLoading}
        asset={{ ...asset }}
        type={category?.key || categoryType}
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
      </LibraryBasicDataForm>
    </TotalLayoutStepContainer>
  );
};

BasicData.propTypes = {
  isLoading: PropTypes.bool,
  categoryType: PropTypes.string,
  type: PropTypes.string,
  editing: PropTypes.bool,
  asset: PropTypes.instanceOf(Object),
  advancedConfig: PropTypes.instanceOf(Object),
};

export { BasicData };
export default BasicData;
