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
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon, ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import _, { find } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { listQuestionsBanksRequest } from '../../../../request';

export default function DetailQuestionsBanks({
  form,
  t,
  stepName,
  scrollRef,
  onNext,
  onPrev,
  onSave,
}) {
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [isDirty, setIsDirty] = React.useState(false);
  const [store, render] = useStore({
    loading: true,
    page: 0,
    size: 10,
  });
  const formValues = form.watch();
  const questionBank = form.watch('questionBank');
  const subjects = form.watch('subjects');

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
    try {
      const { data } = await listQuestionsBanksRequest({
        page: store.page,
        size: store.size,
        published: true,
        subjects: _.map(subjects, (subject) => (_.isString(subject) ? subject : subject.subject)),
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
      },
      {
        Header: t('nQuestionsHeader'),
        accessor: 'nQuestions',
        style: { width: 150, textAlign: 'center' },
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
        style: { width: 100, textAlign: 'center' },
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
              form.setValue('questionBank', item.id);
              form.setValue('filters', null);
              form.setValue('questions', []);
            }
          }}
        />
      ),
      actions: (
        <Stack justifyContent="center" fullWidth>
          <ActionButton
            as={Link}
            target="_blank"
            to={`/private/tests/questions-banks/${item.id}`}
            tooltip={t('view')}
            icon={<ExpandDiagonalIcon />}
          />
        </Stack>
      ),
    }));
  }, [t, store.pagination, questionBank]);

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
                {t('continue')}
              </Button>
            </>
          }
        />
      }
    >
      <Box>
        <ContextContainer title={t('questionsBanksDescription')}>
          <InputWrapper error={isDirty ? form.formState.errors.questionBank : null} />

          {tableItems.length ? (
            <>
              <Box>
                <Table columns={tableColumns} data={tableItems} />
              </Box>
              <Stack fullWidth justifyContent="center">
                <Pager
                  page={store.pagination?.page || 0}
                  totalPages={store.pagination?.totalPages || 0}
                  size={store.size}
                  withSize={true}
                  onChange={(val) => onPageChange(val - 1)}
                  onSizeChange={onPageSizeChange}
                  labels={{
                    show: t('show'),
                    goTo: t('goTo'),
                  }}
                />
              </Stack>
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
};
