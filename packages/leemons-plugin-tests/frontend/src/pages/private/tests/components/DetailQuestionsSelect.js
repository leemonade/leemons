import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Alert,
  Box,
  Button,
  Checkbox,
  ContextContainer,
  InputWrapper,
  Paragraph,
  Stack,
  Table,
  TableInput,
  Title,
} from '@bubbles-ui/components';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { Link } from 'react-router-dom';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { getQuestionForTable } from '../../../../helpers/getQuestionForTable';

export default function DetailQuestionsSelect({
  questionBank,
  back,
  questions,
  t,
  onChange,
  next,
  value = [],
  reorderMode,
  error,
}) {
  const [t2] = useTranslateLoader(prefixPN('questionsBanksDetail'));

  const tableHeaders = React.useMemo(() => {
    let result = [];
    if (!reorderMode) {
      result.push({
        Header: (
          <Box>
            <Checkbox
              checked={value.length === questions.length}
              onChange={() => {
                const allCheck = value.length === questions.length;
                if (allCheck) {
                  onChange([]);
                } else {
                  onChange(questions.map((q) => q.id));
                }
              }}
            />
          </Box>
        ),
        accessor: 'check',
        className: 'text-left',
      });
    }
    result = result.concat([
      {
        Header: t('questionLabel'),
        accessor: 'question',
        className: 'text-left',
      },
      {
        Header: t('responsesLabel'),
        accessor: 'responses',
        className: 'text-left',
      },
      {
        Header: t('typeLabel'),
        accessor: 'type',
        className: 'text-left',
      },
      {
        Header: t('actionsHeader'),
        accessor: 'actions',
      },
    ]);
    return result;
  }, [t, reorderMode]);

  const tableItems = React.useMemo(
    () =>
      questions && questions.length
        ? _.map(questions, (item) => ({
            ...getQuestionForTable(item, t2),
            check: (
              <Checkbox
                checked={value.includes(item.id)}
                onChange={() => {
                  const index = value.indexOf(item.id);
                  if (index >= 0) {
                    value.splice(index, 1);
                  } else {
                    value.push(item.id);
                  }

                  onChange(value);
                }}
              />
            ),
            actions: (
              <Box style={{ textAlign: 'right', width: '100%' }}>
                <ActionButton
                  as={Link}
                  to={`/private/tests/${item.id}`}
                  tooltip={t('view')}
                  icon={<ExpandDiagonalIcon />}
                />
              </Box>
            ),
          }))
        : [],
    [t, questions]
  );

  let tableComponent = <Table columns={tableHeaders} data={tableItems} />;
  if (reorderMode) {
    tableComponent = (
      <TableInput disabled forceSortable labels={{}} columns={tableHeaders} data={tableItems} />
    );
  }

  return (
    <ContextContainer>
      {questions && questions.length > 0 ? (
        <Title order={6}>
          {t('nQuestions', { n: reorderMode ? value.length : questions.length })}
        </Title>
      ) : null}

      <Stack justifyContent="space-between">
        <Box>
          <Paragraph>
            {t(reorderMode ? 'reorderQuestionsDescription' : 'selectQuestionDescription')}
          </Paragraph>
          <Box>
            <Button variant="link" onClick={back}>
              {t('returnFilters')}
            </Button>
          </Box>
        </Box>
        <Box>
          {questions && questions.length > 0 ? (
            <ContextContainer>
              <Box>
                <Button onClick={next}>
                  {t(reorderMode ? 'continue' : 'assignSelectedQuestions')}
                </Button>
              </Box>
              <InputWrapper error={error} />
            </ContextContainer>
          ) : null}
        </Box>
      </Stack>
      {questions && questions.length > 0 ? (
        <Box>{tableComponent}</Box>
      ) : (
        <Box>
          <Alert closeable={false} severity="error">
            {t('selectQuestionNothingToSelect')}
          </Alert>
        </Box>
      )}
    </ContextContainer>
  );
}

DetailQuestionsSelect.propTypes = {
  t: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  questionBank: PropTypes.object,
  questions: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
  reorderMode: PropTypes.bool,
};
