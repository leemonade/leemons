import React, { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import { Box, Swiper, Loader } from '@bubbles-ui/components';
import SubjectCard from './components/SubjectCard';

export default function SubjectSelector({
  assignation,
  subjects,
  currentSubject,
  setCurrentSubject,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const subjectsIds = useMemo(() => _.map(subjects, 'id'), [subjects]);
  useEffect(() => {
    const subjectIndex = subjectsIds.indexOf(currentSubject);
    if (subjectIndex !== -1 && subjectIndex !== selectedIndex) {
      setSelectedIndex(subjectIndex);
    }
  }, [currentSubject, subjectsIds]);

  useEffect(() => {
    if (subjectsIds?.length && !currentSubject && typeof setCurrentSubject === 'function') {
      setCurrentSubject(subjectsIds[selectedIndex]);
    }
  }, [subjectsIds]);

  const handleSelectIndex = (newIndex) => {
    if (currentSubject !== undefined) {
      if (typeof setCurrentSubject === 'function' && currentSubject !== subjectsIds[newIndex]) {
        setCurrentSubject(subjectsIds[newIndex]);
      }
    } else if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
    }
  };

  const gradesBySubject = useMemo(
    () =>
      assignation.grades.reduce((acc, grade) => {
        if (grade.type === 'main') {
          return {
            ...acc,
            [grade.subject]: grade,
          };
        }

        return acc;
      }, {}),
    [assignation.grades]
  );

  if (!subjects.length) {
    return (
      <Box>
        <Loader />
      </Box>
    );
  }

  if (subjects.length === 1) {
    return null;
  }

  return (
    <Swiper
      onSelectIndex={handleSelectIndex}
      selectable
      deselectable={false}
      disableSelectedStyles
      breakAt={{
        360: {
          slidesPerView: 1,
          spaceBetween: 40,
        },
        800: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        940: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      }}
    >
      {subjects.map((subject, i) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          selected={selectedIndex === i}
          corrected={Boolean(gradesBySubject[subject.id])}
        />
      ))}
    </Swiper>
  );
}
