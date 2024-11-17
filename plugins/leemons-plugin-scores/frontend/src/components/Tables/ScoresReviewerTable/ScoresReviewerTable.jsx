import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, UserDisplayItem, useElementSize } from '@bubbles-ui/components';
import { useTable, useFlexLayout } from 'react-table';
import { isFunction } from 'lodash';
import { motion } from 'framer-motion';
import { useSticky } from 'react-table-sticky';
import { ScoreCell } from './ScoreCell';
import { SubjectHeader } from './SubjectHeader';
import { PeriodHeader } from './PeriodHeader';
import { CommonTableStyles } from '../CommonTable.styles';
import { ScoresReviewerTableStyles } from './ScoresReviewerTable.styles';
import {
  SCORES_REVIEWER_TABLE_DEFAULT_PROPS,
  SCORES_REVIEWER_TABLE_PROP_TYPES,
} from './ScoresReviewerTable.constants';

const ScoresReviewerTable = ({
  grades,
  subjects,
  value: _value,
  labels,
  locale,
  onChange,
  onDataChange,
  from,
  to,
  hideCustom,
  ...props
}) => {
  const { ref: tableRef } = useElementSize(null);
  const [value, setValue] = useState(_value);
  const useNumbers = !grades.some((grade) => grade.letter);
  const [overFlowLeft, setOverFlowLeft] = useState(false);
  const [overFlowRight, setOverFlowRight] = useState(false);

  const { classes: commonClasses } = CommonTableStyles(
    { overFlowLeft, overFlowRight, hideCustom },
    { name: 'CommonTable' }
  );
  const { classes: reviewerClasses } = ScoresReviewerTableStyles(
    {},
    { name: 'ScoresReviewerTable' }
  );
  const classes = { ...commonClasses, ...reviewerClasses };

  const onScrollHandler = () => {
    const { scrollWidth, clientWidth, scrollLeft } = tableRef.current;
    if (scrollLeft > 0) setOverFlowLeft(true);
    else setOverFlowLeft(false);
    if (scrollLeft + clientWidth === scrollWidth) setOverFlowRight(false);
    else setOverFlowRight(true);
  };

  const findGradeLetter = (score) => grades.find(({ number }) => number === score)?.letter;

  const getSubjects = (studentSubjects) => {
    const activitiesObject = {};
    studentSubjects.forEach(({ id, periodScores }) => {
      periodScores.forEach((period) => {
        activitiesObject[`${id}-${period.name}`] = {
          score: useNumbers ? period.score : findGradeLetter(period.score),
        };
      });
    });
    return activitiesObject;
  };

  const getAvgScore = (studentSubjects) => {
    let weightedScore = 0;
    studentSubjects.forEach((studentSubject) => {
      const { score: lastScore } = studentSubject.periodScores.at(-1);
      weightedScore +=
        (lastScore ? lastScore : 0) *
        (subjects.find((subject) => subject.id === studentSubject.id).periods.at(-1)?.weight || 1);
    });
    let sumOfWeights = 0;
    subjects.forEach((subject) => (sumOfWeights += subject.periods.at(-1).weight || 1));
    const weightedAverage = (weightedScore / sumOfWeights).toFixed(2);
    return useNumbers ? weightedAverage : findGradeLetter(Math.round(weightedAverage));
  };

  const getActivitiesPeriod = () => {
    return `${new Date(from).toLocaleDateString(locale)} - ${new Date(to).toLocaleDateString(
      locale
    )}`;
  };

  const getRightBodyContent = () => {
    return value.map(({ id, subjects: studentSubjects, customScore, allowCustomChange }) => {
      const avgScore = getAvgScore(studentSubjects);
      return (
        <Box key={id} className={classes.contentRow}>
          <Box className={classes.separator} />
          <Box className={classes.studentInfo}>
            <Text color="primary" role="productive">
              {avgScore}
            </Text>
          </Box>
          {!hideCustom && (
            <Box className={classes.studentInfo}>
              <ScoreCell
                value={isNaN(customScore) ? avgScore : customScore}
                allowChange={allowCustomChange}
                grades={grades}
                row={id}
                column={'customScore'}
                isCustom
                onDataChange={onDataChange}
              />
            </Box>
          )}
        </Box>
      );
    });
  };

  const getSubjectColumns = (subjectId, subjectPeriods, isFirst, isLast) => {
    const columns = subjectPeriods.map((period, index) => ({
      Header: period.name,
      accessor: `${subjectId}-${period.name}`,
      Header: (
        <PeriodHeader {...{ isFirst, isLast, index, length: subjectPeriods.length }} {...period} />
      ),
      Cell: ({ value, row, column }) => {
        return (
          <ScoreCell
            value={value.score}
            noActivity={labels.noActivity}
            isSubmitted={value.isSubmitted}
            allowChange={period.allowChange}
            grades={grades}
            row={row}
            column={column}
            setValue={setValue}
            onDataChange={onDataChange}
          />
        );
      },
    }));
    return columns;
  };

  const getColumns = () => {
    const columns = [];
    columns.push({
      accessor: 'student',
      width: 220,
      sticky: 'left',
      Header: (
        <Box className={classes.students}>
          <Text color="primary" role="productive" size="xs" stronger>
            {labels.students}
          </Text>
        </Box>
      ),
      Cell: ({ value }) => {
        return (
          <Box className={classes.studentsCells}>
            <UserDisplayItem
              name={value.name}
              surnames={value.surname}
              avatar={value.image}
              noBreak
            />
          </Box>
        );
      },
    });
    subjects.forEach((subject, index) => {
      const isFirst = index === 0;
      const isLast = index === subjects.length - 1;
      const subjectColumns = getSubjectColumns(subject.id, subject.periods, isFirst, isLast);
      columns.push({
        id: subject.id,
        width: 300,
        columns: subjectColumns,
        Header: () => (
          <SubjectHeader {...subject} locale={locale} isFirst={isFirst} isLast={isLast} />
        ),
      });
    });
    return columns;
  };

  const getData = () => {
    const data = [];
    value.forEach(({ id, name, surname, image, subjects }) => {
      data.push({
        student: { name, surname, image },
        id,
        ...getSubjects(subjects),
      });
    });
    return data;
  };

  const columns = useMemo(() => getColumns(), [value, subjects, labels, locale, useNumbers]);
  const data = useMemo(() => getData(), [value, subjects, labels, locale, useNumbers]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useFlexLayout,
    useSticky
  );

  useEffect(() => {
    setValue(_value);
  }, [..._value]);

  useEffect(() => {
    isFunction(onChange) && onChange(value);
  }, [value]);

  useEffect(() => {
    if (!tableRef.current) return;
    const isOverflowing = tableRef.current.scrollWidth > tableRef.current.clientWidth;
    if (isOverflowing && isOverflowing !== overFlowRight) {
      setOverFlowRight(true);
    } else if (isOverflowing !== overFlowRight) {
      setOverFlowRight(false);
    }
  }, [tableRef.current?.scrollWidth]);

  const spring = {
    type: 'spring',
    stiffness: 100,
    damping: 18,
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.shadowBox} />
      <Box ref={tableRef} {...getTableProps()} className={classes.table} onScroll={onScrollHandler}>
        <Box style={{ flex: 1 }}>
          <Box className={classes.tableHeader}>
            {headerGroups.map((headerGroup) => (
              <Box {...headerGroup.getHeaderGroupProps()} className={classes.tableHeaderRow}>
                {headerGroup.headers.map((column) => (
                  <motion.div
                    layout
                    transition={spring}
                    {...column.getHeaderProps([{ style: column.style }])}
                    className={classes.tableHeaderCell}
                  >
                    {column.render('Header')}
                  </motion.div>
                ))}
              </Box>
            ))}
          </Box>
          <Box {...getTableBodyProps()} className={classes.tableBody}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Box {...row.getRowProps()} className={classes.bodyRow}>
                  {row.cells.map((cell) => (
                    <motion.div
                      layout
                      transition={spring}
                      {...cell.getCellProps([
                        { style: { ...cell.column.style, background: 'white' } },
                      ])}
                      className={classes.bodyCell}
                    >
                      {cell.render('Cell')}
                    </motion.div>
                  ))}
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box className={classes.rightBody}>
          <Box className={classes.rightBodyHeader}>
            <Box className={classes.headerAvg}>
              <Text color="primary" role="productive" stronger transform="uppercase">
                {labels.avgScore}
              </Text>
              <Text color="primary" role="productive" size="xs">
                {getActivitiesPeriod()}
              </Text>
            </Box>
            <Box className={classes.columnHeader}>
              <Text color="primary" role="productive" stronger transform="uppercase" size="xs">
                {labels.gradingTasks}
              </Text>
            </Box>
            {!hideCustom && (
              <Box className={classes.columnHeader}>
                <Text color="primary" role="productive" stronger transform="uppercase" size="xs">
                  {labels.customScore}
                </Text>
              </Box>
            )}
          </Box>
          <Box className={classes.rightBodyContent}>{getRightBodyContent()}</Box>
        </Box>
      </Box>
    </Box>
  );
};

ScoresReviewerTable.defaultProps = SCORES_REVIEWER_TABLE_DEFAULT_PROPS;
ScoresReviewerTable.propTypes = SCORES_REVIEWER_TABLE_PROP_TYPES;

export { ScoresReviewerTable };
