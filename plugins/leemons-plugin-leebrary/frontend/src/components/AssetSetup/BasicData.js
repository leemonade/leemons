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
import { BasicDataLibraryForm } from '../LibraryForm/BasicDataLibraryForm';

const BasicData = ({ advancedConfig, editing }) => {
  const { asset } = useContext(LibraryContext);
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [loading] = useState(false);
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
    <TotalLayoutStepContainer>
      <BasicDataLibraryForm
        {...formLabels}
        advancedConfig={advancedConfig}
        loading={loading}
        asset={{ ...asset }}
      >
        <ContextContainer spacing={2}>
          <InputWrapper label="Tags">
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
      </BasicDataLibraryForm>
    </TotalLayoutStepContainer>
  );
};

BasicData.propTypes = {
  categoryId: PropTypes.string.isRequired,
  file: PropTypes.instanceOf(Object),
  editing: PropTypes.bool,
  asset: PropTypes.instanceOf(Object),
  onSave: PropTypes.func,
  onNext: PropTypes.func,
  advancedConfig: PropTypes.instanceOf(Object),
};

export { BasicData };
export default BasicData;
