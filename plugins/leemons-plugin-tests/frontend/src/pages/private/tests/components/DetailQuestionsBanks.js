import {
  ActionButton,
  Alert,
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  Pager,
  Paragraph,
  Radio,
  Stack,
  Table,
  Title,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import _, { find } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { listQuestionsBanksRequest } from '../../../../request';

export default function DetailQuestionsBanks({ form, t, onNext, onPrev }) {
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [isDirty, setIsDirty] = React.useState(false);
  const [store, render] = useStore({
    loading: true,
    page: 0,
    size: 10,
  });
  const questionBank = form.watch('questionBank');
  const subjects = form.watch('subjects');

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['questionBank']);
    if (formGood) {
      onNext();
    }
  }

  async function listQuestionsBanks() {
    try {
      const { data } = await listQuestionsBanksRequest({
        page: store.page,
        size: store.size,
        published: true,
        subjects: _.map(subjects, 'subject'),
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

  const tableHeaders = React.useMemo(
    () => [
      {
        Header: ' ',
        accessor: 'radio',
        className: 'text-left',
      },
      {
        Header: t('nameHeader'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('nQuestionsHeader'),
        accessor: 'nQuestions',
        className: 'text-right',
      },
      {
        Header: t('levelHeader'),
        accessor: 'level',
        className: 'text-right',
      },
      {
        Header: t('actionsHeader'),
        accessor: 'actions',
        className: 'text-right',
      },
    ],
    [t]
  );

  const tableItems = React.useMemo(
    () =>
      store.pagination
        ? _.map(store.pagination.items, (item) => ({
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
              <Box style={{ textAlign: 'right', width: '100%' }}>
                <ActionButton
                  as={Link}
                  target="_blank"
                  to={`/private/tests/questions-banks/${item.id}`}
                  tooltip={t('view')}
                  icon={<ExpandDiagonalIcon />}
                />
              </Box>
            ),
          }))
        : [],
    [t, store.pagination, questionBank]
  );

  return (
    <ContextContainer divided>
      <ContextContainer>
        <Title order={4}>{t('questionsBanks')}</Title>

        <Stack justifyContent="space-between" alignItems="center" fullWidth>
          <Box>
            <Paragraph>{t('questionsBanksDescription')}</Paragraph>
          </Box>
          <Box>
            <ContextContainer alignItems="flex-end">
              <InputWrapper error={isDirty ? form.formState.errors.questionBank : null} />
            </ContextContainer>
          </Box>
        </Stack>

        {tableItems.length ? (
          <>
            <Box>
              <Table columns={tableHeaders} data={tableItems} />
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
      <Stack fullWidth justifyContent="space-between">
        <Box>
          <Button
            compact
            variant="light"
            leftIcon={<ChevLeftIcon height={20} width={20} />}
            onClick={onPrev}
          >
            {t('previous')}
          </Button>
        </Box>
        <Box>
          <Button onClick={next}>{t('continue')}</Button>
        </Box>
      </Stack>
    </ContextContainer>
  );
}

DetailQuestionsBanks.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
};
