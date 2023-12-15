/* eslint-disable no-param-reassign */
import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ContextContainer, TotalLayoutStepContainer, InputWrapper } from '@bubbles-ui/components';
import { TagsAutocomplete, unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '../../helpers/prefixPN';
import { prepareAsset } from '../../helpers/prepareAsset';
// eslint-disable-next-line import/no-cycle
import { BasicDataLibraryForm } from '../LibraryForm/BasicDataLibraryForm';

const BasicData = ({ file, advancedConfig, asset: assetProp, categoryId, editing, ...props }) => {
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [loading] = useState(false);
  const [tags, setTags] = useState(assetProp?.tags || []);

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

  const preparedAsset = useMemo(() => {
    if (assetProp) {
      return prepareAsset(assetProp);
    }
    return {};
  }, [assetProp]);

  // ··············································································
  // FORM HANDLERS

  const handleOnTagsChange = (val) => {
    setTags(val);
  };

  return (
    <TotalLayoutStepContainer>
      <BasicDataLibraryForm
        {...props}
        {...formLabels}
        advancedConfig={advancedConfig}
        loading={loading}
        asset={{ ...assetProp, file, cover: preparedAsset.cover }}
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
