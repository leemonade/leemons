import React, { useMemo, useState } from 'react';
import _ from 'lodash';
import { Box, Title, Text, ImageLoader, Swiper, Loader } from '@bubbles-ui/components';
import { useSubjects, useClassesSubjects } from '@academic-portfolio/hooks';
import SubjectCard from './components/SubjectCard';

export default function SubjectSelector({ assignation }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const instanceSubjects = useClassesSubjects(assignation?.instance?.classes);
  const subjectsIds = useMemo(() => _.map(instanceSubjects, 'id'), [instanceSubjects]);
  const subjects = useSubjects(subjectsIds);

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
