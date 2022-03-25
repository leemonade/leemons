import React, { useState, useEffect, useRef, forwardRef, useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  RadioGroup,
  CheckBoxGroup,
  Select,
  Button,
  ContextContainer,
  Box,
  Text,
} from '@bubbles-ui/components';
import { DeleteIcon } from '@bubbles-ui/icons/solid';
import { useForm, useFormContext, FormProvider, Controller, useWatch } from 'react-hook-form';
import { getCentersWithToken } from '@users/session';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { listTeacherClassesRequest } from '@academic-portfolio/request';
import { useApi } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { getProfiles } from '../../request/profiles';
import ConditionalInput from '../Inputs/ConditionalInput';
// export default function AssignUsers({ labels, profile, assignTo, onChange }) {
//   const [data, setData] = useState([]);
//   const [centers] = useApi(getCentersWithToken);
//   const [assignees, setAssignees] = useState([]);
//   const userAgents = useRef({ centers: [], agents: [] });
//   const [profiles, setProfiles] = useState(null);

//   const {
//     handleSubmit,
//     formState: { errors },
//     control,
//     watch,
//     resetField,
//   } = useForm({
//     defaultValues: {},
//   });

//   // EN: react-hook-form watcher for the assignTo field
//   // ES: react-hook-form watcher para el campo assignTo
//   const assignToValue = watch('assign');

//   // EN: Render the needed selector (class or student)
//   // ES: Renderiza el selector necesario (clase o estudiante)
//   const AssigneeSelector = useMemo(() => {
//     const Component = forwardRef((props, ref) => {
//       if (assignToValue === 'class') {
//         return <Select fullWidth {...props} ref={ref} data={data} disabled={!data.length} />;
//       }
//       if (assignToValue === 'student') {
//         return <SelectUserAgent maxSelectedValues={0} {...props} />;
//       }
//       return <></>;
//     });
//     Component.displayName = 'AssigneeSelector';

//     return Component;
//   }, [assignToValue, data]);

//   useEffect(async () => {
//     const p = await getProfiles(profile);
//     setProfiles([p[0].profile]);
//   }, []);

//   // EN: When the assignee changes, we need to reset the form
//   // ES: Cuando el asignado cambia, necesitamos resetear el formulario
//   useEffect(() => {
//     if (assignToValue) {
//       resetField('assignee');
//     }
//   }, [assignToValue]);

//   // EN: Fetch the needed data for the assignee selector
//   // ES: Obtiene los datos necesarios para el selector de asignado
//   useEffect(async () => {
//     if (assignToValue === 'class') {
//       // EN: Get the new userAgents if required
//       // ES: Obtener los nuevos userAgents si es necesario
//       if (userAgents.current.centers !== centers) {
//         userAgents.current = {
//           centers,
//           agents: (await getCentersWithToken()).map((agent) => agent.userAgentId),
//         };
//       }

//       // EN: Get the classes the teacher has
//       // ES: Obtener las clases que tiene el profesor
//       const classes = _.flatten(
//         await Promise.all(
//           userAgents.current.agents.map(
//             async (agent) =>
//               (
//                 await listTeacherClassesRequest({
//                   page: 0,
//                   size: 100,
//                   teacher: agent,
//                 })
//               ).data.items
//           )
//         )
//       ).map((_class) => ({
//         value: _class.id,
//         // TODO: Update to standard class name
//         label: `${_class.courses.name || _class.courses.index} - ${_class.subject.name}`,
//       }));

//       setData(classes);
//     } else {
//       setData([]);
//     }
//   }, [assignToValue, centers]);

//   // EN: Emit the change to the parent component
//   // ES: Emite el cambio al componente padre
//   useEffect(() => {
//     if (typeof onChange === 'function') {
//       onChange(assignees);
//     }
//   }, [assignees, onChange]);

//   const assigneeLabel =
//     assignToValue === 'class' ? labels.classroomToAssign : labels.studentToAssign;

//   // EN: Handle the form submit
//   // ES: Maneja el submit del formulario
//   const onSubmit = (value) => {
//     if (value.assign && value.assignee) {
//       if (value.assign === 'class') {
//         const exists = assignees.find((assignee) => assignee.group === value.assignee);

//         // EN: Do not allow to duplicate existing classes
//         // ES: No permitir duplicar clases existentes
//         if (exists) {
//           // TRANSLATE: Already assigned class error
//           addErrorAlert('Tried to assign a class that is already assigned');
//           return;
//         }

//         setAssignees((a) => [
//           ...a,
//           {
//             group: value.assignee,
//             label: data.find((d) => d.value === value.assignee)?.label,
//             type: 'class',
//           },
//         ]);
//         return;
//       }
//       setAssignees((a) => [...a, { students: value.assignee, subject: 'WIP', type: 'students' }]);
//     }
//   };

//   // EN: Handle the assignee delete
//   // ES: Maneja el eliminado del asignado
//   const removeAssignee = (assigneeToRemove) => {
//     setAssignees((a) => a.filter((assigneeToTest) => assigneeToTest !== assigneeToRemove));
//   };

