import React, { useMemo } from 'react';

import PropTypes from 'prop-types';

import useViewModeResponsesStyles from './ViewModeResponses.styles';

import ResponseDetail from '@tests/pages/private/tests/components/ResponseDetail';

function ViewModeResponses(props) {
  const { classes } = useViewModeResponsesStyles();
  const { question, store } = props;

  const response = store.questionResponses[question.id].properties.response;

  const isCorrect = useMemo(
    () => response === question.trueFalseProperties?.isTrue,
    [question, response]
  );

  const responses = [
    {
      label: 'True',
      value: true,
    },
    {
      label: 'False',
      value: false,
    },
  ];

  return <ResponseDetail isCorrect={isCorrect} responses={responses} />;
}

ViewModeResponses.propTypes = {
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

export default ViewModeResponses;
