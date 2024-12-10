import { forwardRef, useEffect, useState } from 'react';

import {
  Box,
  Text,
  Select,
  IconButton,
  useClickOutside,
  NumberInput,
} from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';

import { SCORES_CELL_DEFAULT_PROPS } from './ScoreCell.constants';
import { ScoreCellStyles } from './ScoreCell.styles';

const SelectScore = forwardRef(({ value, onChange, onClose, grades }, ref) => {
  const isLetterTypes = grades.some((grade) => grade.letter);

  if (isLetterTypes) {
    return (
      <>
        <Select
          value={value}
          data={grades.map(({ letter, number }) => letter || number.toString())}
          onChange={onChange}
          onDropdownClose={onClose}
          style={{ flex: 1 }}
          ref={ref}
        />
      </>
    );
  }
  return (
    <NumberInput
      value={value}
      onChange={(_value) =>
        onChange(Math.max(grades[0].number, Math.min(grades[grades.length - 1].number, _value)))
      }
      onBlur={onClose}
      min={grades[0].number}
      max={grades[grades.length - 1].number}
      ref={ref}
    />
  );
});

SelectScore.displayName = 'SelectScore';
SelectScore.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  grades: PropTypes.arrayOf(PropTypes.object),
};

const ScoreCell = ({
  value,
  noActivity: noActivityLabel,
  submittedLabel,
  allowChange,
  isSubmitted = true,
  isClosed,
  grades,
  usePercentage,
  source,
  row,
  column,
  setValue,
  onDataChange,
  onOpen,
  isCustom,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value ?? grades[0].number);

  const isAssignable = source === 'assignables';

  useEffect(() => {
    if (value !== editValue) {
      setEditValue(value ?? grades[0].number);
    }
  }, [value, grades]);

  const useNumbers = !grades.some((grade) => grade.letter);
  const [inputContainer, setInputContainer] = useState();
  const selectRef = useClickOutside(() => setTimeout(() => setIsEditing(false), 100), null, [
    inputContainer,
  ]);

  const renderValue = (_value) => {
    const hasGrade = _value !== undefined && _value !== null;

    // Use minimum grade if no grade and the activity is not submitted and is closed
    if (!hasGrade && !isSubmitted && isClosed) {
      return `${grades[0].letter ?? grades[0].number}${usePercentage ? '%' : ''} (${noActivityLabel})`;
    }

    // Use submitted label if the activity is submitted and not graded
    if (!hasGrade && isSubmitted && isAssignable) {
      return (
        <Text color="success" role="productive" style={{ flex: 1 }}>
          {submittedLabel}
        </Text>
      );
    }

    if (!hasGrade) {
      return '-';
    }

    let render = _value;

    if (typeof _value !== 'string') {
      render = _value % 1 === 0 ? _value : _value.toFixed(2);
    }

    if (!isSubmitted) {
      return `${render}${usePercentage ? '%' : ''} (${noActivityLabel})`;
    }

    return `${render}${usePercentage ? '%' : ''}`;
  };

  const onClickHandler = () => {
    if (!isEditing) setIsEditing(true);
  };

  const onOpenHandler = () => {
    const rowId = row.original.id;
    const columnId = column.id;
    isFunction(onOpen) && onOpen({ rowId, columnId });
    setIsEditing(false);
  };

  const onCloseThenChangeHandler = () => {
    const score = editValue;

    const rowId = isCustom ? row : row.original.id;
    const columnId = isCustom ? column : column.id;

    if (score !== value) {
      isFunction(setValue) &&
        setValue((oldValue) =>
          oldValue.map((student) => {
            if (student.id !== rowId) return student;
            const newStudentActivities = student.activities.map((activity) => {
              if (activity.id !== columnId) return activity;
              activity.score = useNumbers
                ? parseFloat(score)
                : grades.find(({ letter }) => letter === score)?.number;
              return activity;
            });
            return { ...student, activities: newStudentActivities };
          })
        );
      isFunction(onDataChange) && onDataChange({ rowId, columnId, value: score });
    }

    setIsEditing(false);
  };

  const renderInputCell = () => {
    if (!value && !isSubmitted && !isClosed) {
      return (
        <Text color="soft" role="productive">
          -
        </Text>
      );
    }

    return (
      <Box className={classes.inputContainer} ref={setInputContainer} onClick={onClickHandler}>
        <Box className={classes.score}>
          {!!allowChange && !!isEditing && (
            <SelectScore
              value={editValue}
              grades={grades}
              onChange={setEditValue}
              onClose={onCloseThenChangeHandler}
              style={{ flex: 1 }}
              ref={selectRef}
              isCustom={isCustom}
            />
          )}
          {(!isEditing || !allowChange) && (
            <Text color={isSubmitted ? 'primary' : 'error'} role="productive" style={{ flex: 1 }}>
              {renderValue(value)}
            </Text>
          )}
        </Box>
        {isEditing && !isCustom && isAssignable && (
          <Box className={classes.expandIcon}>
            <IconButton
              variant="transparent"
              onClick={onOpenHandler}
              icon={<ExpandDiagonalIcon width={16} height={16} />}
            />
          </Box>
        )}
      </Box>
    );
  };

  useEffect(() => {
    if (selectRef.current) selectRef.current.click();
  }, [isEditing, selectRef]);

  const { classes, cx } = ScoreCellStyles({ isEditing, allowChange }, { name: 'ScoreCell' });
  return <Box className={classes.root}>{renderInputCell()}</Box>;
};

ScoreCell.defaultProps = SCORES_CELL_DEFAULT_PROPS;

export { ScoreCell };
