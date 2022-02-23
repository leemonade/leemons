import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ScheduleInput } from '@timetable/components';
import {
  Box,
  ColorInput,
  ContextContainer,
  MultiSelect,
  NumberInput,
  Select,
  TableInput,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { find, forEach, isArray, isObject, isObjectLike, map, set } from 'lodash';
import { useStore } from '@common';
import { useForm } from 'react-hook-form';

function EnableIfFormPropHasValue({
  property,
  formValues,
  children,
  onCreate = () => {},
  ...props
}) {
  let value = null;
  if (isArray(props.value)) {
    value = map(props.value, (val) => {
      if (isObject(val)) return val.id;
      return val;
    });
  } else if (isObjectLike(props.value)) {
    value = props.value.id;
  } else {
    value = props.value;
  }

  // eslint-disable-next-line no-nested-ternary
  const properties = property ? (isArray(property) ? property : [property]) : [];
  let disabled = false;
  forEach(properties, (p) => {
    if (formValues && !formValues[p]) {
      disabled = true;
    }
  });

  function _onCreate(value) {
    const toSend = { ...formValues };
    set(toSend, props.name, value);
    onCreate({ formValues, onCreateFieldName: props.name, value });
  }

  return React.cloneElement(children, {
    ...props,
    disabled,
    onCreate: _onCreate,
    value,
  });
}

function SubjectsTable({
  messages,
  program,
  tableLabels,
  teacherSelect,
  onAdd = () => {},
  onUpdate = () => {},
  onlyNewSubject = false,
}) {
  const [store, render] = useStore({
    tempSubjects: [],
    tempGroups: [],
  });

  const form = useForm();

  function onChangeRow(v, { name }, evForm) {
    let prefix = '';
    const n = name.split('.');
    let value = v;
    if (n.length > 1) {
      prefix = `${n[0]}.`;
      value = v[n[0]];
    }
    if (n[n.length - 1] === 'subject') {
      const tempSubjectsValues = map(store.tempSubjects, 'value');
      if (tempSubjectsValues.indexOf(value.subject) < 0) {
        const subjectCredit = find(program.subjectCredits, {
          subject: value.subject,
        });
        const classe = find(program.classes, (cl) => cl.subject.id === value.subject);

        evForm.setValue(`${prefix}internalId`, subjectCredit?.internalId || null);
        evForm.setValue(`${prefix}credits`, subjectCredit?.credits || null);
        evForm.setValue(`${prefix}subjectType`, classe?.subjectType?.id || null);
        evForm.setValue(`${prefix}knowledges`, classe?.knowledges?.id || null);
      }
    }
  }

  useEffect(() => {
    const subscription = form.watch((value, ev) => {
      onChangeRow(value, ev, form);
    });
    return () => subscription.unsubscribe();
  });

  const selects = useMemo(
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
      })).concat(store.tempGroups),
      subjectTypes: map(program.subjectTypes, ({ name, id }) => ({
        label: name,
        value: id,
      })),
      substages: map(program.substages, ({ name, abbreviation, id }) => ({
        label: `${name}${abbreviation ? ` [${abbreviation}]` : ''}`,
        value: id,
      })),
      subjects: map(program.subjects, ({ name, id }) => ({
        label: name,
        value: id,
      })).concat(store.tempSubjects),
      internalIds: map(program.subjects, ({ internalId }) => ({
        label: internalId,
        value: internalId,
      })),
    }),
    [program, store.tempSubjects, store.tempGroups]
  );

  function onCreateSubject(event) {
    store.tempSubjects = [
      ...store.tempSubjects,
      {
        label: event.value,
        value: event.value,
      },
    ];
    render();
  }

  function onCreateGroup(event) {
    store.tempGroups = [
      ...store.tempGroups,
      {
        label: event.value,
        value: event.value,
      },
    ];
    render();
  }

  const columns = [];

  if (program.maxNumberOfCourses > 0) {
    columns.push({
      Header: messages.course,
      accessor: 'courses',
      input: {
        node: (
          <EnableIfFormPropHasValue>
            {program.moreThanOneAcademicYear ? (
              <MultiSelect data={selects.courses} required />
            ) : (
              <Select data={selects.courses} required />
            )}
          </EnableIfFormPropHasValue>
        ),
        rules: { required: messages.courseRequired },
      },
      valueRender: (v) => {
        // eslint-disable-next-line no-nested-ternary
        const values = v ? (isArray(v) ? v : [v]) : [];
        return map(
          values,
          (value, index) =>
            `${index ? ', ' : ''}${
              value.name ? `${value.name} (${value.index}º)` : `${value.index}º`
            }`
        );
      },
    });
  }
  columns.push({
    Header: messages.subject,
    accessor: 'subject',
    input: {
      node: (
        <EnableIfFormPropHasValue onCreate={onCreateSubject}>
          <Select
            data={onlyNewSubject ? store.tempSubjects : selects.subjects}
            required
            searchable
            creatable
            getCreateLabel={(value) => `+ ${value}`}
            nothingFound={messages.noSubjectsFound}
          />
        </EnableIfFormPropHasValue>
      ),
      rules: { required: messages.subjectRequired },
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  columns.push({
    Header: messages.id,
    accessor: 'internalId',
    input: {
      node: (
        <EnableIfFormPropHasValue property="subject">
          <TextInput required />
        </EnableIfFormPropHasValue>
      ),
      rules: {
        required: messages.idRequired,
        pattern: {
          message: messages.maxInternalIdLength.replace('{max}', program.subjectsDigits),
          value: new RegExp(`^[0-9]{${program.subjectsDigits}}$`, 'g'),
        },
      },
    },
  });

  if (program.haveKnowledge) {
    columns.push({
      Header: messages.knowledge,
      accessor: 'knowledges',
      input: {
        node: (
          <EnableIfFormPropHasValue>
            <Select data={selects.knowledges} required />
          </EnableIfFormPropHasValue>
        ),
        rules: { required: messages.knowledgeRequired },
      },
      valueRender: (value) => <>{value?.name}</>,
    });
  }

  columns.push({
    Header: messages.subjectType,
    accessor: 'subjectType',
    input: {
      node: (
        <EnableIfFormPropHasValue>
          <Select data={selects.subjectTypes} required />
        </EnableIfFormPropHasValue>
      ),
      rules: { required: messages.subjectTypeRequired },
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  if (program.credits) {
    columns.push({
      Header: messages.credits,
      accessor: 'credits',
      input: {
        node: (
          <EnableIfFormPropHasValue property="subject">
            <NumberInput data={selects.subjectTypes} required />
          </EnableIfFormPropHasValue>
        ),
        rules: { required: messages.subjectTypeRequired },
      },
    });
  }

  columns.push({
    Header: messages.color,
    accessor: 'color',
    input: {
      node: <ColorInput required />,
      rules: { required: messages.colorRequired },
    },
    valueRender: (val) => (
      <>
        <Box
          sx={(theme) => ({ marginRight: theme.spacing[2] })}
          style={{ background: val, width: '18px', height: '18px', borderRadius: '50%' }}
        />
        {val}
      </>
    ),
  });

  columns.push({
    Header: messages.group,
    accessor: 'groups',
    input: {
      rules: {
        pattern: {
          message: (program.maxGroupAbbreviationIsOnlyNumbers
            ? messages.groupNumbers
            : messages.groupAny
          ).replace('{max}', program.maxGroupAbbreviation),
          value: new RegExp(
            `^(${program.maxGroupAbbreviationIsOnlyNumbers ? '[0-9]' : `\\S`}{${
              program.maxGroupAbbreviation
            }}|.{36})$`,
            'g'
          ),
        },
      },
      node: (
        <EnableIfFormPropHasValue onCreate={onCreateGroup}>
          <Select
            data={selects.groups}
            required
            searchable
            creatable={!onlyNewSubject}
            getCreateLabel={(value) => `+ ${value}`}
            nothingFound={messages.noSubjectsFound}
          />
        </EnableIfFormPropHasValue>
      ),
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  if (program.haveSubstagesPerCourse) {
    columns.push({
      Header: messages.substage,
      accessor: 'substages',
      input: {
        node: (
          <EnableIfFormPropHasValue>
            <Select data={selects.substages} />
          </EnableIfFormPropHasValue>
        ),
      },
      valueRender: (value) => <>{value?.name}</>,
    });
  }

  columns.push({
    Header: messages.seats,
    accessor: 'seats',
    input: {
      node: <NumberInput />,
    },
  });

  columns.push({
    Header: messages.teacher,
    accessor: 'teacher',
    input: {
      node: <EnableIfFormPropHasValue>{teacherSelect}</EnableIfFormPropHasValue>,
    },
    valueRender: (value) => (
      <EnableIfFormPropHasValue value={value}>
        {React.cloneElement(teacherSelect, {
          readOnly: true,
          disabled: true,
        })}
      </EnableIfFormPropHasValue>
    ),
  });

  columns.push({
    Header: messages.schedule,
    accessor: 'schedule',
    input: {
      node: <ScheduleInput label={false} />,
    },
    valueRender: (value) => <ScheduleInput label={false} value={value} readOnly={true} />,
  });

  async function _onAdd({ tableInputRowId, ...formData }) {
    const tempSubjectsValues = map(store.tempSubjects, 'value');
    const tempGroupsValues = map(store.tempGroups, 'value');
    const isNewSubject = tempSubjectsValues.indexOf(formData.subject) >= 0;
    const isNewGroup = tempGroupsValues.indexOf(formData.groups) >= 0;
    const good = await onAdd(formData, { isNewSubject, isNewGroup });
    if (good !== null) {
      store.tempSubjects = [];
      store.tempGroups = [];
      render();
    }
  }

  async function _onUpdate({ oldItem, newItem }) {
    const tempSubjectsValues = map(store.tempSubjects, 'value');
    const tempGroupsValues = map(store.tempGroups, 'value');
    const subject = isObject(newItem.subject) ? newItem.subject.id : newItem.subject;
    const groups = isObject(newItem.groups) ? newItem.groups.id : newItem.groups;
    const isNewSubject = tempSubjectsValues.indexOf(subject) >= 0;
    const isNewGroup = tempGroupsValues.indexOf(groups) >= 0;
    await onUpdate(
      {
        id: oldItem.id,
        ...newItem,
        courses: isObject(newItem.courses) ? newItem.courses.id : newItem.courses,
        knowledges: isObject(newItem.knowledges) ? newItem.knowledges.id : newItem.knowledges,
        subject,
        subjectType: isObject(newItem.subjectType) ? newItem.subjectType.id : newItem.subjectType,
        groups,
        substages: isObject(newItem.substages) ? newItem.substages.id : newItem.substages,
      },
      { isNewSubject, isNewGroup }
    );
    store.tempSubjects = [];
    store.tempGroups = [];
    render();
  }

  return (
    <ContextContainer direction="column" fullWidth>
      <Title order={4}>{onlyNewSubject ? messages.newTitle : messages.title}</Title>
      <Box sx={(theme) => ({ paddingBottom: theme.spacing[3], width: '100%', overflow: 'auto' })}>
        <Box style={{ width: '2000px' }}>
          <TableInput
            data={program.classes}
            onAdd={_onAdd}
            onUpdate={_onUpdate}
            form={form}
            columns={columns}
            editable
            sortable={false}
            removable={false}
            labels={tableLabels}
            onChangeRow={onChangeRow}
          />
        </Box>
      </Box>
    </ContextContainer>
  );
}

SubjectsTable.propTypes = {
  messages: PropTypes.object,
  onAdd: PropTypes.func,
  onUpdate: PropTypes.func,
  teacherSelect: PropTypes.any,
  onTeacherSearch: PropTypes.func,
  onCreateSubject: PropTypes.func,
  program: PropTypes.any,
  tableLabels: PropTypes.object,
  onlyNewSubject: PropTypes.bool,
};

export { SubjectsTable };
