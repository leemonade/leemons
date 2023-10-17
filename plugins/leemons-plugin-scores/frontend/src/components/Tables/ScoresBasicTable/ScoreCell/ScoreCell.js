import React, { useEffect, useState } from 'react';
import { Box, Text, Select, IconButton, useClickOutside } from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { ScoreCellStyles } from './ScoreCell.styles';
import { SCORES_CELL_DEFAULT_PROPS, SCORES_CELL_PROP_TYPES } from './ScoreCell.constants';
import { isFunction, isNil } from 'lodash';

const ScoreCell = ({
  value,
  noActivity,
  allowChange,
  isSubmitted,
  grades,
  row,
  column,
  setValue,
  onDataChange,
  onOpen,
  isCustom,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const useNumbers = !grades.some((grade) => grade.letter);
  const [inputContainer, setInputContainer] = useState();
  const selectRef = useClickOutside(() => setIsEditing(false), null, [inputContainer]);

  const renderValue = (value) => {
    if (isNil(value)) return '-';
    if (typeof value === 'string') return value;
    return value % 1 === 0 ? value : value.toFixed(2);
  };

  const onClickHandler = () => {
    // if (!allowChange) return;
    if (!isEditing) setIsEditing(true);
  };

  const onOpenHandler = () => {
    const rowId = row.original.id;
    const columnId = column.id;
    isFunction(onOpen) && onOpen({ rowId, columnId });
    setIsEditing(false);
  };

  const onChangeHandler = (score) => {
    const rowId = isCustom ? row : row.original.id;
    const columnId = isCustom ? column : column.id;

    isFunction(setValue) &&
      setValue((oldValue) => {
        const newValue = oldValue.map((student) => {
          if (student.id !== rowId) return student;
          const newStudentActivities = student.activities.map((activity) => {
            if (activity.id !== columnId) return activity;
            activity.score = useNumbers
              ? parseFloat(score)
              : grades.find(({ letter }) => letter === score)?.number;
            return activity;
          });
          return { ...student, activities: newStudentActivities };
        });
        return newValue;
      });
    isFunction(onDataChange) && onDataChange({ rowId, columnId, value: score });
  };

  const renderInputCell = () => {
    if (!isSubmitted && !isCustom)
      return (
        <Text color="soft" role="productive">
          {noActivity}
        </Text>
      );

    const data = grades.map(({ letter, number }) => letter || number.toString());

    return (
      <Box className={classes.inputContainer} ref={setInputContainer} onClick={onClickHandler}>
        {allowChange ? (
          isEditing ? (
            <>
              <Select
                value={value}
                data={data}
                onChange={onChangeHandler}
                onDropdownClose={() => setIsEditing(false)}
                style={{ flex: 1 }}
                ref={selectRef}
              />
              {!isCustom && (
                <Box className={classes.expandIcon}>
                  <IconButton
                    variant="transparent"
                    onClick={onOpenHandler}
                    icon={<ExpandDiagonalIcon width={16} height={16} />}
                  />
                </Box>
              )}
            </>
          ) : (
            <Text color="primary" role="productive">
              {renderValue(value)}
            </Text>
          )
        ) : (
          <>
            <Text color="primary" role="productive" style={{ flex: 1 }}>
              {renderValue(value)}
            </Text>
            {isEditing && !isCustom && (
              <Box className={classes.expandIcon}>
                <IconButton
                  variant="transparent"
                  onClick={onOpenHandler}
                  icon={<ExpandDiagonalIcon width={16} height={16} />}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    );
  };

  useEffect(() => {
    if (selectRef.current) selectRef.current.click();
  }, [isEditing]);

  const { classes, cx } = ScoreCellStyles({ isEditing, allowChange }, { name: 'ScoreCell' });
  return <Box className={classes.root}>{renderInputCell()}</Box>;
};

ScoreCell.defaultProps = SCORES_CELL_DEFAULT_PROPS;
ScoreCell.propTypes = SCORES_CELL_PROP_TYPES;

export { ScoreCell };
