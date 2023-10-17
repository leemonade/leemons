/* eslint-disable no-param-reassign */
import {
  ActionButton,
  Box,
  Button,
  ColorInput,
  ContextContainer,
  MultiSelect,
  NumberInput,
  Select,
  TableInput,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { AddIcon, EditIcon } from '@bubbles-ui/icons/outline';
import { useLocale, useStore } from '@common';
import { ScheduleInput } from '@timetable/components';
import _, {
  cloneDeep,
  filter,
  find,
  forEach,
  get,
  isArray,
  isObject,
  isObjectLike,
  map,
  set,
} from 'lodash';
import { forEachRight } from 'lodash/collection';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { SubjectsDrawer } from './SubjectsDrawer';

function getGroups({ program, selectGroups, subject }) {
  const classes = filter(program.classes, (cl) => cl.subject.id === subject);
  const result = cloneDeep(selectGroups);
  forEach(classes, (classe) => {
    if (classe.groups) {
      forEachRight(result, (group, i) => {
        if (group.value === classe.groups.id) {
          // eslint-disable-next-line no-param-reassign
          result[i].disabled = true;
        }
      });
    }
  });
  return result;
}

// eslint-disable-next-line react/prop-types
function Group({ selectGroups, program, onCreateGroup, onlyNewSubject, messages, ...props }) {
  let subject = null;
  if (props.name === 'groups') {
    subject = props.formValues.subject;
  } else {
    const nameS = props.name.split('.');
    subject = get(props.form.getValues(), `${nameS[0]}.subject.id`);
  }
  return (
    <EnableIfFormPropHasValue {...props} property="subject" onCreate={onCreateGroup}>
      <Select
        data={getGroups({ program, selectGroups, subject })}
        required
        searchable
        creatable={!onlyNewSubject}
        getCreateLabel={(value) => `+ ${value}`}
        nothingFound={messages.noSubjectsFound}
      />
    </EnableIfFormPropHasValue>
  );
}

const EnableIfFormPropHasValue = forwardRef(
  ({ property, formValues, children, onCreate = () => {}, ...props }, ref) => {
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

    function _onCreate(val) {
      const toSend = { ...formValues };
      set(toSend, props.name, val);
      onCreate({ formValues, onCreateFieldName: props.name, value: val }, props);
    }

    return React.cloneElement(children, {
      ...props,
      ref,
      disabled,
      onCreate: _onCreate,
      value,
    });
  }
);

EnableIfFormPropHasValue.displayName = '@academic-portfolio/components/EnableIfFormPropHasValue';
EnableIfFormPropHasValue.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  property: PropTypes.any,
  formValues: PropTypes.any,
  children: PropTypes.any,
  onCreate: PropTypes.func,
};

