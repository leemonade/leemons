import React from 'react';

import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { StudentInstanceStyles } from '../pages/private/tests/StudentInstance/StudentInstance.style';
import { TestStyles } from '../pages/private/tests/StudentInstance/TestStyles.style';
import QuestionList from '../pages/private/tests/StudentInstance/components/QuestionList';

import prefixPN from '@tests/helpers/prefixPN';

export default function ViewModeQuestions({ viewMode = true, store: cStore, onReturn }) {
  const [t] = useTranslateLoader(prefixPN('studentInstance'));
  const [store, render] = useStore({
    loading: true,
    idLoaded: '',
    isFirstStep: true,
    currentStep: 0,
    maxNavigatedStep: 0,
    viewMode,
    embedded: true,
  });

  React.useEffect(() => {
    if (cStore) {
      store.instance = cStore.instance;
      store.assignation = cStore.assignation;
      store.questionResponses = cStore.questionResponses;
      store.questionMax = cStore.questionMax;
      store.timestamps = cStore.timestamps;
      store.config = cStore.config;
      store.questionsInfo = cStore.questionsInfo;
      store.questions = cStore.questions;
      store.evaluationSystem = cStore.evaluationSystem;
      store.idLoaded = cStore.idLoaded;
      store.loading = false;
      render();
    }
  }, [cStore]);

  const { classes: styles } = TestStyles({}, { name: 'Tests' });
  const { classes, cx } = StudentInstanceStyles(
    { isFirstStep: store.isFirstStep },
    { name: 'TaskDoing' }
  );

  if (!store.questions) return null;

  return (
    <QuestionList
      classes={classes}
      t={t}
      store={store}
      render={render}
      cx={cx}
      styles={styles}
      onStartQuestions={() => {}}
      prevStep={() => {}}
      nextStep={() => {}}
      goToStep={() => {}}
      saveQuestion={() => {}}
      finishStep={() => {}}
      onReturn={onReturn}
    />
  );
}

ViewModeQuestions.propTypes = {
  store: PropTypes.any,
  onReturn: PropTypes.func,
  viewMode: PropTypes.bool,
};
