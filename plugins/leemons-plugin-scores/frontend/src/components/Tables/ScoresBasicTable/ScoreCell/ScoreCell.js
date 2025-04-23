import { forwardRef, useEffect, useState } from 'react';

import {
  Box,
  Text,
  Stack,
  Select,
  ActionButton,
  useClickOutside,
  NumberInput,
} from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { DeleteIcon, CheckIcon } from '@bubbles-ui/icons/solid';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { isFunction, isNil, noop } from 'lodash';
import PropTypes from 'prop-types';

import { SCORES_CELL_DEFAULT_PROPS } from './ScoreCell.constants';
import { ScoreCellStyles } from './ScoreCell.styles';

const SelectScore = forwardRef(({ value: _value, onChange, onClose, grades, onDelete }, ref) => {
  const [value, setValue] = useState(_value);
  const isLetterTypes = grades.some((grade) => grade.letter);
  const { t: tCommon } = useCommonTranslate('formWithTheme');

  useEffect(() => {
    setValue(_value);
  }, [_value]);

  const onAcceptHandler = () => {
    const score = Math.max(
      grades[0].number,
      Math.min(grades[grades.length - 1].number, value ?? null)
    );

    onChange(score);
    onClose(score);
  };

  const onKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      onAcceptHandler();
    }
  };

  return (
    <Stack fullWidth spacing={2}>
      {isLetterTypes ? (
        <Select
          ref={ref}
          value={value}
          data={grades.map(({ letter, number }) => letter || number.toString())}
          onChange={setValue}
          style={{ flex: 1 }}
          autoFocus
        />
      ) : (
        <NumberInput
          ref={ref}
          value={value}
          onChange={setValue}
          onKeyDown={onKeyDownHandler}
          min={grades[0].number}
          max={grades[grades.length - 1].number}
          precision={2}
          hideControls
          autoFocus
          sx={{ width: 50, marginLeft: 40 }}
        />
      )}
      <Stack>
        <ActionButton
          tooltip={tCommon('accept')}
          onClick={onAcceptHandler}
          icon={<CheckIcon width={18} height={18} />}
        />
        <ActionButton
          tooltip={tCommon('cancel')}
          onClick={() => onClose(value)}
          icon={<DeleteIcon width={18} height={18} />}
        />
      </Stack>
    </Stack>
  );
});

SelectScore.displayName = 'SelectScore';
SelectScore.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  grades: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func,
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
  onDelete = noop,
  onOpen,
  isCustom,
  retake,
  labels,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value ?? null); // Before the grade[0].number was used if the value is undefined

  const isAssignable = source === 'assignables';

  useEffect(() => {
    if (value !== editValue) {
      setEditValue(value ?? null); // Before the grade[0].number was used if the value is undefined
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
      return `${grades[0].letter ?? grades[0].number}${
        usePercentage ? '%' : ''
      } (${noActivityLabel})`;
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

    const retakeRender = !isNil(retake) ? ` (${labels.retake} ${retake + 1})` : '';

    return `${render}${usePercentage ? '%' : ''}${retakeRender}`;
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

  const onDeleteHandler = () => {
    const rowId = isCustom ? row : row.original.id;
    const columnId = isCustom ? column : column.id;
    onDelete({ rowId, columnId });
    setIsEditing(false);
  };

  const onCloseThenChangeHandler = (score) => {
    if (!score) {
      score = editValue;
    }

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
                ? Number.parseFloat(score)
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
        <Box sx={{ paddingInline: 15 }}>
          <Text color="soft" role="productive">
            -
          </Text>
        </Box>
      );
    }

    return (
      <Box
        ref={setInputContainer}
        onClick={onClickHandler}
        sx={{ '&:hover': { cursor: !isEditing && !!allowChange ? 'pointer' : 'default' } }}
      >
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
              onDelete={onDeleteHandler}
            />
          )}
          {(!isEditing || !allowChange) && (
            <Box sx={{ paddingInline: 15, flex: 1 }}>
              <Text color={isSubmitted ? 'primary' : 'error'} role="productive">
                {renderValue(value)}
              </Text>
            </Box>
          )}
        </Box>
        {isEditing && !isCustom && isAssignable && (
          <Box className={classes.expandIcon}>
            <ActionButton
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

  const { classes } = ScoreCellStyles({ isEditing, allowChange }, { name: 'ScoreCell' });
  return <Box className={classes.root}>{renderInputCell()}</Box>;
};

ScoreCell.defaultProps = SCORES_CELL_DEFAULT_PROPS;
ScoreCell.propTypes = {
  value: PropTypes.number,
  noActivity: PropTypes.string,
  submittedLabel: PropTypes.string,
  allowChange: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isClosed: PropTypes.bool,
  grades: PropTypes.arrayOf(PropTypes.object),
  usePercentage: PropTypes.bool,
  source: PropTypes.string,
  row: PropTypes.object,
  column: PropTypes.object,
  setValue: PropTypes.func,
  onDataChange: PropTypes.func,
  onDelete: PropTypes.func,
  onOpen: PropTypes.func,
  isCustom: PropTypes.bool,
  retake: PropTypes.number,
  labels: PropTypes.object,
};

export { ScoreCell };
