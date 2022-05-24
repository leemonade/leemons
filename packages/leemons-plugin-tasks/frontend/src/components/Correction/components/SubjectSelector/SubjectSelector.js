import React, { useMemo, useState } from 'react';
import _ from 'lodash';
import { Box, Title, Text, ImageLoader, Swiper, Loader } from '@bubbles-ui/components';
import { useSubjects } from '@academic-portfolio/hooks';
import SubjectCard from './components/SubjectCard';

export default function SubjectSelector({ assignation }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const subjectsIds = useMemo(
    () => _.map(assignation.instance.assignable.subjects, 'subject'),
    [assignation?.instance?.assignable?.subjects]
  );

  console.log('grades', assignation.grades);

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

  console.log('gradesBySubject', gradesBySubject);

  let subjects = useSubjects(subjectsIds);
  if (subjects.length) {
    subjects = Array.from(Array(10).keys()).fill(subjects[0], 0, 10);
  }
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
      onSelectIndex={setSelectedIndex}
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
