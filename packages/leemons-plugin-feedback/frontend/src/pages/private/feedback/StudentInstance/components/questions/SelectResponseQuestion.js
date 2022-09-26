import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { useStore } from '@common';
import QuestionButtons from '@feedback/pages/private/feedback/StudentInstance/components/questions/QuestionButtons';

export const Styles = createStyles((theme) => ({
  response: {
    cursor: 'pointer',
    padding: `${theme.spacing[4]}px ${theme.spacing[5]}px`,
    border: `1px solid ${theme.colors.ui01}`,
    marginBottom: theme.spacing[2],
    borderRadius: 4,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  responseActive: {
    borderColor: theme.colors.interactive01d,
    backgroundColor: theme.colors.interactive01v1,
  },
}));

function SelectResponseQuestion(props) {
  const { classes, cx } = Styles();
  const { question, multi } = props;
  const [store, render] = useStore({
    value: [],
  });

  function onSelect(value) {
    if (multi) {
      const index = store.value.indexOf(value);
      if (index >= 0) {
        store.value.splice(index, 1);
      } else if (store.value.length < question.properties.maxResponses) {
        store.value.push(value);
      }
    } else {
      const index = store.value.indexOf(value);
      if (index >= 0) {
        store.value = [];
      } else {
        store.value[0] = value;
      }
    }
    render();
  }

  return (
    <Box>
      {question.properties.responses.map(({ value }, index) => (
        <Box
          key={index}
          className={cx(
            classes.response,
            store.value.includes(index) ? classes.responseActive : null
          )}
          onClick={() => {
            onSelect(index);
          }}
        >
          {value.response}
        </Box>
      ))}
      <QuestionButtons value={multi ? store.value : store.value[0]} {...props} />
    </Box>
  );
}

SelectResponseQuestion.propTypes = {
  question: PropTypes.any,
  multi: PropTypes.boolean,
};

export default SelectResponseQuestion;
