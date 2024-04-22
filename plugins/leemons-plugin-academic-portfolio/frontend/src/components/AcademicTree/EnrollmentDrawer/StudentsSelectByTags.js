import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { ContextContainer, Stack, Checkbox } from '@bubbles-ui/components';

import { TagsAutocomplete } from '@common';
import { getStudentsByTagsRequest } from '@academic-portfolio/request';
import { SearchIcon } from '@bubbles-ui/icons/outline';
import StudentsTable from '../SubjectView/StudentsTable';

const StudentsSelectByTags = ({
  centerId,
  previouslyEnrolledStudents,
  setSelectedStudents,
  localizations,
}) => {
  const [tags, setTags] = useState();
  const [studentsFound, setStudentsFound] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const checkBoxColumn = useMemo(
    () => ({
      Header: (
        <Checkbox
          checked={selectAll}
          onChange={(value) => {
            setStudentsFound(
              studentsFound.map((student) => ({
                ...student,
                checked: { ...student.checked, checked: value },
              }))
            );
            setSelectAll(value);
          }}
        />
      ),
      accessor: 'checked',
      valueRender: (checkedValue) => (
        <Checkbox
          checked={checkedValue.checked}
          onChange={(val) => {
            const updatedStudents = studentsFound.map((student) => {
              if (student.userAgent === checkedValue.userAgent) {
                return { ...student, checked: { ...student.checked, checked: val } };
              }
              return student;
            });
            setStudentsFound(updatedStudents);
          }}
        />
      ),
    }),
    [selectAll, studentsFound]
  );

  const onTagsChange = async (tagsValue) => {
    setTags(tagsValue);
    const response = await getStudentsByTagsRequest(tagsValue, centerId);

    if (response.students?.length) {
      const filteredStudents = previouslyEnrolledStudents?.length
        ? response.students.filter(
            (student) =>
              !previouslyEnrolledStudents
                .map((prevStudent) => prevStudent.value)
                .includes(student.id)
          )
        : response.students;

      setStudentsFound([
        ...filteredStudents.map((student) => ({
          ...student.user,
          userAgent: student.id,
          checked: { userAgent: student.id, checked: false },
        })),
      ]);
    }
  };

  useEffect(() => {
    if (studentsFound?.length) {
      const checkedUsers = studentsFound
        .filter((student) => student.checked.checked)
        .map(({ userAgent, ...others }) => ({ ...others, value: userAgent }));
      setSelectedStudents(checkedUsers);
    }
  }, [studentsFound]);

  return (
    <Stack direction="column">
      <ContextContainer sx={{ padding: '24px' }}>
        <TagsAutocomplete
          onChange={onTagsChange}
          pluginName="users"
          value={tags}
          labels={{ addButton: localizations?.search }}
          ButtonLeftIcon={<SearchIcon width={24} height={24} />}
        />
        <StudentsTable data={studentsFound} checkBoxColumn={checkBoxColumn} />
      </ContextContainer>
    </Stack>
  );
};

StudentsSelectByTags.propTypes = {
  centerId: PropTypes.string.isRequired,
  previouslyEnrolledStudents: PropTypes.array,
  setSelectedStudents: PropTypes.func.isRequired,
  localizations: PropTypes.object,
};

export default StudentsSelectByTags;
