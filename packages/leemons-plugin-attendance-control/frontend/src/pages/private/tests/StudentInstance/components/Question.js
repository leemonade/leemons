import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import MonoResponse from './questions/MonoResponse';
import Map from './questions/Map';
import QuestionHeader from './QuestionHeader';
import QuestionValue from './QuestionValue';

export default function Question(props) {
  const { classes, cx, store, render, index } = props;
  let child = null;
  if (props.question.type === 'mono-response') {
    child = <MonoResponse {...props} />;
  }
  if (props.question.type === 'map') {
    child = <Map {...props} />;
  }
  React.useEffect(() => {
    if (!store.questionMax || store.questionMax < index) {
      store.questionMax = index;
      render();
    }
  }, [index]);

  let className = cx(classes.loremIpsum, classes.limitedWidthStep);
  if (store.embedded) {
    className = cx(className, classes.loremIpsumEmbedded);
  }

  return (
    <Box className={className}>
      <QuestionHeader {...props} />
      <QuestionValue {...props} />
      {child}
    </Box>
  );
}

Question.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  question: PropTypes.any,
  render: PropTypes.func,
  index: PropTypes.number,
};
