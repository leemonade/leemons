import React, { useState } from 'react';

import {
  SelectCourse,
  SelectProgram,
  SelectSubject,
} from '@academic-portfolio/components/Selectors';
import { listCoursesRequest } from '@academic-portfolio/request';
import { Box, Stack } from '@bubbles-ui/components';
import { SelectCenter } from '@users/components';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';

function Filters({ onChange = noop }) {
  const [centerId, setCenterId] = useState(null);
  const [programId, setProgramId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [hasCourses, setHasCourses] = useState(false);
  const [coursesCount, setCoursesCount] = useState(0);

  async function onSelectCenter(centerId) {
    setCourseId(null);
    setProgramId(null);
    setSubjectId(null);
    setCenterId(centerId);
  }

  async function onSelectProgram(programId) {
    setCourseId(null);
    setSubjectId(null);
    setProgramId(programId);

    const {
      data: { items },
    } = await listCoursesRequest({ page: 0, size: 9999, program: programId });
    let programHasCourses = items.length > 0;

    if (items[0].isAlone) {
      programHasCourses = false;
    }

    setHasCourses(programHasCourses);
    setCoursesCount(items.length);
  }

  function onSelectCourse(courseId) {
    setSubjectId(null);
    setCourseId(courseId);
  }

  function onSelectSubject(value) {
    setSubjectId(value);
    onChange({ centerId, programId, courseId, subjectId: value });
  }

  return (
    <Stack spacing={2}>
      <SelectCenter onChange={onSelectCenter} value={centerId} />
      <SelectProgram firstSelected onChange={onSelectProgram} center={centerId} value={programId} />

      {hasCourses && (
        <Box sx={{ display: coursesCount > 1 ? 'flex' : 'none' }}>
          <SelectCourse
            firstSelected
            onChange={onSelectCourse}
            program={programId}
            value={courseId}
          />
        </Box>
      )}

      <SelectSubject
        program={programId}
        course={courseId}
        onChange={onSelectSubject}
        value={subjectId}
        allowNullValue
      />
    </Stack>
  );
}

Filters.propTypes = {
  onChange: PropTypes.func,
};

export { Filters };