//   return (
//     <>
//       <ContextContainer alignItems="end" direction="row">
//         <Controller
//           control={control}
//           name="assign"
//           // TRANSLATE: Assign required
//           rules={{ required: 'Assign required' }}
//           render={({ field }) => (
//             <Select
//               fullWidth
//               error={errors.assign}
//               label={labels?.assignTo}
//               {...field}
//               data={assignTo}
//             />
//           )}
//         />
//         {assignToValue === 'student' && <p>Select subject</p>}
//         {assignToValue && (
//           <Controller
//             control={control}
//             name="assignee"
//             // TRANSLATE: Asssignee Required
//             rules={{ required: 'Assignee Required' }}
//             render={({ field }) => (
//               <AssigneeSelector
//                 profiles={profiles}
//                 error={errors.assignee}
//                 label={assigneeLabel}
//                 {...field}
//               />
//             )}
//           />
//         )}
//         <Button size="sm" onClick={handleSubmit(onSubmit)}>
//           Add
//         </Button>
//       </ContextContainer>
//       <Box>
//         {assignees.map((o, i) => {
//           const { type, label, students } = o;
//           return (
//             <Box key={i}>
//               <Text>
//                 {/* TRANSLATE: Class name display and students length display */}
//                 {type} - {type === 'class' ? label : `${students.length} students`}
//               </Text>
//               <DeleteIcon onClick={() => removeAssignee(o)} />
//             </Box>
//           );
//         })}
//       </Box>
//     </>
//   );
// }

function AssigneeTypeSelector({ labels, onChange, value }) {
  const options = useMemo(
    () => [
      {
        value: 'class',
        label: labels.assignTo.class,
      },
      {
        value: 'customGroups',
        label: labels.assignTo.customGroups,
      },
      {
        value: 'session',
        label: labels.assignTo.session,
      },
    ],
    [labels]
  );

  return <RadioGroup data={options} onChange={onChange} value={value} />;
}

