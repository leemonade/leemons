import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isArray, isEmpty, omit } from 'lodash';
import { Table, Stack, ActionButton } from '@bubbles-ui/components';
import { ArchiveIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';

import useSubjectClasses from '@academic-portfolio/hooks/useSubjectClasses';
import { useSubjectDetails } from '@academic-portfolio/hooks';

const SubjectsDetailTable = ({ subjectIds, labels, onEdit }) => {
  const { data: subjectsClassesQuery, isLoading: areSubjectsClassesLoading } = useSubjectClasses(
    subjectIds,
    {
      enabled: subjectIds?.length > 0,
    }
  );

  // TODO BACKEND: FIX THE SUBJECT DETAIL QUERY
  const { data: subjectsDetailQuery, isLoading: isSubjectsDetailLoading } = useSubjectDetails(
    subjectIds,
    { enabled: subjectIds?.length > 0 },
    true
  );

  console.log('subjectsDetailQuery', subjectsDetailQuery);

  const getSubjectClassesString = (classes) => {
    const subjectWithReferenceGroups = classes?.some((classItem) => !isEmpty(classItem.groups));
    if (subjectWithReferenceGroups) {
      return classes.map((classItem) => classItem.groups.abbreviation).join(', ');
    }
    return classes.map((_, index) => String(index + 1).padStart(3, '0')).join(', ');
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

  const subjectClassesData = useMemo(() => {
    const processedSubjects = {};

    if (subjectsClassesQuery?.length) {
      subjectsClassesQuery.forEach((item) => {
        const { subject, courses, substages, subjectType, knowledges } = item;
        if (!processedSubjects[subject._id]) {
          processedSubjects[subject._id] = {
            name: subject.name,
            id: subject.id,
            courses,
            // Currently only one substage can be asociated, but it could change
            substages,
            subjectType,
            classes: [item],
            color: subject.color,
            knowledgeArea: knowledges?.id,
            subjectValueForCourses: subject.course,
            image: subject.image,
            icon: subject.image,
          };
        } else {
          processedSubjects[subject._id].classes.push(item);
        }
      });

      return Object.values(processedSubjects);
    }
    return [];
  }, [subjectsClassesQuery]);

  const handleOnEdit = (item) => {
    // TODO backend needs to bring the internal id object
    // TODO backend needs to bring the credits of the subject

    const subjectAndItsClassesForSubjectForm = {
      ...omit(item, ['subjectValueForCourses', 'substages', 'classes']),
      substage: item.substages.length ? item.substages[0].id : 'all',
      subjectType: item.subjectType?.id || null,
      courses: item.subjectValueForCourses,
      image: item.image?.url || null,
      icon: item.image?.url || null,
      classes: item.classes,
    };

    onEdit(subjectAndItsClassesForSubjectForm);
  };

  const tableData = useMemo(() => {
    if (subjectClassesData?.length) {
      return subjectClassesData.map((item) => ({
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
        accessor: 'substages',
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

  if (areSubjectsClassesLoading) return null;
  return <Table columns={tableColumns} data={tableData} />;
};

SubjectsDetailTable.propTypes = {
  subjectIds: PropTypes.array,
  labels: PropTypes.object,
  onEdit: PropTypes.func,
};

export default SubjectsDetailTable;
