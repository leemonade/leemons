import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isArray, isEmpty, omit } from 'lodash';
import { Table, Stack, ActionButton } from '@bubbles-ui/components';
import { ArchiveIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';

import { useSubjectDetails } from '@academic-portfolio/hooks';

const SubjectsDetailTable = ({ subjectIds, labels, onEdit }) => {
  const { data: subjectsDetailQuery, isLoading: isSubjectsDetailLoading } = useSubjectDetails(
    subjectIds,
    { enabled: subjectIds?.length > 0 },
    true
  );

  const getSubjectClassesString = (classes) => {
    const subjectWithReferenceGroups = classes?.some((classItem) => !isEmpty(classItem.groups));
    if (subjectWithReferenceGroups) {
      return classes?.map((classItem) => classItem.groups.abbreviation).join(', ');
    }
    return classes?.map((_, index) => String(index + 1).padStart(3, '0')).join(', ');
  };

  const getCoursesTextToShow = (courses) => {
    let coursesText = '';
    if (isArray(courses)) {
      coursesText = courses.map(({ index }) => `${index}º`).join(', ');
    } else if (courses?.index !== undefined) {
      coursesText = `${courses.index}º`;
    }
    return coursesText;
  };

  const addUniqueCourse = (_class, allClassesCourses) => {
    // The courses field of a class might be an array when they are tagged with subjects that allow multple courses
    if (Array.isArray(_class.courses)) {
      _class.courses.forEach((course) => {
        if (!allClassesCourses.find((c) => c.id === course.id)) {
          allClassesCourses.push(course);
        }
      });
    } else if (
      _class.courses &&
      !allClassesCourses.find((course) => course.id === _class.courses.id)
    ) {
      allClassesCourses.push(_class.courses);
    }
  };

  const subjectClassesData = useMemo(() => {
    const processedSubjects = {};

    if (subjectsDetailQuery?.length) {
      subjectsDetailQuery.forEach((_subject) => {
        const { classes } = _subject;
        const allClassesCourses = [];
        classes.forEach((_class) => addUniqueCourse(_class, allClassesCourses));

        const knowledgeArea = classes?.reduce((acc, curr) => curr.knowledges || acc, null);
        const subjectType = classes?.reduce((acc, curr) => curr.subjectType || acc, null);
        const substage = classes?.reduce((acc, curr) => curr.substages || acc, null);

        processedSubjects[_subject.id] = {
          ..._subject,
          substage,
          knowledgeArea,
          subjectType,
          courses: allClassesCourses,
        };
      });

      return Object.values(processedSubjects);
    }
    return [];
  }, [subjectsDetailQuery]);

  const handleOnEdit = (item) => {
    const subjectAndItsClassesForSubjectForm = {
      ...omit(item, ['course', 'substages']),
      substage: item.substage?.length ? item.substage[0].id : 'all',
      image: item.image || null,
      icon: item.icon || null,
    };

    onEdit(subjectAndItsClassesForSubjectForm);
  };

  const tableData = useMemo(() => {
    if (subjectClassesData?.length) {
      return subjectClassesData?.map((item) => ({
        ...item,
        actions: (
          <Stack justifyContent="end" fullWidth>
            <ActionButton
              tooltip="Editar 🌎"
              onClick={() => handleOnEdit(item)}
              icon={<EditWriteIcon width={18} height={18} />}
            />
            <ActionButton tooltip="Duplicar 🌎" icon={<DuplicateIcon width={18} height={18} />} />
            <ActionButton tooltip="Archivar 🌎" icon={<ArchiveIcon width={18} height={18} />} />
          </Stack>
        ),
      }));
    }
    return [];
  }, [subjectClassesData]);

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Asignatura 🌎' || labels?.subject,
        accessor: 'name',
      },
      {
        Header: 'Cursos 🌎' || labels?.courses,
        accessor: 'courses',
        valueRender: (coursesValue) => getCoursesTextToShow(coursesValue),
      },
      {
        Header: 'Subetapas 🌎' || labels?.substages,
        accessor: 'substage',
        valueRender: (substagesValue) =>
          substagesValue?.length ? substagesValue[0].abbreviation : 'Curso completo 🌎', // Only one substage per subject currently
      },
      {
        Header: 'Aulas 🌎' || labels?.classes,
        accessor: 'classes',
        valueRender: (classesValue) => getSubjectClassesString(classesValue),
      },
      {
        Header: 'Tipo 🌎' || labels?.type,
        accessor: 'subjectType',
        valueRender: (subjectTypeValue) => subjectTypeValue?.name ?? '',
      },
      {
        Header: 'ACTIONS',
        accessor: 'actions',
        style: { width: 100, textAlign: 'center' },
      },
    ],
    [labels]
  );

  if (isSubjectsDetailLoading) return null;
  return <Table columns={tableColumns} data={tableData} />;
};

SubjectsDetailTable.propTypes = {
  subjectIds: PropTypes.array,
  labels: PropTypes.object,
  onEdit: PropTypes.func,
};

export default SubjectsDetailTable;
