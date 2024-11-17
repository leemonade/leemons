import React from 'react';
import PropTypes from 'prop-types';

import { Select, Stack } from '@bubbles-ui/components';
import { noop } from 'lodash';
import { Controller, useForm, useWatch } from 'react-hook-form';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import getCourseName from '@academic-portfolio/helpers/getCourseName';
import useSubjects from './hooks/useSubjects';
import useCourses from './hooks/useCourses';
import useOnChange from './hooks/useOnChange';

export default function SelectSubjectAndCourse({ program, onChange = noop }) {
  const [t] = useTranslateLoader(prefixPN('selectSubjectAndCourse'));
  const form = useForm({});

  const subject = useWatch({ name: 'subject', control: form.control });

  const { subjects } = useSubjects({ program });
  const { courses } = useCourses({ program, subject });

  useOnChange({ onChange, control: form.control });

  const showCourseSelect = courses.length > 1;

  return (
    <Stack spacing={4}>
      <Controller
        name="subject"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            data={subjects.map(({ id, name } = {}) => ({
              value: id,
              label: name,
            }))}
            placeholder={t('subject')}
            autoSelectOneOption
            cleanOnMissingValue
          />
        )}
      />

      {showCourseSelect && (
        <Controller
          name="course"
          control={form.control}
          shouldUnregister
          render={({ field }) => (
            <Select
              {...field}
              data={courses.map((course) => ({
                value: course.id,
                label: getCourseName(course),
              }))}
              placeholder={t('course')}
              autoSelectOneOption
              cleanOnMissingValue
              sx={{ width: 100 }}
            />
          )}
        />
      )}
    </Stack>
  );
}

SelectSubjectAndCourse.propTypes = {
  program: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