AssigneeTypeSelector.propTypes = {
  labels: PropTypes.shape({
    assignTo: PropTypes.shape({
      class: PropTypes.string,
      customGroups: PropTypes.string,
      session: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.func,
};

function SelectCustomGroup({ labels, profiles, onChange, value }) {
  return (
    <>
      TODO: Mostrar solo los que están matriculados en las asignaturas
      <SelectUserAgent
        maxSelectedValues={0}
        onChange={onChange}
        value={value}
        profiles={profiles}
      />
    </>
  );
}

SelectCustomGroup.propTypes = {
  labels: PropTypes.shape({}).isRequired,
  profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
};

// EN: Gets the user agents of the current user
// ES: Obtiene los user agents del usuario actual
function useUserAgents() {
  const [centers] = useApi(getCentersWithToken);

  return useMemo(() => {
    if (!centers?.length) {
      return [];
    }
    return centers.map((agent) => agent.userAgentId);
  }, [centers]);
}

// EN: Gets all the classes of the teacher
// ES: Obtiene todas las clases del profesor
function useTeacherClasses() {
  const [data, setData] = useState([]);
  const userAgents = useUserAgents();

  const getClasses = async () => {
    if (!userAgents?.length) {
      setData([]);
      return;
    }
    // EN: Get the classes the teacher has
    // ES: Obtener las clases que tiene el profesor
    const classes = _.flatten(
      await Promise.all(
        userAgents.map(
          async (agent) =>
            (
              await listTeacherClassesRequest({
                page: 0,
                size: 100,
                teacher: agent,
              })
            ).data.items
        )
      )
    ).map((_class) => ({
      value: _class.id,
      // TODO: Update to standard class name
      label: `${_class.courses.name || _class.courses.index} - ${_class.subject.name} (${
        _class.groups?.abbreviation
      })`,
      subject: _class.subject.id,
      c: _class,
    }));

    setData(classes);
  };

  useEffect(getClasses, [userAgents]);

  return data;
}

// EN: Get all the classes of a given subject of the teacher
// ES: Obtiene todas las clases de una asignatura del profesor
function useTeacherClassesOfSubject(subjects) {
  const classes = useTeacherClasses();

  return useMemo(() => {
    if (!subjects?.length) {
      return [];
    }
    return classes.filter((c) => subjects?.includes(c.subject));
  }, [subjects, classes]);
}

// EN: Get all the classes of a given subject of the teacher grouped by group if enough students are shared
// ES: Obtiene todas las clases de una asignatura del profesor agrupadas por grupo si hay suficientes alumnos compartidos
function useGroupedClasses(subjects) {
  const classes = useTeacherClassesOfSubject(subjects);

  return useMemo(() => {
    if (!classes?.length) {
      return [];
    }
    let groups = _.groupBy(
      classes.map((c) => ({ students: c.c.students, group: c.c.groups.id, class: c })).flat(),
      (c) => c.group
    );

    groups = Object.entries(groups).reduce((acc, [id, group]) => {
      const allStudents = group.map((c) => c.students);
      const groupStudents = [...new Set(allStudents.flat())];

      const shouldDisplayOnlyGroup = group.every(({ students }) => {
        const common = _.intersection(students, groupStudents);
        return common.length >= groupStudents.length * 0.8;
      });

      if (shouldDisplayOnlyGroup) {
        acc.push({
          label: group[0].class.c.groups.abbreviation,
          type: 'group',
          id,
          students: _.intersection(...allStudents),
          nonAssignableStudents: allStudents?.length > 1 ? _.difference(...allStudents) : [],
          allStudents,
          totalStudents: groupStudents.length,
          classes: group,
        });
      } else {
        const nonAssignableStudents = _.difference(...allStudents);
        acc.push(
          ...group.map((g) => ({
            label: g.class.label,
            type: 'class',
            id: g.value,
            students: _.intersection(...allStudents),
            nonAssignableStudents: _.intersection(g.students, nonAssignableStudents),
            totalStudents: g.students.length,
            group: g,
          }))
        );
      }

      return acc;
    }, []);

    return groups;
  }, [classes]);
}

function SelectClass({ labels, profiles, onChange, value }) {
  const { control } = useFormContext();

  const subjects = useWatch({ name: 'subjects', control });
  const classes = useGroupedClasses(subjects);
  const classesWithStudents = classes?.filter((c) => c.students.length);
  const nonAssignableStudents = classesWithStudents?.map((c) => c.nonAssignableStudents)?.flat();

  return (
    <>
      {classesWithStudents?.map((c) => (
        <p key={c.id}>
          {c.label} ({c.students.length}/{c.totalStudents} matching students)
        </p>
      ))}
      {!!nonAssignableStudents?.length && (
        <p>The following students can't be assigned: {nonAssignableStudents.join(', ')}</p>
      )}
      <ConditionalInput
        label={labels?.excludeStudents}
        render={() => (
          <SelectUserAgent
            label={labels?.excludeStudents}
            maxSelectedValues={0}
            onChange={onChange}
            value={value}
            profiles={profiles}
          />
        )}
      />
    </>
  );
}

SelectClass.propTypes = {
  labels: PropTypes.shape({
    excludeStudents: PropTypes.string,
  }).isRequired,
  profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
};

function AssigneeSelector({ labels, profile, onChange, value }) {
  const { control } = useFormContext();
  const [profiles, setProfiles] = useState(null);

  const type = useWatch({
    control,
    name: 'type',
  });

  useEffect(async () => {
    const p = await getProfiles(profile);
    setProfiles([p[0].profile]);
  }, []);

  if (!profiles) {
    return null;
  }

  switch (type) {
    case 'class':
      return <SelectClass labels={labels} profiles={profiles} value={value} onChange={onChange} />;
    case 'customGroups':
      return (
        <SelectCustomGroup labels={labels} profiles={profiles} value={value} onChange={onChange} />
      );
    case 'session':
      return <p>Session</p>;
    default:
      return null;
  }
}

AssigneeSelector.propTypes = {
  labels: PropTypes.shape({}).isRequired,
  profile: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
};

function SubjectSelector({ labels, onChange, value, task }) {
  if (task.subjects.length <= 1) {
    const subject = task.subjects[0];
    if (subject && !(value?.length === 1 && value[0] === subject.subject)) {
      onChange([subject.subject]);
    }
    return null;
  }

  const subjects = useMemo(
    () => task.subjects.map((s) => ({ label: s.subject, value: s.subject })),
    [task?.subjects]
  );

  return (
    <ContextContainer title={labels.subjects.title} subtitle={labels.subjects.subtitle}>
      <CheckBoxGroup variant="boxed" data={subjects} value={value} onChange={onChange} />
    </ContextContainer>
  );
}

SubjectSelector.propTypes = {
  labels: PropTypes.shape({
    subjects: PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
  task: PropTypes.shape({
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        subject: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default function AssignStudents({ labels, profile, onChange, task }) {
  const form = useForm({
    subjects: [],
    type: null,
    assignee: [],
  });
  const { control } = form;

  return (
    <FormProvider {...form}>
      <Controller
        control={control}
        name="subjects"
        render={({ field }) => <SubjectSelector {...field} labels={labels} task={task} />}
      />
      <Controller
        control={control}
        name="type"
        render={({ field }) => <AssigneeTypeSelector {...field} labels={labels} />}
      />
      <Controller
        control={control}
        name="assignee"
        render={({ field }) => <AssigneeSelector {...field} labels={labels} profile={profile} />}
      />
    </FormProvider>
  );
}

AssignStudents.defaultProps = {
  labels: {
    assignTo: {
      class: 'Class',
      customGroups: 'Custom Groups',
      session: 'Session',
    },
    excludeStudents: 'Exclude students',
    subjects: {
      title: 'Subjects to be evaluated in this task',
      subtitle: 'NOTE: At least one of them',
    },
  },
};
AssignStudents.propTypes = {
  labels: PropTypes.object,
  profile: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  task: PropTypes.shape({}),
};
