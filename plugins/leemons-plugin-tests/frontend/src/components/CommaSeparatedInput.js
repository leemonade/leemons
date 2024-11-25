import { useState } from 'react';

import { TextInput, InputWrapper, ActionButton, Stack, Textarea } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import prefixPN from '@tests/helpers/prefixPN';

function CommaSeparatedInput({ onAdd, placeholder, label, useTextArea, unique }) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail.questionCategories'));
  const [value, setValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault?.();

      const values = value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      if (values.length > 0) {
        const finalValues = unique ? [...new Set(values)] : values;
        onAdd(finalValues);
        setValue('');
      }
    }
  };

  const handleChange = (value) => {
    setValue(value);
  };

  return (
    <InputWrapper label={label}>
      <Stack spacing={2}>
        {useTextArea ? (
          <Textarea
            sx={{ width: '85%' }}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t('addCategoriesSeperatedByComma')}
          />
        ) : (
          <TextInput
            sx={{ width: '85%' }}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t('addCategoriesSeperatedByComma')}
          />
        )}

        <ActionButton
          icon={<AddCircleIcon width={24} height={24} />}
          variant="link"
          onClick={() => {
            handleKeyDown({ key: 'Enter' });
          }}
        />
      </Stack>
    </InputWrapper>
  );
}

CommaSeparatedInput.propTypes = {
  onAdd: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  useTextArea: PropTypes.bool,
  unique: PropTypes.bool,
};

export default CommaSeparatedInput;
