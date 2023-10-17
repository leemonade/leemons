import { ActionButton, Box, Checkbox, Table, TableInput } from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { keyBy, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { getQuestionForTable } from '../../../../helpers/getQuestionForTable';
import { ResultStyles } from '../Result.style';

export default function QuestionsTable({
  questions,
  onChange,
  value = [],
  reorderMode,
  hideOpenIcon,
  withStyle = false,
  hideCheckbox = false,
}) {
  // eslint-disable-next-line prefer-const
  let { classes: styles, cx } = ResultStyles({}, { name: 'QuestionsTable' });
  const [t] = useTranslateLoader(prefixPN('testsEdit'));
  const [t2] = useTranslateLoader(prefixPN('questionsBanksDetail'));

  if (!withStyle) styles = {};

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
        className: cx(styles.tableHeader, styles.firstTableHeader),
      },
      {
        Header: t('responsesLabel'),
        accessor: 'responses',
        className: styles.tableHeader,
      },
      {
        Header: t('typeLabel'),
        accessor: 'type',
        className: styles.tableHeader,
      },
    ]);
    if (!hideOpenIcon) {
      result.push({
        Header: t('actionsHeader'),
        accessor: 'actions',
        className: styles.tableHeader,
      });
    }
    return result;
  }, [t, reorderMode, value]);

  const tableItems = React.useMemo(
    () =>
      questions && questions.length
        ? map(questions, (item) => {
            return {
              ...getQuestionForTable(item, t2, styles),
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
                <Box className={styles.tableCell} style={{ textAlign: 'right', minWidth: '100px' }}>
                  <ActionButton
                    as={Link}
                    target="_blank"
                    to={`/private/tests/questions-banks/${item.questionBank}?question=${item.id}`}
                    tooltip={t('view')}
                    icon={<ExpandDiagonalIcon />}
                  />
                </Box>
              ),
            };
          })
        : [],
    [t, questions, value]
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
