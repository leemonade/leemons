import React from 'react';
import PropTypes from 'prop-types';
import { ActionButton, Box, Checkbox, Table, TableInput } from '@bubbles-ui/components';
import { keyBy, map } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { Link } from 'react-router-dom';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { getQuestionForTable } from '../../../../helpers/getQuestionForTable';

export default function QuestionsTable({
  questions,
  onChange,
  value = [],
  reorderMode,
  hideCheckbox = false,
}) {
  const [t] = useTranslateLoader(prefixPN('testsEdit'));
  const [t2] = useTranslateLoader(prefixPN('questionsBanksDetail'));

  const tableHeaders = React.useMemo(() => {
    let result = [];
    if (!reorderMode && !hideCheckbox) {
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
        ? map(questions, (item) => ({
            ...getQuestionForTable(item, t2),
            check: (
              <Checkbox
                checked={value ? value.includes(item.id) : false}
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
            actions: () => (
              <Box style={{ textAlign: 'right', width: '100%' }}>
                <ActionButton
                  as={Link}
                  to={`/private/tests/questions-banks/${item.questionBank}?question=${item.id}`}
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
    const itemsById = keyBy(tableItems, 'id');
    const items = map(value, (id) => itemsById[id]);

    tableComponent = (
      <TableInput
        disabled
        forceSortable
        labels={{}}
        columns={tableHeaders}
        data={items}
        onChange={(e) => {
          onChange(e.map((item) => item.id));
        }}
      />
    );
  }

  return tableComponent;
}

QuestionsTable.propTypes = {
  questions: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.array,
  reorderMode: PropTypes.bool,
};
