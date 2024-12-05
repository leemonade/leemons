import { useMemo } from 'react';

import { Select } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import prefixPN from '@tests/helpers/prefixPN';
import { getQuestionTypesForSelect } from '@tests/pages/private/questions-banks/questionConstants';

function QuestionTypeSelect({ required, placeholder, label, error, skip = [], ...field }) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const questionTypesSelectData = useMemo(() => getQuestionTypesForSelect(t, skip), [t, skip]);

  return (
    <Select
      required={required}
      placeholder={placeholder ?? t('typePlaceholder')}
      data={questionTypesSelectData}
      error={error}
      label={label ?? t('typeLabel')}
      {...field}
    />
  );
}

QuestionTypeSelect.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  skip: PropTypes.arrayOf(PropTypes.string),
};

export { QuestionTypeSelect };
