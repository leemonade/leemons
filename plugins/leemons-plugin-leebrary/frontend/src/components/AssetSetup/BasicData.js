/* eslint-disable no-param-reassign */
import React, { useMemo, useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ContextContainer, TotalLayoutStepContainer, InputWrapper } from '@bubbles-ui/components';
import { TagsAutocomplete, unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import LibraryContext from '../../context/LibraryContext';
import prefixPN from '../../helpers/prefixPN';
import { AssetFormInput } from '../AssetFormInput';

const BasicData = ({
  advancedConfig,
  editing,
  isLoading,
  categoryKey,
  Footer,
  ContentExtraFields,
}) => {
  const form = useFormContext();
  const formTags = useWatch({ control: form.control, name: 'tags' });
  const { category } = useContext(LibraryContext);
  const [t, translations] = useTranslateLoader(prefixPN('assetSetup'));

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
    form.setValue('tags', val);
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
        ContentExtraFields={ContentExtraFields}
        editing={editing}
      >
        <ContextContainer spacing={2}>
          <InputWrapper label={t('basicData.labels.tags')}>
            <TagsAutocomplete
              pluginName="leebrary"
              type={prefixPN('')}
              labels={{ addButton: formLabels?.labels?.addTag }}
              placeholder={formLabels?.placeholders?.tagsInput}
              value={formTags}
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
  categoryKey: PropTypes.string,
  Footer: PropTypes.element,
  ContentExtraFields: PropTypes.element,
};

export { BasicData };
export default BasicData;
