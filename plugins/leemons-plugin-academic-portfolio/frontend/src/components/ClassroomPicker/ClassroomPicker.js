import React, { useEffect, useState, useRef } from 'react';
// import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { Box, Text, Popover } from '@bubbles-ui/components';
// import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { AlertWarningTriangleIcon, CheckIcon } from '@bubbles-ui/icons/solid';
import { ChevronDownIcon } from '@bubbles-ui/icons/outline';
import {
  CLASSROOM_PICKER_DEFAULT_PROPS,
  CLASSROOM_PICKER_PROP_TYPES,
} from './ClassroomPicker.constants';
import { ClassroomPickerItem } from './components/ClassroomPickerItem';
import { ClassroomPickerList } from '../ClassroomPickerList';
import { ClassroomPickerStyles } from './ClassroomPicker.styles';

const ClassroomPicker = ({ programId, data, allowCollisions = false }) => {
  const [subjects, setSubjects] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [contentWidth, setContentWidth] = useState('auto');
  const [isOpen, setIsOpen] = useState(false);
  const [collisionItems, setCollisionItems] = useState([]);
  const { classes } = ClassroomPickerStyles({ contentWidth, isOpen }, { name: 'ClassroomPicker' });
  const targetRef = useRef(null);
  const contentRef = useRef(null);
  // const { data: classesData } = useProgramClasses(programId, { enabled: !!programId });
  useEffect(() => {
    const adjustContentWidth = () => {
      if (targetRef.current) {
        const width = `${targetRef.current.offsetWidth}px`;
        setContentWidth(width);
      }
    };
    adjustContentWidth();
    window.addEventListener('resize', adjustContentWidth);
    return () => window.removeEventListener('resize', adjustContentWidth);
  }, []);
  const handleTransformData = (data) =>
    data.map((item) => {
      const allDays = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ];
      const dayAbbreviations = {
        monday: 'Mo',
        tuesday: 'Tu',
        wednesday: 'We',
        thursday: 'Th',
        friday: 'Fr',
        saturday: 'Sa',
        sunday: 'Su',
      };
      const scheduleMap = item.schedule.reduce((acc, { day, start, end }) => {
        const key = `${start}-${end}`;
        if (!acc[key]) {
          acc[key] = [day];
        } else {
          acc[key].push(day);
        }
        return acc;
      }, {});

      const scheduleArray = Object.entries(scheduleMap).map(([key, days]) => {
        const [start, end] = key.split('-');
        const sortedDays = days.sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b));
        const daysAbbreviated = sortedDays.map((day) => dayAbbreviations[day]);

        let daysStr = '';
        let lastDayIndex = -2;
        let tempArray = [];

        daysAbbreviated.forEach((day, index) => {
          const currentIndex = allDays.indexOf(sortedDays[index]);
          if (lastDayIndex + 1 === currentIndex) {
            tempArray.push(day);
          } else {
            if (tempArray.length > 1) {
              daysStr += `${tempArray[0]} - ${tempArray[tempArray.length - 1]}, `;
            } else if (tempArray.length === 1) {
              daysStr += `${tempArray[0]}, `;
            }
            tempArray = [day];
          }
          lastDayIndex = currentIndex;
        });

        if (tempArray.length > 1) {
          daysStr += `${tempArray[0]} - ${tempArray[tempArray.length - 1]}`;
        } else if (tempArray.length === 1) {
          daysStr += `${tempArray[0]}`;
        }

        // Remove trailing comma if exists
        daysStr = daysStr.endsWith(', ') ? daysStr.slice(0, -2) : daysStr;

        return `${daysStr}, ${start}-${end}`;
      });
      return {
        value: item?.id,
        label: item?.subject?.name,
        subjectName: item?.subject?.name,
        subjectColor: item?.subject?.color,
        subjectIcon: item?.subject?.icon,
        schedule: scheduleArray,
      };
    });

  useEffect(() => {
    const transformedData = handleTransformData(data);
    setSubjects(transformedData);
  }, [data]);

  // const updateSubjects = (newSubjectsParam, number) => {
  //   let modifiedSubjects = [...newSubjectsParam];
  //   if (
  //     modifiedSubjects.length >= 1 &&
  //     !modifiedSubjects.some((subject) => subject.value === 'all')
  //   ) {
  //     const selectAll = {
  //       value: 'all',
  //       label: `All Subjects (${number})`,
  //       subjectName: `All Subjects (${number})`,
  //       subjectColor: 'rgb(180, 230, 0)',
  //       subjectIcon: <CheckIcon />,
  //       schedule: [],
  //     };
  //     setSubjects([selectAll, ...modifiedSubjects]);
  //   } else if (modifiedSubjects.some((subject) => subject.value === 'all')) {
  //     const allIndex = modifiedSubjects.findIndex((subject) => subject.value === 'all');
  //     if (allIndex !== -1) {
  //       modifiedSubjects = modifiedSubjects.map((subject, index) =>
  //         index === allIndex
  //           ? {
  //               ...subject,
  //               label: `All Subjects (${number - 1})`,
  //               subjectName: `All Subjects (${number - 1})`,
  //             }
  //           : subject
  //       );
  //     }
  //     if (modifiedSubjects.some((subject) => subject.value === 'all') && number - 1 === 0) {
  //       modifiedSubjects = modifiedSubjects.filter((subject) => subject.value !== 'all');
  //       setSubjects([]);
  //       return;
  //     }
  //     setSubjects(modifiedSubjects);
  //   }
  // };
  function convertTimeToMinutes(time) {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  function timeRangesOverlap(start1, end1, start2, end2) {
    const s1 = convertTimeToMinutes(start1);
    const e1 = convertTimeToMinutes(end1);
    const s2 = convertTimeToMinutes(start2);
    const e2 = convertTimeToMinutes(end2);
    return s1 < e2 && e1 > s2;
  }
  useEffect(() => {
    if (true) {
      const newCollisionItems = new Set();

      subjects.forEach((subject) => {
        subjectsList.forEach((listSubject) => {
          subject.schedule.forEach((subjectScheduleStr) => {
            listSubject.schedule.forEach((listSubjectScheduleStr) => {
              // Encontrar la última coma para separar los días de las horas
              const lastCommaIndexSubject = subjectScheduleStr.lastIndexOf(', ');
              const lastCommaIndexListSubject = listSubjectScheduleStr.lastIndexOf(', ');

              // Extraer los días y las horas de los horarios
              const subjectDaysStr = subjectScheduleStr.substring(0, lastCommaIndexSubject);
              const subjectTime = subjectScheduleStr.substring(lastCommaIndexSubject + 2);
              const listSubjectDaysStr = listSubjectScheduleStr.substring(
                0,
                lastCommaIndexListSubject
              );
              const listSubjectTime = listSubjectScheduleStr.substring(
                lastCommaIndexListSubject + 2
              );

              // Convertir los días en arrays para compararlos
              const subjectDaysArray = subjectDaysStr.split(', ');
              const listSubjectDaysArray = listSubjectDaysStr.split(', ');

              // Comprobar si hay algún día que coincida
              const collisionDay = subjectDaysArray.some((day) =>
                listSubjectDaysArray.includes(day)
              );

              if (collisionDay) {
                // Convertir las horas en rangos para compararlos
                const [subjectStart, subjectEnd] = subjectTime
                  .split('-')
                  .map((time) => time.trim());
                const [listSubjectStart, listSubjectEnd] = listSubjectTime
                  .split('-')
                  .map((time) => time.trim());

                // Comprobar si hay colisión en las horas
                if (timeRangesOverlap(subjectStart, subjectEnd, listSubjectStart, listSubjectEnd)) {
                  newCollisionItems.add(subject.value);
                }
              }
            });
          });
        });
      });

      // Actualizar el estado con los nuevos elementos que colisionan
      setCollisionItems([...newCollisionItems]);
    }
  }, [allowCollisions, subjectsList, subjects]);

  const handleSelectSubject = (subject) => {
    setSubjectsList((prevState) => [...prevState, subject]);
    setSubjects((prevState) => prevState.filter((item) => item.value !== subject.value));
  };
  const handleSelectAllSubjects = () => {
    setSubjectsList((prevState) => [...prevState, ...subjects]);
    setSubjects([]);
  };
  const handleRemoveSubjectFromList = (subject) => {
    setSubjects((prevState) => [...prevState, subject]);
    setSubjectsList((prevState) => prevState.filter((item) => item.value !== subject.value));
  };

  return (
    <Box>
      {/* <Select
        placeHolder={subjects.length > 0 ? 'Select subject ' : 'No more subjects available'}
        data={subjects}
        valueComponent={(item) => <ClassroomPickerItem {...item} />}
        itemComponent={(item) => (
          <Box onClick={() => handleSelectSubject(item)}>
            <ClassroomPickerItem {...item} />
          </Box>
        )}
      /> */}
      <Popover
        target={
          <Box ref={targetRef} className={classes.popoverButton}>
            <Text className={classes.popoverButtonText}>
              {subjects.length > 0 ? 'Select subject ' : 'No more subjects available'}
            </Text>
            <ChevronDownIcon height={12} width={12} className={classes.chevronIcon} />
          </Box>
        }
        closeOnEscape
        disabled={subjects.length === 0}
        shadow="none"
        withinPortal
        closeOnClickOutside
        onChange={() => setIsOpen(!isOpen)}
      >
        <Box ref={contentRef} className={classes.popoverContent}>
          {!allowCollisions && collisionItems?.length > 0 && (
            <Box className={classes.collisionContainer}>
              <AlertWarningTriangleIcon className={classes.collisionIcon} />
              <Text className={classes.collisionLabel}>
                {`Some subjects are not compatible: ${collisionItems?.length}`}
              </Text>
            </Box>
          )}
          {subjects?.length > 1 ? (
            <Box className={classes.allSubjectsContainer} onClick={() => handleSelectAllSubjects()}>
              <Box className={classes.allSubjectsCircle}>
                <CheckIcon width={12} height={12} />
              </Box>
              <Text
                className={classes.allSubjectsLabel}
              >{`All Subjects (${subjects?.length})`}</Text>
            </Box>
          ) : null}
          {subjects.map((subject) => {
            const collisionDetected = !allowCollisions && collisionItems?.includes(subject.value);
            return (
              <Box
                key={subject.value}
                onClick={() => !collisionDetected && handleSelectSubject(subject)}
              >
                <ClassroomPickerItem {...subject} isCollisionDetected={collisionDetected} />
              </Box>
            );
          })}
        </Box>
      </Popover>
      <ClassroomPickerList subjects={subjectsList} onRemove={handleRemoveSubjectFromList} />
    </Box>
  );
};

ClassroomPicker.defaultProps = CLASSROOM_PICKER_DEFAULT_PROPS;

export { ClassroomPicker };
