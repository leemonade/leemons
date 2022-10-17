/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, Text } from '@bubbles-ui/components';
import { useStore } from '@common';
import QuestionButtons from '@feedback/pages/private/feedback/StudentInstance/components/questions/QuestionButtons';
import { LeebraryImage } from '@leebrary/components';
import { isArray, isNil } from 'lodash';

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
  questionResponseImageContainer: {
    border: '1px solid',
    borderColor: theme.colors.ui01,
    borderRadius: 4,
    overflow: 'hidden',
    cursor: 'pointer',
    padding: theme.spacing[3],
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
  },
  questionResponseImageTextContent: {
    paddingTop: theme.spacing[3],
  },
  questionResponseImageContent: {
    width: '100%',
    position: 'relative',
    paddingBottom: '100%',
  },
  questionResponseImage: {
    width: '100%',
    height: '100%',
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    objectFit: 'contain',
  },
  questionResponsesContainerImages: {
    display: 'grid',
    flexDirection: 'row',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing[3],
  },
}));

function SelectResponseQuestion(props) {
  const { classes, cx } = Styles();
  const { question, multi, defaultValue } = props;
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

  React.useEffect(() => {
    store.value = isNil(defaultValue) ? [] : isArray(defaultValue) ? defaultValue : [defaultValue];
    render();
  }, [defaultValue, question]);

  React.useEffect(() => {
    props.setCurrentValue(store.value);
  }, [store.value?.length]);

  return (
    <Box>
      <Box
        className={question.properties.withImages ? classes.questionResponsesContainerImages : null}
      >
        {question.properties.responses.map(({ value }, index) => {
          if (question.properties.withImages) {
            return (
              <Box
                key={index}
                className={cx(
                  classes.questionResponseImageContainer,
                  store.value.includes(index) ? classes.responseActive : null
                )}
                onClick={() => {
                  onSelect(index);
                }}
              >
                <Box className={classes.questionResponseImageContent}>
                  <LeebraryImage className={classes.questionResponseImage} src={value.image} />
                </Box>
                {value.imageDescription ? (
                  <Box className={classes.questionResponseImageTextContent}>
                    <Text color="primary" role="productive">
                      {value.imageDescription}
                    </Text>
                  </Box>
                ) : null}
              </Box>
            );
          }
          return (
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
          );
        })}
      </Box>
      <QuestionButtons value={multi ? store.value : store.value[0]} {...props} />
    </Box>
  );
}

SelectResponseQuestion.propTypes = {
  question: PropTypes.any,
  multi: PropTypes.boolean,
  defaultValue: PropTypes.any,
  setCurrentValue: PropTypes.func,
};

export default SelectResponseQuestion;
