import {
  ActionButton,
  Alert,
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  Pager,
  Radio,
  Stack,
  Table,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  Select,
  Modal,
  Text,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon, OpenIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import _, { find } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDataForSubjectPicker } from '@academic-portfolio/components/SubjectPicker/hooks/useDataForSubjectPicker';
import { Controller } from 'react-hook-form';
import useUserAgents from '@users/hooks/useUserAgents';
import { listQuestionsBanksRequest } from '../../../../request';

function checkIsOwner(userAgents, item) {
  return userAgents.some((userAgent) => userAgent === item.asset?.fromUserAgent);
}

export default function DetailQuestionsBanks({
  form,
  t,
  stepName,
  scrollRef,
  onNext,
  onPrev,
  onSave,
  setIsNewQBankSelected,
}) {
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [isDirty, setIsDirty] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [newQuestionBankId, setNewQuestionBankId] = React.useState(null);
  const [store, render] = useStore({
    loading: true,
    page: 0,
    size: 100,
  });
  const [selectedSubject, setSelectedSubject] = React.useState(null);
  const userAgents = useUserAgents();

  const formValues = form.watch();

  const questionBank = form.watch('questionBank');
  const subjects = form.watch('subjects');
  const subjectsRaw = form.watch('subjectsRaw');
  const courseIdRaw = subjectsRaw?.[0]?.courseId || '';
  const programIdRaw = subjectsRaw?.[0]?.programId || '';
  const idRaw = subjectsRaw?.[0]?.id || '';
  const {
    programs,
    courses,
    subjects: allSubjects,
  } = useDataForSubjectPicker({
    subjects: subjects || [],
    control: form.control,
  });
  const validate = async () => form.trigger(['questionBank']);

  async function handleOnNext() {
    setIsDirty(true);
    if (await validate()) {
      onNext();
    }
  }

  async function handleOnSave() {
    setIsDirty(true);
    if (await validate()) {
      onSave();
    }
  }

  async function listQuestionsBanks() {
    let subjetsToUse = [];
    if (subjects.length >= 1) {
      subjetsToUse = subjects;
    } else if (selectedSubject) {
      subjetsToUse = [selectedSubject];
    }
    try {
      const { data } = await listQuestionsBanksRequest({
        includeAgnosticsQB: true,
        page: store.page,
        size: store.size,
        published: true,
        withAssets: true,
        subjects: _.map(subjetsToUse, (subject) =>
          _.isString(subject) ? subject : subject.subject
        ),
      });
      if (questionBank) {
        const found = find(data.items, { id: questionBank });
        if (!found) {
          form.setValue('questionBank', null);
          form.setValue('filters', null);
          form.setValue('questions', []);
        }
      }
      return data;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      return null;
    }
  }

  async function load() {
    store.loading = true;
    render();
    store.pagination = await listQuestionsBanks();
    store.loading = false;
    render();
  }

  async function onPageChange(page) {
    store.page = page;
    await load();
  }

  async function onPageSizeChange(size) {
    store.size = size;
    await load();
  }

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    if (selectedSubject) {
      load();
    }
  }, [selectedSubject]);

  const tableColumns = React.useMemo(
    () => [
      {
        Header: ' ',
        accessor: 'radio',
        style: { width: 32 },
      },
      {
        Header: t('nameHeader'),
        accessor: 'name',
        style: { width: '350px' },
      },
      {
        Header: t('nQuestionsHeader'),
        accessor: 'nQuestions',
        style: { textAlign: 'center' },
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => (
          <Stack justifyContent="center" fullWidth>
            {value}
          </Stack>
        ),
      },
      /*
      {
        Header: t('levelHeader'),
        accessor: 'level',
        style: { width: 120, textAlign: 'center' },
        Cell: ({ value }) => (
          <Stack justifyContent="center" fullWidth>
            {value}
          </Stack>
        ),
      },
      */
      {
        Header: t('actionsHeader'),
        accessor: 'actions',
        style: { textAlign: 'center' },
      },
    ],
    [t]
  );

  const tableItems = React.useMemo(() => {
    if (!store.pagination) {
      return [];
    }
    return _.map(store.pagination.items, (item) => ({
      ...item,
      radio: (
        <Radio
          checked={item.id === questionBank}
          onChange={(checked) => {
            if (checked) {
              if (questionBank && questionBank !== item.id) {
                setNewQuestionBankId(item.id);
                setIsNewQBankSelected(true);
                setModalOpen(true);
              } else {
                form.setValue('questionBank', item.id);
                form.setValue('filters', null);
                form.setValue('questions', []);
              }
            }
          }}
        />
      ),
      actions: (
        <Stack justifyContent="center" fullWidth>
          {checkIsOwner(userAgents, item) && (
            <ActionButton
              as={Link}
              target="_blank"
              to={`/private/tests/questions-banks/${item.id}`}
              tooltip={t('view')}
              icon={<OpenIcon width={20} height={20} color={'#2F463F'} />}
            />
          )}
        </Stack>
      ),
    }));
  }, [t, store.pagination, questionBank]);

  React.useEffect(() => {
    if (subjectsRaw?.length > 0 && formValues.subjects?.length > 0) {
      form.setValue('program', programIdRaw);
      form.setValue('course', courseIdRaw);
      form.setValue('subject', idRaw);
    }
  }, [subjectsRaw, programs]);

  return (
    <>
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
                    onClick={handleOnSave}
                    disabled={store.saving}
                    loading={store.saving === 'draft'}
                  >
                    {t('saveDraft')}
                  </Button>
                ) : null}

                <Button
                  rightIcon={<ChevRightIcon height={20} width={20} />}
                  onClick={handleOnNext}
                  disabled={store.saving}
                  loading={store.saving === 'publish'}
                >
                  {t('next')}
                </Button>
              </>
            }
          />
        }
      >
        <Box>
          <ContextContainer title={t('questionsBanksDescription')}>
            <InputWrapper error={isDirty ? form.formState.errors.questionBank : null} />
            <Stack
              fullWidth
              style={{
                width: '100%',
                display: 'flex',
                gap: 16,
                alignItems: 'end',
              }}
            >
              <Box>
                <Controller
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <Select
                      {...field}
                      cleanOnMissingValue
                      defaultValue={programIdRaw}
                      label={t('programLabel')}
                      placeholder={t('programPlaceholder')}
                      data={programs}
                      disabled={!programs?.length || !!subjects?.length}
                    />
                  )}
                />
              </Box>
              {courses !== null && (
                <Box>
                  <Controller
                    control={form.control}
                    name="course"
                    shouldUnregister
                    render={({ field }) => (
                      <Select
                        {...field}
                        cleanOnMissingValue
                        defaultValue={courseIdRaw}
                        label={t('courseLabel')}
                        placeholder={t('programPlaceholder')}
                        data={courses}
                        disabled={!!subjects?.length}
                      />
                    )}
                  />
                </Box>
              )}
              <Box>
                <Controller
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <Select
                      {...field}
                      cleanOnMissingValue
                      defaultValue={idRaw}
                      label={t('subjectLabel')}
                      placeholder={t('programPlaceholder')}
                      data={allSubjects}
                      disabled={!!subjects?.length}
                      onChange={(selected) => {
                        setSelectedSubject(selected);
                        field.onChange(selected);
                      }}
                    />
                  )}
                />
              </Box>
            </Stack>
            {tableItems.length ? (
              <>
                <Box>
                  <Table columns={tableColumns} data={tableItems} />
                </Box>
                {store.pagination?.totalPages > 1 && (
                  <Stack fullWidth justifyContent="center">
                    <Pager
                      page={store.pagination?.page || 0}
                      totalPages={store.pagination?.totalPages || 0}
                      size={store.size}
                      withSize={false}
                      onChange={(val) => onPageChange(val - 1)}
                      onSizeChange={onPageSizeChange}
                      labels={{
                        show: t('show'),
                        goTo: t('goTo'),
                      }}
                    />
                  </Stack>
                )}
              </>
            ) : (
              <>
                {!store.loading ? (
                  <Alert severity="error" closeable={false}>
                    {t('noQuestionBanks')}
                  </Alert>
                ) : null}
              </>
            )}
          </ContextContainer>
        </Box>
      </TotalLayoutStepContainer>
      <>
        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={t('changeQBankTitle')}
          size={'lg'}
        >
          <ContextContainer>
            <Box>
              <Text>{t('changeQBankDescription')}</Text>
            </Box>
            <Stack fullWidth justifyContent="end" spacing={5}>
              <Button variant="link" onClick={() => setModalOpen(false)}>
                {t('changeQBankCancel')}
              </Button>

              <Button
                onClick={() => {
                  form.setValue('questionBank', newQuestionBankId);
                  form.setValue('filters', null);
                  form.setValue('questions', []);
                  setModalOpen(false);
                }}
              >
                {t('changeQBankConfirm')}
              </Button>
            </Stack>
          </ContextContainer>
        </Modal>
      </>
    </>
  );
}

DetailQuestionsBanks.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
  scrollRef: PropTypes.any,
  stepName: PropTypes.string,
  setIsNewQBankSelected: PropTypes.func,
};
