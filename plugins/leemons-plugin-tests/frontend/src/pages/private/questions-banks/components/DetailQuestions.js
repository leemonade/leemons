import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Box,
  Stack,
  Alert,
  Button,
  ContextContainer,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { useSearchParams } from '@common/useSearchParams';
import { isLRN } from '@leebrary/helpers/isLRN';
import { ZoneWidgets } from '@widgets/ZoneWidgets';
import { noop } from 'lodash';
import PropTypes from 'prop-types';

import { DetailQuestionsList } from './DetailQuestionsList';
import { GiftImporter } from './gift-import/GiftImporter';

export default function DetailQuestions({
  t,
  form,
  savingAs,
  stepName,
  scrollRef,
  onPrev,
  onPublish,
  onSaveDraft,
  onAddQuestions,
  onEditQuestion,
  onDeleteQuestion,
}) {
  const [saveAttempt, setSaveAttempt] = useState(false);
  const searchParams = useSearchParams();
  const history = useHistory();

  const formValues = form.watch();
  const categories = form.watch('categories');
  const questions = form.watch('questions');

  // FUNCTIONS ························································|

  const processCategories = (categories) => {
    if (!categories) return;
    const categoriesOrderMap = {};
    const processedCategories = categories.map((category, index) => {
      categoriesOrderMap[category.id] = index;
      if (isLRN(category.id)) return { ...category, order: index };
      return { value: category.value, order: index };
    });

    const processedQuestions = form.getValues('questions').map((question) => {
      if (!question.category) return question;
      return { ...question, category: categoriesOrderMap[question.category] };
    });

    form.setValue('categories', processedCategories);
    form.setValue('questions', processedQuestions);
  };

  const onNewQuestion = () => {
    searchParams.delete('questionIndex');
    searchParams.set('createFrom', 'new');
    history.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

  function onSaveQBank(handler = noop) {
    setSaveAttempt(true);
    processCategories(categories);
    // Allow to save if it's a draft or there are questions
    if (!formValues.published || questions?.length) {
      handler();
    }
  }

  const widgets = ({ Component, key, properties }) => (
    <Component {...properties} key={key} form={form} onAddQuestions={onAddQuestions} />
  );

  return (
    <TotalLayoutStepContainer
      stepName={stepName}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          leftZone={
            <Button
              variant="outline"
              leftIcon={<ChevLeftIcon height={20} width={20} />}
              onClick={onPrev}
            >
              {t('previous')}
            </Button>
          }
          rightZone={
            <>
              {!formValues.published ? (
                <Button
                  variant="link"
                  onClick={() => onSaveQBank(onSaveDraft)}
                  disabled={savingAs}
                  loading={savingAs === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}
              <Button
                onClick={() => onSaveQBank(onPublish)}
                disabled={savingAs || !questions?.length}
                loading={savingAs === 'published'}
              >
                {t('publish')}
              </Button>
            </>
          }
        />
      }
    >
      <Box>
        <ContextContainer title={t('questionList')}>
          <Stack justifyContent="space-between">
            <Box>
              <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onNewQuestion}>
                {t('addQuestion')}
              </Button>
            </Box>
            <Box>
              <Stack spacing={2}>
                <GiftImporter onAddQuestions={onAddQuestions} />
                <ZoneWidgets zone="tests.qbank.questions.create">{widgets}</ZoneWidgets>
              </Stack>
            </Box>
          </Stack>

          <DetailQuestionsList
            questions={questions}
            onEditQuestion={onEditQuestion}
            onDeleteQuestion={onDeleteQuestion}
          />

          {saveAttempt && form.formState.errors.questions ? (
            <Alert severity="error" closeable={false}>
              {form.formState.errors.questions?.message}
            </Alert>
          ) : null}
        </ContextContainer>
      </Box>
    </TotalLayoutStepContainer>
  );
}

DetailQuestions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onPublish: PropTypes.func,
  onPrev: PropTypes.func,
  onSaveDraft: PropTypes.func,
  stepName: PropTypes.string,
  scrollRef: PropTypes.object,
  savingAs: PropTypes.string,
  onAddQuestions: PropTypes.func,
  onEditQuestion: PropTypes.func,
  onDeleteQuestion: PropTypes.func,
};
