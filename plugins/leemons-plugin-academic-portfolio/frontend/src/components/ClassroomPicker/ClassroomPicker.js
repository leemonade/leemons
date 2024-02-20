import React, { useEffect, useState } from 'react';
// import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { Box, Select } from '@bubbles-ui/components';
// import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { CheckIcon } from '@bubbles-ui/icons/solid';
import {
  CLASSROOM_PICKER_DEFAULT_PROPS,
  CLASSROOM_PICKER_PROP_TYPES,
} from './ClassroomPicker.constants';
import { ClassroomPickerItem } from './components/ClassroomPickerItem';
import { ClassroomPickerList } from '../ClassroomPickerList';

const ClassroomPicker = ({ programId, data }) => {
  const [subjects, setSubjects] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  // const { data: classesData } = useProgramClasses(programId, { enabled: !!programId });

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

  const updateSubjects = (newSubjectsParam, number) => {
    let modifiedSubjects = [...newSubjectsParam];
    if (
      modifiedSubjects.length >= 1 &&
      !modifiedSubjects.some((subject) => subject.value === 'all')
    ) {
      const selectAll = {
        value: 'all',
        label: `All Subjects (${number})`,
        subjectName: `All Subjects (${number})`,
        subjectColor: 'rgb(180, 230, 0)',
        subjectIcon: <CheckIcon />,
        schedule: [],
      };
      setSubjects([selectAll, ...modifiedSubjects]);
    } else if (modifiedSubjects.some((subject) => subject.value === 'all')) {
      const allIndex = modifiedSubjects.findIndex((subject) => subject.value === 'all');
      if (allIndex !== -1) {
        modifiedSubjects = modifiedSubjects.map((subject, index) =>
          index === allIndex
            ? {
                ...subject,
                label: `All Subjects (${number - 1})`,
                subjectName: `All Subjects (${number - 1})`,
              }
            : subject
        );
      }
      if (modifiedSubjects.some((subject) => subject.value === 'all') && number - 1 === 0) {
        modifiedSubjects = modifiedSubjects.filter((subject) => subject.value !== 'all');
        setSubjects([]);
        return;
      }
      setSubjects(modifiedSubjects);
    }
  };

  useEffect(() => {
    if (data) {
      const dataParsed = handleTransformData(data);
      updateSubjects(dataParsed, dataParsed.length); // Usamos updateSubjects aquí para manejar la lógica de "All Subjects"
    }
  }, [data]);

  const handleSelectSubject = (subject) => {
    if (subject.value === 'all') {
      const allSubjectsExceptAll = subjects.filter((s) => s.value !== 'all');
      setSubjectsList((prevSubjectsList) => [...prevSubjectsList, ...allSubjectsExceptAll]);
      setSubjects([]);
    } else {
      const newSubjects = subjects.filter((s) => s.value !== subject.value);
      setSubjectsList((prevSubjectsList) => [...prevSubjectsList, subject]);
      updateSubjects(newSubjects, newSubjects.length);
    }
  };
  const handleRemoveSubjectFromList = (subjectItem) => {
    const newSubjectsList = subjectsList.filter((s) => s.value !== subjectItem.value);
    const isSubjectItemPresent = subjects.some((s) => s.value === subjectItem.value);
    const updatedSubjects = isSubjectItemPresent ? subjects : [...subjects, subjectItem];
    setSubjectsList(newSubjectsList);
    updateSubjects(updatedSubjects, updatedSubjects.length);
  };
  return (
    <Box>
      <Select
        placeHolder={subjects.length > 0 ? 'Select subject ' : 'No more subjects available'}
        data={subjects}
        valueComponent={(item) => <ClassroomPickerItem {...item} />}
        itemComponent={(item) => (
          <Box onClick={() => handleSelectSubject(item)}>
            <ClassroomPickerItem {...item} />
          </Box>
        )}
      />
      <ClassroomPickerList subjects={subjectsList} onRemove={handleRemoveSubjectFromList} />
    </Box>
  );
};

ClassroomPicker.propTypes = CLASSROOM_PICKER_PROP_TYPES;
ClassroomPicker.defaultProps = CLASSROOM_PICKER_DEFAULT_PROPS;

export { ClassroomPicker };
