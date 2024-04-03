import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isArray, isEmpty, omit } from 'lodash';
import { Table, Stack, ActionButton, Tooltip } from '@bubbles-ui/components';
import { ArchiveIcon, EditWriteIcon, RestoreIcon } from '@bubbles-ui/icons/solid';

import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
import { useSubjectDetails } from '@academic-portfolio/hooks';

const SubjectsDetailTable = ({
  subjectIds,
  labels,
  onEdit,
  onDuplicate,
  onArchive,
  onRestore,
  isShowingArchivedSubjects,
}) => {
  const { data: subjectsDetailQuery, isLoading: isSubjectsDetailLoading } = useSubjectDetails(
    subjectIds,
    { enabled: subjectIds?.length > 0 },
    true,
    isShowingArchivedSubjects
  );

  const getSubjectClassesString = (classes) => {
    const subjectWithReferenceGroups = classes?.some((classItem) => !isEmpty(classItem.groups));
    if (subjectWithReferenceGroups) {
      return classes
        ?.map((classItem) => classItem.groups?.abbreviation)
        .sort()
        .join(', ');
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
        const classes = _subject?.classes ?? [];
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
      return subjectClassesData?.map((item) => {
        let subjectsHasPeopleEnrolled = false;
        item.classes?.forEach((c) => {
          if (c.students?.length || c.teachers?.length) subjectsHasPeopleEnrolled = true;
        });
        return {
          ...item,
          actions: (
            <Stack justifyContent="end" fullWidth>
              {!isShowingArchivedSubjects && (
                <ActionButton
                  tooltip={labels?.edit}
                  onClick={() => handleOnEdit(item)}
                  icon={<EditWriteIcon width={18} height={18} />}
                />
              )}
              {!isShowingArchivedSubjects && (
                <ActionButton
                  onClick={() => onDuplicate(item)}
                  tooltip={labels?.duplicate}
                  icon={<DuplicateIcon width={18} height={18} />}
                />
              )}
              <Tooltip
                multiline
                autoHeight
                size="md"
                width={280}
                label={labels?.cannotArchiveTooltip}
                disabled={!subjectsHasPeopleEnrolled}
              >
                <Stack>
                  <ActionButton
                    tooltip={isShowingArchivedSubjects ? labels?.restore : labels?.archive}
                    disabled={subjectsHasPeopleEnrolled}
                    icon={
                      !isShowingArchivedSubjects ? (
                        <ArchiveIcon width={18} height={18} onClick={() => onArchive(item)} />
                      ) : (
                        <RestoreIcon width={18} height={18} onClick={() => onRestore(item)} />
                      )
                    }
                  />
                </Stack>
              </Tooltip>
            </Stack>
          ),
        };
      });
    }
    return [];
  }, [subjectClassesData, isShowingArchivedSubjects, labels]);

  const tableColumns = useMemo(
    () => [
      {
        Header: labels?.subject,
        accessor: 'name',
      },
      {
        Header: labels?.courses,
        accessor: 'courses',
        valueRender: (coursesValue) => getCoursesTextToShow(coursesValue),
      },
      {
        Header: labels?.substages,
        accessor: 'substage',
        valueRender: (substagesValue) =>
          substagesValue?.length ? substagesValue[0].abbreviation : labels.noSubstages, // Only one substage per subject currently
      },
      {
        Header: labels?.classrooms,
        accessor: 'classes',
        valueRender: (classesValue) => getSubjectClassesString(classesValue),
      },
      {
        Header: labels?.type,
        accessor: 'subjectType',
        valueRender: (subjectTypeValue) => subjectTypeValue?.name ?? '',
      },
      {
        Header: labels?.actions,
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
  isShowingArchivedSubjects: PropTypes.bool,
  onDuplicate: PropTypes.func,
  onArchive: PropTypes.func,
  onRestore: PropTypes.func,
};

export default SubjectsDetailTable;
