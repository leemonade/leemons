import React from 'react';
import { Link } from 'react-router-dom';

import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';
import {
  ActionButton,
  Box,
  Checkbox,
  Table,
  TableInput,
  Text,
  TextClamp,
} from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { keyBy, map } from 'lodash';
import PropTypes from 'prop-types';

import { getQuestionForTable } from '../../../../helpers/getQuestionForTable';
import { ResultStyles } from '../Result.style';

import prefixPN from '@tests/helpers/prefixPN';

export default function QuestionsTable({
  questions,
  onChange,
  value = [],
  reorderMode,
  hideOpenIcon,
  withStyle = false,
  hideCheckbox = false,
  questionBank,
  isDrawer,
}) {
  // eslint-disable-next-line prefer-const
  let { classes: styles, cx } = ResultStyles({}, { name: 'QuestionsTable' });
  const [t] = useTranslateLoader(prefixPN('testsEdit'));
  const [t2] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const levels = useLevelsOfDifficulty();
  if (!withStyle) styles = {};
  const allChecked =
    value.length === questions?.length && value.length !== 0 && questions?.length !== 0;

  const handleTextCell = (cellValue) => (
    <TextClamp lines={2} withToolTip>
      <Text sx={{ maxHeight: 56 }}> {cellValue}</Text>
    </TextClamp>
  );
  const tableHeaders = React.useMemo(() => {
    let result = [];
    if (!reorderMode && !hideCheckbox) {
      result.push({
        Header: (
          <Box>
            <Checkbox
              checked={allChecked}
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
        className: cx(styles.tableHeader, styles.firstTableHeader, isDrawer && { minWidth: 200 }),
      },
      {
        Header: t('responsesLabel'),
        accessor: 'responses',
        className: styles.tableHeader,
        style: {
          width: '100px',
        },
      },
      {
        Header: t('typeLabel'),
        accessor: 'type',
        className: styles.tableHeader,
      },
    ]);

    if (!isDrawer) {
      result.push(
        {
          Header: t('levelLabel'),
          accessor: 'level',
          className: styles.tableHeader,
          valueRender: (levelName) => {
            const findLevelName = levels?.find((l) => l.value === levelName);
            return handleTextCell(findLevelName?.label);
          },
        },
        {
          Header: 'Categoría',
          accessor: 'category',
          className: styles.tableHeader,
          valueRender: (categoryId) => {
            const findCategoryLabel = questionBank?.categories?.find((c) => c.id === categoryId);
            return (
              <Box
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                {handleTextCell(findCategoryLabel?.value)}
              </Box>
            );
          },
          style: {
            textAlign: 'right',
          },
        }
      );
    }
    if (!hideOpenIcon) {
      result.push({
        Header: t('actionsHeader'),
        accessor: 'actions',
        className: styles.tableHeader,
      });
    }
    return result;
  }, [t, reorderMode, value, levels, questionBank]);

  const tableItems = React.useMemo(
    () =>
      questions && questions.length
        ? map(questions, (item) => ({
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
              <Box className={styles.tableCell} sx={{ textAlign: 'right', minWidth: '100px' }}>
                <ActionButton
                  as={Link}
                  target="_blank"
                  to={`/private/tests/questions-banks/${item.questionBank}?question=${item.id}`}
                  tooltip={t('view')}
                  icon={<ExpandDiagonalIcon />}
                />
              </Box>
            ),
          }))
        : [],
    [t, questions, value, t2]
  );

  let tableComponent = <Table columns={tableHeaders} data={tableItems} />;
  if (reorderMode) {
    const itemsById = keyBy(tableItems, 'id');
    const items = tableItems?.length ? map(value, (id) => itemsById[id]) : [];

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
  hideOpenIcon: PropTypes.bool,
  withStyle: PropTypes.bool,
  hideCheckbox: PropTypes.bool,
  questionBank: PropTypes.object,
  isDrawer: PropTypes.bool,
  setManualQuestions: PropTypes.func,
};
