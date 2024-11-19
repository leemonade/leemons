import { useState } from 'react';

import { TextInput, InputWrapper, ActionButton, Stack } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import prefixPN from '@tests/helpers/prefixPN';

function CommaSeparatedInput({ onAdd, placeholder, label }) {
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
        onAdd(values);
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
        <TextInput
          sx={{ width: '85%' }}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('addCategoriesSeperatedByComma')}
        />

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
};

export default CommaSeparatedInput;