function SubjectsTable({
  messages,
  program,
  tableLabels,
  teacherSelect,
  onAdd = () => {},
  onUpdate = () => {},
  onlyNewSubject = false,
}) {
  const locale = useLocale();
  const [store, render] = useStore({
    tempSubjects: [],
    tempGroups: [],
  });

  const groupErrorMessage = (
    program.maxGroupAbbreviationIsOnlyNumbers ? messages.groupNumbers : messages.groupAny
  ).replace('{max}', program.maxGroupAbbreviation);
  const groupRegex = new RegExp(
    `^(${program.maxGroupAbbreviationIsOnlyNumbers ? '[0-9]' : `\\S`}{${
      program.maxGroupAbbreviation
    }}|.{36})$`,
    'g'
  );

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

        if (program.maxNumberOfCourses > 0) {
          if (program.moreThanOneAcademicYear) {
            evForm.setValue(
              `${prefix}courses`,
              isArray(classe?.courses) ? map(classe?.courses, 'id') : []
            );
          } else {
            evForm.setValue(`${prefix}courses`, classe?.courses?.id || null);
          }
        }

        evForm.setValue(`${prefix}internalId`, subjectCredit?.internalId || null);
        evForm.setValue(`${prefix}credits`, subjectCredit?.credits || undefined);
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

  function onCreateSubject(event, props) {
    store.tempSubjects = [
      ...store.tempSubjects,
      {
        label: event.value,
        value: event.value,
      },
    ];
    props.form.clearErrors(props.name);
    props.form.setValue(props.name, event.value);
    render();
  }

  function onCreateGroup(event, props) {
    if (groupRegex.test(event.value)) {
      store.tempGroups = [
        ...store.tempGroups,
        {
          label: event.value,
          value: event.value,
        },
      ];
      props.form.clearErrors(props.name);
      props.form.setValue(props.name, event.value);
      render();
    } else {
      props.form.setError(props.name, { message: groupErrorMessage });
    }
  }

  const columns = [];

  columns.push({
    Header: messages.subject,
    showOnTable: true,
    accessor: 'subject',
    input: {
      node: (
        <EnableIfFormPropHasValue onCreate={onCreateSubject}>
          <Select
            // data={onlyNewSubject ? store.tempSubjects : selects.subjects}
            data={selects.subjects.concat(store.tempSubjects)}
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
    cellStyle: {
      paddingLeft: 0,
    },
    valueRender: (value, formValues) => (
      <Box style={{ display: 'flex', gap: '3px' }}>
        <Box
          sx={(theme) => ({ marginRight: theme.spacing[2] })}
          style={{
            background: formValues.color,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
          }}
        />
        <Box>{value?.name}</Box>{' '}
        {formValues.courses || formValues.internalId ? (
          <>
            -{' '}
            {program.subjectsFirstDigit === 'course' &&
            formValues.courses &&
            !_.isArray(formValues.courses)
              ? formValues.courses.index
              : ''}
            {formValues.internalId ? formValues.internalId : ''}
          </>
        ) : null}
      </Box>
    ),
  });

  if (program.maxNumberOfCourses > 1) {
    columns.push({
      Header: messages.course,
      showOnTable: true,
      accessor: 'courses',
      input: {
        node: (
          <EnableIfFormPropHasValue property="subject">
            {program.moreThanOneAcademicYear ? (
              <MultiSelect data={selects.courses} required />
            ) : (
              <Select data={selects.courses} required />
            )}
          </EnableIfFormPropHasValue>
        ),
        rules: { required: messages.courseRequired },
      },
      cellStyle: {
        paddingLeft: 0,
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

  // SUBJECT ID
  columns.push({
    Header: messages.id,
    accessor: 'internalId',
    cellStyle: {
      paddingLeft: 0,
    },
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

  // KNOWLEDGE
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
      cellStyle: {
        paddingLeft: 0,
      },
      valueRender: (value) => <>{value?.name}</>,
    });
  }

  // SUBJECT TYPE
  columns.push({
    Header: messages.subjectType,
    accessor: 'subjectType',
    showOnTable: true,
    input: {
      node: (
        <EnableIfFormPropHasValue>
          <Select data={selects.subjectTypes} required />
        </EnableIfFormPropHasValue>
      ),
      rules: { required: messages.subjectTypeRequired },
    },
    cellStyle: {
      paddingLeft: 0,
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  // CREDITS
  if (program.credits) {
    columns.push({
      Header: messages.credits,
      accessor: 'credits',
      input: {
        node: (
          <EnableIfFormPropHasValue property="subject">
            <NumberInput required />
          </EnableIfFormPropHasValue>
        ),
        rules: { required: messages.subjectTypeRequired },
      },
      cellStyle: {
        paddingLeft: 0,
      },
    });
  }

  // COLORS
  columns.push({
    Header: messages.color,
    accessor: 'color',
    input: {
      node: <ColorInput required />,
      rules: { required: messages.colorRequired },
    },
    cellStyle: {
      paddingLeft: 0,
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

  if (!program.useOneStudentGroup) {
    columns.push({
      Header: messages.group,
      showOnTable: true,
      accessor: 'groups',
      input: {
        rules: {
          pattern: {
            message: groupErrorMessage,
            value: groupRegex,
          },
          required: messages.groupRequired,
        },
        onChange: (e, props) => {
          props.form.clearErrors(props.field.name);
          props.form.setValue(props.field.name, e);
        },
        node: (
          <Group
            selectGroups={selects.groups}
            program={program}
            onCreateGroup={onCreateGroup}
            onlyNewSubject={onlyNewSubject}
            messages={messages}
          />
        ),
      },
      cellStyle: {
        paddingLeft: 0,
      },
      valueRender: (value, formValues) => (
        <>
          {value?.name}
          {formValues.seats ? `(${formValues.seats} ${messages.seats})` : null}
        </>
      ),
    });
  }

  if (program.haveSubstagesPerCourse) {
    columns.push({
      Header: messages.substage,
      showOnTable: true,
      accessor: 'substages',
      input: {
        node: (
          <EnableIfFormPropHasValue>
            <MultiSelect data={selects.substages} />
          </EnableIfFormPropHasValue>
        ),
      },
      cellStyle: {
        paddingLeft: 0,
      },
      valueRender: (value) => (
        <>
          {_.isArray(value)
            ? _.map(value, ({ name }) => (
                <>
                  {name}
                  <br />
                </>
              ))
            : value?.name}
        </>
      ),
    });
  }

  columns.push({
    Header: messages.seats,
    accessor: 'seats',
    input: {
      node: <NumberInput />,
    },
    cellStyle: {
      paddingLeft: 0,
    },
  });

  columns.push({
    Header: messages.teacher,
    accessor: 'teacher',
    showOnTable: true,
    input: {
      node: <EnableIfFormPropHasValue>{teacherSelect}</EnableIfFormPropHasValue>,
    },
    cellStyle: {
      paddingLeft: 0,
    },
    valueRender: (value) => (
      <EnableIfFormPropHasValue value={value}>
        {React.cloneElement(teacherSelect, {
          readOnly: true,
          disabled: false,
        })}
      </EnableIfFormPropHasValue>
    ),
  });

  columns.push({
    Header: messages.schedule,
    accessor: 'schedule',
    input: {
      node: <ScheduleInput locale={locale} label={false} />,
    },
    cellStyle: {
      paddingLeft: 0,
    },
    valueRender: (value) => (
      <ScheduleInput locale={locale} label={false} value={value} readOnly={true} />
    ),
  });

  async function _onAdd({ tableInputRowId, ...formData }) {
    store.subjectSaving = true;
    render();
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
    store.selectedSubject = null;
    store.subjectSaving = false;
    render();
  }

  async function _onUpdate({ oldItem, newItem }) {
    store.subjectSaving = true;
    render();
    const tempSubjectsValues = map(store.tempSubjects, 'value');
    const tempGroupsValues = map(store.tempGroups, 'value');
    const subject = isObject(newItem.subject) ? newItem.subject.id : newItem.subject;
    const groups = isObject(newItem.groups) ? newItem.groups.id : newItem.groups;
    const isNewSubject = tempSubjectsValues.indexOf(subject) >= 0;
    const isNewGroup = tempGroupsValues.indexOf(groups) >= 0;
    if (newItem.substages) {
      const substages = _.isArray(newItem.substages) ? newItem.substages : [newItem.substages];
      newItem.substages = [];
      _.forEach(substages, (substage) => {
        if (isObject(substage)) {
          newItem.substages.push(substage.id);
        } else {
          newItem.substages.push(substage);
        }
      });
    }
    await onUpdate(
      {
        id: oldItem.id,
        ...newItem,
        courses: isObject(newItem.courses) ? newItem.courses.id : newItem.courses,
        knowledges: isObject(newItem.knowledges) ? newItem.knowledges.id : newItem.knowledges,
        subject,
        subjectType: isObject(newItem.subjectType) ? newItem.subjectType.id : newItem.subjectType,
        groups,
      },
      { isNewSubject, isNewGroup }
    );
    store.tempSubjects = [];
    store.tempGroups = [];
    store.selectedSubject = null;
    store.subjectSaving = false;
    render();
  }

  function newSubject() {
    store.selectedSubject = {};
    render();
  }

  function edit(data) {
    store.selectedSubject = data;
    render();
  }

  return (
    <ContextContainer direction="column" fullWidth>
      <Title order={4}>{onlyNewSubject ? messages.newTitle : messages.title}</Title>
      <Box sx={(theme) => ({ paddingBottom: theme.spacing[3], width: '100%', overflow: 'auto' })}>
        <Box sx={(theme) => ({ paddingBottom: theme.spacing[3] })}>
          <Button onClick={newSubject} variant="link" leftIcon={<AddIcon />}>
            {messages.addSubject}
          </Button>
        </Box>
        <Box>
          <TableInput
            data={program.classes}
            onAdd={_onAdd}
            onUpdate={_onUpdate}
            form={form}
            columns={[
              ..._.filter(columns, { showOnTable: true }),
              {
                Header: '',
                accessor: 'actions',
                valueRender: (value, formValues) => (
                  <Box>
                    <ActionButton onClick={() => edit(formValues)} icon={<EditIcon />} />
                  </Box>
                ),
              },
            ]}
            showHeaders={true}
            disabled={true}
            editable
            sortable={false}
            removable={false}
            labels={tableLabels}
            onChangeRow={onChangeRow}
          />
        </Box>
      </Box>
      <SubjectsDrawer
        opened={!!store.selectedSubject}
        value={store.selectedSubject}
        onSave={(data) => {
          if (store.selectedSubject.id) {
            _onUpdate({ oldItem: store.selectedSubject, newItem: data });
          } else {
            _onAdd(data);
          }
        }}
        saving={store.subjectSaving}
        columns={columns}
        onClose={() => {
          store.selectedSubject = null;
          render();
        }}
      />
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
