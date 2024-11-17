import React, { useEffect, useState } from 'react';
import { noop } from 'lodash';
import { useLocale } from '@common';
import { Box, Text, Popover, InputWrapper, UnstyledButton } from '@bubbles-ui/components';
import { AlertWarningTriangleIcon, CheckIcon } from '@bubbles-ui/icons/solid';
import { ChevronDownIcon } from '@bubbles-ui/icons/outline';
import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '../../helpers/prefixPN';
import {
  CLASSROOM_PICKER_DEFAULT_PROPS,
  CLASSROOM_PICKER_PROP_TYPES,
} from './ClassroomPicker.constants';
import { ClassroomPickerItem } from './components/ClassroomPickerItem';
import { ClassroomPickerList } from '../ClassroomPickerList';
import { ClassroomPickerStyles } from './ClassroomPicker.styles';
import { transformData } from './helpers';

const ClassroomPicker = ({
  label,
  error,
  value,
  programId,
  data,
  onChange = noop,
  allowCollisions = false,
}) => {
  const [transformedData, setTransformedData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasCollisions, setHasCollisions] = useState(false);
  const [collisionError, setCollisionError] = useState(false);
  const { classes, cx } = ClassroomPickerStyles({ isOpen }, { name: 'ClassroomPicker' });
  const locale = useLocale();
  const [t] = useTranslateLoader(prefixPN('classroomPicker'));
  const { data: classesData } = useProgramClasses(programId, { enabled: !data && !!programId });

  useEffect(() => {
    if (subjectsList.some((item) => item.collideWith.length > 0)) {
      setCollisionError(true);
    } else {
      setCollisionError(false);
    }
  }, [subjectsList]);

  useEffect(() => {
    const { data: dataTransformed, hasCollisions: collisions } = transformData(
      data ?? classesData ?? [],
      locale
    );
    setTransformedData(dataTransformed);
    setHasCollisions(collisions);
  }, [classesData, data, locale]);

  useEffect(() => {
    setSubjects(transformedData.filter((item) => !value.includes(item.value)));
    setSubjectsList(transformedData.filter((item) => value.includes(item.value)));
  }, [transformedData, value]);

  const handleSelectSubject = (subject) => {
    const newSubjectsList = [...subjectsList, subject];
    setSubjectsList(newSubjectsList);
    setSubjects((prevState) => prevState.filter((item) => item.value !== subject.value));
    setIsOpen(false);
    onChange(newSubjectsList.map((item) => item.value));
  };
  const handleSelectAllSubjects = () => {
    const newSubjectsList = [...subjectsList, ...subjects];
    setSubjectsList(newSubjectsList);
    setSubjects([]);
    setIsOpen(false);
    onChange(newSubjectsList.map((item) => item.value));
  };
  const handleRemoveSubjectFromList = (subject) => {
    const newSubjects = [...subjects, subject];
    const newSubjectsList = subjectsList.filter((item) => item.value !== subject.value);
    setSubjects(newSubjects);
    setSubjectsList(newSubjectsList);
    onChange(newSubjectsList.map((item) => item.value));
  };

  const disabled = (!data && !programId) || subjects.length === 0;

  return (
    <InputWrapper label={label} error={error}>
      <Popover
        offset={5}
        target={
          <UnstyledButton
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={cx(classes.unstyledButton, classes.popoverButton, {
              [classes.disabled]: disabled,
            })}
          >
            <Text className={classes.popoverButtonText}>
              {subjects.length > 0 ? `${t('selectSubject')} ` : t('noMore')}
            </Text>
            <ChevronDownIcon height={8} width={8} className={classes.chevronIcon} />
          </UnstyledButton>
        }
        closeOnEscape
        width="target"
        shadow="none"
        withinPortal
        closeOnClickOutside
        onChange={setIsOpen}
        opened={isOpen}
      >
        {(!!data || !!classesData) && (
          <Box className={classes.popoverContent}>
            {!allowCollisions && collisionError && (
              <Box className={classes.collisionContainer}>
                <AlertWarningTriangleIcon className={classes.collisionIcon} />
                <Text className={classes.collisionLabel}>{t('collision')}</Text>
              </Box>
            )}
            {!hasCollisions && subjects?.length > 1 && (
              <UnstyledButton
                className={cx(classes.unstyledButton, classes.allSubjectsContainer)}
                onClick={() => handleSelectAllSubjects()}
              >
                <Box className={classes.allSubjectsCircle}>
                  <CheckIcon width={12} height={12} />
                </Box>
                <Text className={classes.allSubjectsLabel}>{`${t('allSubjects')} (${
                  subjects?.length
                })`}</Text>
              </UnstyledButton>
            )}
            {subjects.map((subject) => {
              const collisionDetected =
                !allowCollisions &&
                hasCollisions &&
                subjectsList.some((listItem) => subject?.collideWith?.includes(listItem.value));
              return (
                <UnstyledButton
                  disabled={collisionDetected}
                  className={cx(classes.unstyledButton, {
                    [classes.simpleDisabled]: collisionDetected,
                  })}
                  key={subject.value}
                  onClick={() => !collisionDetected && handleSelectSubject(subject)}
                >
                  <ClassroomPickerItem {...subject} isCollisionDetected={collisionDetected} />
                </UnstyledButton>
              );
            })}
          </Box>
        )}
      </Popover>
      <Box mt={8}>
        <ClassroomPickerList subjects={subjectsList} onRemove={handleRemoveSubjectFromList} />
      </Box>
    </InputWrapper>
  );
};

ClassroomPicker.defaultProps = CLASSROOM_PICKER_DEFAULT_PROPS;
ClassroomPicker.propTypes = CLASSROOM_PICKER_PROP_TYPES;

export { ClassroomPicker };
