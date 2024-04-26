import React from 'react';
import PropTypes from 'prop-types';
import { map, noop } from 'lodash';
import { Controller } from 'react-hook-form';
import {
  ActionButton,
  Alert,
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  Stack,
  TableInput,
  Textarea,
  DropdownButton,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { AddCircleIcon, EditWriteIcon, DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { useStore } from '@common';
import { getQuestionForTable } from '@feedback/helpers/getQuestionForTable';
import DetailQuestionForm from '@feedback/pages/private/feedback/Detail/components/DetailQuestionForm';
import { useLayout } from '@layout/context';
import ImagePicker from '@leebrary/components/ImagePicker';

export default function DetailQuestions({
  t,
  form,
  store = {},
  stepName,
  scrollRef,
  onPrev = noop,
  onSave = noop,
  onPublish = noop,
  onAssign = noop,
}) {
  const [qStore, qRender] = useStore({
    newQuestion: false,
    isDirty: false,
    questionChanged: 1,
  });

  const { openDeleteConfirmationModal } = useLayout();
  const formValues = form.watch();
  const { questions } = formValues;

  function addQuestion() {
    qStore.newQuestion = true;
    qStore.questionChanged++;
    qRender();
  }

  function onCancel() {
    qStore.newQuestion = false;
    qStore.questionIndex = null;
    qStore.question = null;
    qStore.questionChanged++;
    qRender();
  }

  function onSaveQuestion(question) {
    const currentQuestions = form.getValues('questions') || [];
    if (qStore.questionIndex !== null && qStore.questionIndex >= 0) {
      currentQuestions[qStore.questionIndex] = question;
    } else {
      currentQuestions.push(question);
    }
    form.setValue('questions', currentQuestions);
    qStore.questionChanged++;
    qRender();
    onCancel();
  }

  function editQuestion(index) {
    qStore.questionIndex = index;
    qStore.questionChanged++;
    qStore.question = (form.getValues('questions') || [])[index];
    qRender();
  }

  function deleteQuestion(index) {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        const newQuestions = form.getValues('questions') || [];
        newQuestions.splice(index, 1);
        form.setValue('questions', newQuestions);
        qStore.questionChanged++;
        qRender();
      },
    })();
  }

  const questionsForTable = React.useMemo(
    () =>
      map(questions, (question, i) => ({
        ...getQuestionForTable(question, t),
        goodQuestion: question,
        actions: (
          <Stack justifyContent="end" fullWidth>
            <ActionButton
              icon={<EditWriteIcon width={18} height={18} />}
              onClick={() => editQuestion(i)}
            />
            <ActionButton
              icon={<DeleteBinIcon width={18} height={18} />}
              onClick={() => deleteQuestion(i)}
            />
          </Stack>
        ),
      })),
    [qStore.questionChanged]
  );

  function tryHandler(handler = noop) {
    qStore.isDirty = true;
    qStore.trySend = true;
    qRender();
    form.handleSubmit(() => {
      handler();
    })();
  }

  const showQuestionForm = qStore.newQuestion || qStore.question;

  if (showQuestionForm) {
    return (
      <DetailQuestionForm
        t={t}
        isPublished={formValues.published}
        onSaveQuestion={onSaveQuestion}
        defaultValues={qStore.newQuestion ? {} : qStore.question}
        onCancel={onCancel}
        onSave={onSave}
        store={store}
      />
    );
  }

  const tableHeaders = [
    {
      Header: t('questionLabel'),
      accessor: 'question',
      className: 'text-left',
      editable: false,
    },
    {
      Header: t('responsesLabel'),
      accessor: 'responses',
      className: 'text-left',
      editable: false,
    },
    {
      Header: t('typeLabel'),
      accessor: 'type',
      className: 'text-left',
      editable: false,
    },
    {
      Header: t('actionsHeader'),
      accessor: 'actions',
      editable: false,
    },
  ];

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
                  onClick={() => tryHandler(onSave)}
                  disabled={store.saving}
                  loading={store.saving === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}
              <DropdownButton
                chevronUp
                width="auto"
                data={[
                  { label: t('publish'), onClick: () => tryHandler(onPublish) },
                  { label: t('publishAndAssign'), onClick: () => tryHandler(onAssign) },
                ]}
                loading={store.saving === 'publish'}
                disabled={store.saving}
              >
                {t('finish')}
              </DropdownButton>
            </>
          }
        />
      }
    >
      <ContextContainer title={t('questions')}>
        <Controller
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <InputWrapper label={t('featuredImage')}>
              <ImagePicker required error={form.formState.errors.featuredImage} {...field} />
            </InputWrapper>
          )}
        />

        <Controller
          control={form.control}
          name="introductoryText"
          rules={{ required: t('introductoryTextRequired') }}
          render={({ field }) => (
            <TextEditorInput
              required
              error={qStore.isDirty ? form.formState.errors.introductoryText : null}
              editorStyles={{ minHeight: '96px' }}
              label={t('introductoryText')}
              {...field}
            />
          )}
        />

        <Controller
          control={form.control}
          name="thanksMessage"
          rules={{ required: t('thanksMessageRequired') }}
          render={({ field }) => (
            <Textarea
              required
              error={qStore.isDirty ? form.formState.errors.thanksMessage : null}
              minRows={3}
              label={t('thanksMessage')}
              {...field}
            />
          )}
        />

        {questions && questions.length ? (
          <TableInput
            labels={{}}
            canAdd={false}
            removable={false}
            editable={false}
            columns={tableHeaders}
            data={questionsForTable}
            onChange={(data) => {
              form.setValue('questions', map(data, 'goodQuestion'));
            }}
          />
        ) : null}
        <Box>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={addQuestion}>
            {t('addQuestion')}
          </Button>
        </Box>
        {qStore.trySend && form.formState.errors.questions ? (
          <Alert severity="error" closeable={false}>
            {form.formState.errors.questions?.message}
          </Alert>
        ) : null}
        <Box></Box>
      </ContextContainer>
    </TotalLayoutStepContainer>
  );
}

DetailQuestions.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  store: PropTypes.object,
  stepName: PropTypes.string,
  scrollRef: PropTypes.object,
  onPrev: PropTypes.func,
  onPublish: PropTypes.func,
  onSave: PropTypes.func,
  onAssign: PropTypes.func,
};
