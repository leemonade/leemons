import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
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
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { ChevLeftIcon, ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
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
        subjects,
      });
      return data;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      return null;
    }
  }

  async function load() {
    store.pagination = await listQuestionsBanks();
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
                onChange={(e) => {
                  if (e.target.checked) {
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
                  to={`/private/tests/questions-banks/${item.id}`}
                  tooltip={t('view')}
                  icon={<ExpandDiagonalIcon />}
                />
              </Box>
            ),
          }))
        : [],
    [t, store.pagination]
  );

  return (
    <ContextContainer divided>
      <ContextContainer>
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

        <Title order={4}>{t('questionsBanks')}</Title>

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
