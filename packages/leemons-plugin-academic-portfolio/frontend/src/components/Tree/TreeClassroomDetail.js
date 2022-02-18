import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ColorInput,
  ContextContainer,
  MultiSelect,
  NumberInput,
  Select,
  Title,
} from '@bubbles-ui/components';
import { ScheduleInput } from '@timetable/components';
import { find, map } from 'lodash';

const TreeClassroomDetail = ({ classe, program, messages, onSave, saving, teacherSelect }) => {
  const selects = React.useMemo(
    () => ({
      courses: map(program.courses, ({ name, index, id }) => ({
        label: `${name ? `${name} (${index}º)` : `${index}º`}`,
        value: id,
      })),
      knowledges: map(program.knowledges, ({ name, id }) => ({
        label: name,
        value: id,
      })),
      groups: map(program.groups, ({ name, id }) => ({
        label: name,
        value: id,
      })),

      substages: map(program.substages, ({ name, abbreviation, id }) => ({
        label: `${name}${abbreviation ? ` [${abbreviation}]` : ''}`,
        value: id,
      })),
    }),
    [program]
  );

  function classForForm() {
    const teacher = find(classe.teachers, { type: 'main-teacher' });
    return {
      id: classe.id,
      course: program.moreThanOneAcademicYear ? map(classe.courses, 'id') : classe.courses?.id,
      knowledge: classe.knowledges?.id,
      substage: classe.substages?.id,
      group: classe.groups?.id,
      color: classe.color,
      seats: classe.seats,
      schedule: classe.schedule ? { days: classe.schedule } : { days: [] },
      teacher: teacher ? teacher.teacher : null,
    };
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: classForForm() });

  React.useEffect(() => {
    reset(classForForm());
  }, [classe]);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <form onSubmit={handleSubmit(onSave)}>
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{messages.title}</Title>
          {program.maxNumberOfCourses > 0 ? (
            <Box>
              <Controller
                control={control}
                name="course"
                render={({ field }) => {
                  if (program.moreThanOneAcademicYear) {
                    return (
                      <MultiSelect data={selects.courses} label={messages.courseLabel} {...field} />
                    );
                  }
                  return <Select data={selects.courses} label={messages.courseLabel} {...field} />;
                }}
              />
            </Box>
          ) : null}

          <Box>
            <Controller
              control={control}
              name="group"
              render={({ field }) => (
                <Select data={selects.groups} label={messages.groupLabel} {...field} />
              )}
            />
          </Box>
          {program.haveSubstagesPerCourse ? (
            <Box>
              <Controller
                control={control}
                name="substage"
                render={({ field }) => (
                  <Select data={selects.substages} label={messages.substageLabel} {...field} />
                )}
              />
            </Box>
          ) : null}

          {program.haveKnowledge ? (
            <Box>
              <Controller
                control={control}
                name="knowledge"
                render={({ field }) => (
                  <Select data={selects.knowledges} label={messages.knowledgeLabel} {...field} />
                )}
              />
            </Box>
          ) : null}

          <Box>
            <Controller
              control={control}
              name="seats"
              render={({ field }) => <NumberInput label={messages.seatsLabel} {...field} />}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="color"
              render={({ field }) => <ColorInput label={messages.colorLabel} {...field} />}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="schedule"
              render={({ field }) => <ScheduleInput label={messages.scheduleLabel} {...field} />}
            />
          </Box>

          <Box>
            <Controller
              control={control}
              name="teacher"
              render={({ field }) =>
                React.cloneElement(teacherSelect, { label: messages.teacherLabel, ...field })
              }
            />
          </Box>

          <Box>
            <Button loading={saving} type="submit">
              {messages.save}
            </Button>
          </Box>
        </ContextContainer>
      </form>
    </Box>
  );
};

TreeClassroomDetail.propTypes = {
  classe: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  program: PropTypes.object,
  teacherSelect: PropTypes.any,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeClassroomDetail };
