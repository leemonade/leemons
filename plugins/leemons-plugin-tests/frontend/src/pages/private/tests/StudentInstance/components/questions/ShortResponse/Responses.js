import { TextInput, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import useResponsesStyles from './Responses.styles';

import prefixPN from '@tests/helpers/prefixPN';

function Responses(props) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail.questionLabels'));
  const { classes } = useResponsesStyles();

  const { question, store, render } = props;

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

  return (
    <Box className={classes.textInput}>
      <TextInput
        placeholder={t('answerPlaceholder')}
        value={store.questionResponses?.[question.id]?.properties?.response}
        onChange={(value) => {
          if (!store.viewMode) markResponse(value);
        }}
      />
    </Box>
  );
}

Responses.propTypes = {
  store: PropTypes.any,
  question: PropTypes.any,
  render: PropTypes.func,
};

export default Responses;
export { Responses };
