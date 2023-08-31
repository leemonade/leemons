import React, { useEffect, useState } from 'react';
import { Box, Text, Select, useClickOutside } from '@bubbles-ui/components';
import { ScoreCellStyles } from './ScoreCell.styles';
import { SCORES_CELL_DEFAULT_PROPS, SCORES_CELL_PROP_TYPES } from './ScoreCell.constants';
import { isFunction, isNil } from 'lodash';

const ScoreCell = ({
  value,
  allowChange,
  grades,
  row,
  column,
  setValue,
  onDataChange,
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
    if (!isEditing) setIsEditing(true);
  };

  const onChangeHandler = (score) => {
    const rowId = isCustom ? row : row.original.id;
    const columnId = isCustom ? column : column.id;

    isFunction(setValue) &&
      setValue((oldValue) => {
        const newValue = oldValue.map((student) => {
          const newStudentSubjects = student.subjects.map((subject) => {
            const newPeriodScores = subject.periodScores.map((period) => {
              if (columnId !== `${subject.id}-${period.name}` || rowId !== student.id)
                return period;
              period.score = useNumbers
                ? parseFloat(score)
                : grades.find(({ letter }) => letter === score)?.number;
              return period;
            });
            subject.periodScores = newPeriodScores;
            return subject;
          });
          return { ...student, subjects: newStudentSubjects };
        });
        return newValue;
      });
    isFunction(onDataChange) && onDataChange({ rowId, columnId, value: score });
  };

  const renderInputCell = () => {
    const data = grades.map(({ letter, number }) => letter || number.toString());

    return (
      <Box className={classes.inputContainer} ref={setInputContainer} onClick={onClickHandler}>
        {allowChange ? (
          isEditing ? (
            <Select
              value={value}
              data={data}
              onChange={onChangeHandler}
              onDropdownClose={() => setIsEditing(false)}
              style={{ flex: 1 }}
              ref={selectRef}
            />
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
