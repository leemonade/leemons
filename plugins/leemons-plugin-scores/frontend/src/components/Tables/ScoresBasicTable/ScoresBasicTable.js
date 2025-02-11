import { useEffect, useMemo, useState } from 'react';
import { useTable, useFlexLayout } from 'react-table';
import { useSticky } from 'react-table-sticky';

import { Box, Text, UserDisplayItem, useElementSize, Stack } from '@bubbles-ui/components';
import { motion } from 'framer-motion';
import { isFunction } from 'lodash';

import { CommonTableStyles } from '../CommonTable.styles';

import { ActivityHeader } from './ActivityHeader';
import { ScoreCell } from './ScoreCell';
import {
  SCORES_BASIC_TABLE_DEFAULT_PROPS,
  SCORES_BASIC_TABLE_PROP_TYPES,
} from './ScoresBasicTable.constants';
import { ScoresBasicTableStyles } from './ScoresBasicTable.styles';
import { RightContent } from './components/RightContent';

const ScoresBasicTable = ({
  grades,
  usePercentage,
  activities,
  value: _value,
  labels,
  expandedData,
  expandedColumn: _expandedColumn,
  locale,
  onChange,
  onDataChange,
  onColumnExpand,
  onOpen,
  periodName,
  from,
  to,
  hideCustom,
  viewOnly,
  leftBadge,
  retakes,
}) => {
  const { ref: tableRef } = useElementSize(null);
  const [value, setValue] = useState(_value);
  const useNumbers = !grades.some((grade) => grade.letter);

  const [expandedColumn, setExpandedColumn] = useState(_expandedColumn);
  const [overFlowLeft, setOverFlowLeft] = useState(false);
  const [overFlowRight, setOverFlowRight] = useState(false);

  const { classes: commonClasses } = CommonTableStyles(
    { overFlowLeft, overFlowRight, hideCustom },
    { name: 'CommonTable' }
  );
  const { classes: basicClasses, cx } = ScoresBasicTableStyles({}, { name: 'ScoresBasicTable' });
  const classes = { ...commonClasses, ...basicClasses };

  const onColumnExpandHandler = (columnId) => {
    isFunction(onColumnExpand) && onColumnExpand(columnId);
    setExpandedColumn(columnId);
  };

  const onScrollHandler = () => {
    const { scrollWidth, clientWidth, scrollLeft } = tableRef.current;
    if (scrollLeft > 0) setOverFlowLeft(true);
    else setOverFlowLeft(false);
    if (scrollLeft + clientWidth === scrollWidth) setOverFlowRight(false);
    else setOverFlowRight(true);
  };

  const getCompletionPercentage = (activityId, isExpanded) => {
    const activities = isExpanded ? expandedData.value : value;
    const studentsWithActivity = activities.filter((student) =>
      student.activities.find((activity) => activity?.id === activityId)
    );
    const completionPercentage = Math.trunc(
      (studentsWithActivity.length / activities.length) * 100
    );
    return `${completionPercentage}%`;
  };

  const findGradeLetter = (score) => {
    let nearestGrade = grades[0];
    let nearestDifference = Math.abs(nearestGrade.number - score);

    grades.forEach((grade) => {
      const difference = Math.abs(grade.number - score);
      if (difference < nearestDifference) {
        nearestDifference = difference;
        nearestGrade = grade;
      }
    });

    return nearestGrade.letter;
  };

  const getActivities = (studentActivities, studentId) => {
    const activitiesObject = {};
    activities.forEach(({ id, source }) => {
      const activity = studentActivities.find((studentActivity) => studentActivity?.id === id);
      activitiesObject[id] = {
        score: useNumbers ? activity?.score : findGradeLetter(activity?.score),
        isSubmitted: activity?.isSubmitted,
        source,
      };
    });
    const expandedActivities = expandedData?.value.find(
      (student) => student.id === studentId
    )?.activities;
    expandedData?.activities?.forEach(({ id, source }) => {
      const activity = expandedActivities.find((expandedActivity) => expandedActivity?.id === id);
      activitiesObject[id] = {
        score: useNumbers ? activity?.score : findGradeLetter(activity?.score),
        isSubmitted: activity?.isSubmitted,
        source,
      };
    });
    return activitiesObject;
  };

  const getColumns = () => {
    const columns = [];
    columns.push({
      accessor: 'student',
      width: 220,
      sticky: 'left',
      Header: (
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          fullWidth
          fullHeight
          sx={{ paddingBottom: 16 }}
        >
          <Box />
          <Box>{leftBadge || null}</Box>
          <Text color="primary" role="productive" size="xs" stronger>
            {labels.students}
          </Text>
        </Stack>
      ),
      Cell: ({ value }) => (
        <Box className={classes.studentsCells}>
          <UserDisplayItem
            name={value.name}
            surnames={value.surname}
            avatar={value.image}
            noBreak
          />
        </Box>
      ),
    });
    activities.forEach((activity) => {
      const isDeadlineFinished = activity.deadline
        ? new Date(activity.deadline) < new Date()
        : true;

      const completionPercentage = getCompletionPercentage(activity.id);
      columns.push({
        accessor: activity.id,
        width: 130,
        Header: () => (
          <ActivityHeader
            {...activity}
            completionPercentage={completionPercentage}
            locale={locale}
            isExpandable={activity.expandable}
            isExpanded={expandedColumn === activity.id}
            onColumnExpand={onColumnExpandHandler}
            type={activity.type}
          />
        ),
        Cell: ({ value, row, column, ...others }) => (
          <ScoreCell
            value={value.score}
            noActivity={labels.noActivity}
            submittedLabel={labels.submitted}
            allowChange={activity.allowChange && !viewOnly}
            isSubmitted={value.isSubmitted}
            source={value.source}
            isClosed={isDeadlineFinished}
            grades={grades}
            usePercentage={usePercentage}
            row={row}
            column={column}
            setValue={setValue}
            onDataChange={onDataChange}
            onOpen={onOpen}
          />
        ),
      });
      if (activity.expandable && expandedColumn === activity.id) {
        columns.push(
          ...expandedData.activities.map((expandedActivity, index) => {
            const position =
              index === 0
                ? 'first'
                : index === expandedData.activities.length - 1
                  ? 'last'
                  : 'between';
            const completionPercentage = getCompletionPercentage(expandedActivity.id, true);
            return {
              accessor: expandedActivity.id,
              width: 148,
              Header: () => (
                <ActivityHeader
                  {...expandedActivity}
                  completionPercentage={completionPercentage}
                  locale={locale}
                  isExpanded={true}
                  position={position}
                  type={activity.type}
                />
              ),
              style:
                position === 'last'
                  ? { boxShadow: 'inset -10px 0px 6px -6px rgba(0,0,0,0.10)' }
                  : { boxShadow: 'none' },
              Cell: ({ value, row, column }) => (
                <ScoreCell
                  value={value.score}
                  noActivity={labels.noActivity}
                  submittedLabel={labels.submitted}
                  allowChange={expandedActivity.allowChange && !viewOnly}
                  isSubmitted={value.isSubmitted}
                  source={value.source}
                  grades={grades}
                  usePercentage={usePercentage}
                  row={row}
                  column={column}
                  isExpanded={true}
                  setValue={setValue}
                  onDataChange={onDataChange}
                  position={position}
                  onOpen={onOpen}
                />
              ),
            };
          })
        );
      }
    });
    return columns;
  };

  const getData = () => {
    const data = [];
    value.forEach(({ id, name, surname, image, activities }) => {
      data.push({
        student: { name, surname, image },
        id,
        ...getActivities(activities, id),
      });
    });
    return data;
  };

  const columns = useMemo(
    () => getColumns(),
    [value, activities, labels, locale, useNumbers, expandedData, expandedColumn]
  );
  const data = useMemo(
    () => getData(),
    [value, activities, labels, locale, useNumbers, expandedData, expandedColumn]
  );
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

  useEffect(() => {
    setExpandedColumn(_expandedColumn);
  }, [_expandedColumn]);

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
        <RightContent
          labels={labels}
          overFlowRight={overFlowRight}
          headerProps={{
            periodName,
            from,
            to,
            locale,
          }}
          hideCustom={hideCustom}
          studentsData={value}
          grades={grades}
          activities={activities}
          useNumbers={useNumbers}
          retakes={retakes}
          onDataChange={onDataChange}
          usePercentage={usePercentage}
          viewOnly={viewOnly}
        />
      </Box>
    </Box>
  );
};

ScoresBasicTable.defaultProps = SCORES_BASIC_TABLE_DEFAULT_PROPS;
ScoresBasicTable.propTypes = SCORES_BASIC_TABLE_PROP_TYPES;

export { ScoresBasicTable };
