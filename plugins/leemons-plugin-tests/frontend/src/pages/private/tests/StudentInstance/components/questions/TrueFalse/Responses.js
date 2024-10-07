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

  const getAnswerStyles = (theme, choiceValue) => {
    const chosenValue = store.questionResponses[question.id].properties.response;
    const isSelected = chosenValue === choiceValue;

    if (store.viewMode) {
      if (isSelected) {
        return {
          border: `2px solid ${theme.other.global.content.color.tertiary.default}`,
        };
      } else {
        return {
          border: `1px solid${theme.other.global.border.color.line.subtle}`,
        };
      }
    }

    if (isSelected) {
      return {
        border: `2px solid ${theme.other.global.content.color.tertiary.default}`,
      };
    }

    return {
      border: `1px solid${theme.other.global.border.color.line.subtle}`,
    };
  };

  return (
    <Stack fullWidth justifyContent="space-between" alignItems="center" gap={6}>
      <Box
        className={classes.button}
        sx={(theme) => ({
          ...getAnswerStyles(theme, true),
        })}
        onClick={() => {
          if (!store.viewMode) markResponse(true);
        }}
      >
        <Box>🌎 VERDADERO</Box>
      </Box>

      <Box
        className={classes.button}
        sx={(theme) => ({
          ...getAnswerStyles(theme, false),
        })}
        onClick={() => {
          if (!store.viewMode) markResponse(false);
        }}
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
  isPreviewMode: PropTypes.bool,
};

export default Responses;
export { Responses };
