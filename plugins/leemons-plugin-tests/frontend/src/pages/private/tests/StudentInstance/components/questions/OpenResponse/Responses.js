import { useMemo } from 'react';

import { Textarea, Stack, Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

function Responses(props) {
  const { question, store, render, t } = props;

  async function markResponse(value) {
    if (!store.questionResponses[question.id].properties) {
      store.questionResponses[question.id].properties = {};
    }
    if (store.questionResponses[question.id].properties.response === value) {
      delete store.questionResponses[question.id].properties.response;
    } else {
      store.questionResponses[question.id].properties.response = value;
    }

    render();
  }

  const lengthRequirements = useMemo(() => {
    const min = question.openResponseProperties.minCharacters;
    const max = question.openResponseProperties.maxCharacters;
    if (!min && !max) return '';
    if (min && max) return t('questionLabels.openResponse.minAndMaxLengthCharacters', { min, max });
    if (min && !max) return t('questionLabels.openResponse.minLengthCharacters', { number: min });
    if (!min && max) return t('questionLabels.openResponse.maxLengthCharacters', { number: max });
  }, [question.openResponseProperties, t]);

  return (
    <Stack fullWidth>
      <Box>
        <Textarea
          placeholder={t('questionLabels.answerPlaceholder')}
          value={store.questionResponses?.[question.id]?.properties?.response}
          onChange={(value) => {
            if (!store.viewMode) markResponse(value);
          }}
          showCounter={
            !!question.openResponseProperties.maxCharacters ||
            !!question.openResponseProperties.minCharacters
          }
          maxLength={question.openResponseProperties.maxCharacters}
          help={lengthRequirements}
          counterLabels={{ plural: '', singular: '' }}
        />
      </Box>
    </Stack>
  );
}

Responses.propTypes = {
  store: PropTypes.any,
  question: PropTypes.any,
  render: PropTypes.func,
  t: PropTypes.func,
};

export default Responses;
export { Responses };
