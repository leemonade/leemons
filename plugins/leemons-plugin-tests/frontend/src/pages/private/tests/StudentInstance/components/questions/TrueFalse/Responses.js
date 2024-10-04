import React from 'react';

import { Box, Stack } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import useResponsesStyles from './Responses.styles';

function Responses(props) {
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

  // TODO Paola: Integrate viewMode or however it is called

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
        onClick={() => markResponse(true)}
      >
        <Box>🌎 VERDADERO</Box>
      </Box>

      <Box
        className={classes.button}
        sx={(theme) => ({
          border:
            store.questionResponses?.[question.id]?.properties?.response === false
              ? `2px solid ${theme.other.global.content.color.tertiary.default}`
              : `1px solid${theme.other.global.border.color.line.subtle}`,
        })}
        onClick={() => markResponse(false)}
      >
        <Box>🌎 FALSO</Box>
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
};

export default Responses;
export { Responses };
