import { Box, Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import useResponsesStyles from './Responses.styles';

import prefixPN from '@tests/helpers/prefixPN';

function Responses(props) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail.questionLabels.trueFalse'));
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
    <Stack fullWidth justifyContent="space-between" alignItems="center" gap={6}>
      <Box
        className={classes.button}
        sx={(theme) => ({
          border:
            store.questionResponses?.[question.id]?.properties?.response === true
              ? `2px solid ${theme.other.global.content.color.tertiary.default}`
              : `1px solid${theme.other.global.border.color.line.subtle}`,
        })}
        onClick={() => {
          if (!store.viewMode) markResponse(true);
        }}
      >
        <Box>{t('true')}</Box>
      </Box>

      <Box
        className={classes.button}
        sx={(theme) => ({
          border:
            store.questionResponses?.[question.id]?.properties?.response === false
              ? `2px solid ${theme.other.global.content.color.tertiary.default}`
              : `1px solid${theme.other.global.border.color.line.subtle}`,
        })}
        onClick={() => {
          if (!store.viewMode) markResponse(false);
        }}
      >
        <Box>{t('false')}</Box>
      </Box>
    </Stack>
  );
}

Responses.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  render: PropTypes.func,
  isPreviewMode: PropTypes.bool,
};

export default Responses;
export { Responses };
