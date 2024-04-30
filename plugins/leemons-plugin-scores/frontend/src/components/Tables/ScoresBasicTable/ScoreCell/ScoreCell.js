import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Text,
  Select,
  IconButton,
  useClickOutside,
  NumberInput,
} from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { isFunction, isNil } from 'lodash';
import { ScoreCellStyles } from './ScoreCell.styles';
import { SCORES_CELL_DEFAULT_PROPS, SCORES_CELL_PROP_TYPES } from './ScoreCell.constants';

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
  row,
  column,
  setValue,
  onDataChange,
  onOpen,
  isCustom,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value ?? grades[0].number);

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
    if (!_value && !isSubmitted && isClosed)
      return `${grades[0].letter ?? grades[0].number} (${noActivityLabel})`;

    if (!_value && isSubmitted)
      return (
        <Text color="success" role="productive" style={{ flex: 1 }}>
          {submittedLabel}
        </Text>
      );

    if (isNil(_value)) return '-';

    let render = _value;

    if (typeof _value !== 'string') {
      render = _value % 1 === 0 ? _value : _value.toFixed(2);
    }

    if (!isSubmitted) {
      return `${render} (${noActivityLabel})`;
    }

    return render;
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
        {isEditing && !isCustom && (
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
