import React from 'react';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {
  Box,
  Button,
  ColorInput,
  ContextContainer,
  InputWrapper,
  MultiSelect,
  RadioGroup,
  Select,
  Stack,
  TabPanel,
  Tabs,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import {AddCircleIcon, DeleteBinIcon} from '@bubbles-ui/icons/outline';
import ImagePicker from '@leebrary/components/ImagePicker';
import {useStore} from '@common';
import {forEach, isArray, isString, map} from 'lodash';
import {useLayout} from '@layout/context';
import {
  TreeClassroomUsersDetail
} from '@academic-portfolio/components/Tree/TreeClassroomUsersDetail';
import {TreeClassroomDetail} from './TreeClassroomDetail';

const TreeClassDetail = ({
                           messagesAddUsers,
                           classe,
                           classes,
                           program,
                           messages,
                           onSaveSubject,
                           onSaveClass,
                           onNew,
                           addClassUsers,
                           selectClass,
                           saving,
                           removing,
                           removeSubject,
                           onRemoveClass,
                           removeUserFromClass,
                           center,
                           item: treeItem,
                           teacherSelect,
                           createMode = false,
                         }) => {
  const {openConfirmationModal} = useLayout();
  const [store, render] = useStore({
    createMode,
    page: createMode ? '2' : '1',
  });
  const {
    reset,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({defaultValues: classe.subject});

  React.useEffect(() => {
    let subjectType = null;
    let knowledge = null;
    forEach(classes, (item) => {
      if (subjectType == null && item.subjectType) {
        subjectType = item.subjectType.id;
      }
      if (knowledge == null && item.knowledges) {
        knowledge = isString(item.knowledges) ? item.knowledges : item.knowledges.id;
      }
    });

    reset({
      ...(classes?.[0].subject || {}),
      // eslint-disable-next-line no-nested-ternary
      course: classes?.[0]
        ? isArray(classes[0].courses)
          ? map(classes[0].courses, 'id')
          : classes[0].courses?.id
        : null,
      color: classes?.[0] ? classes[0].color : null,
      subjectType,
      knowledge,
    });
  }, [classe.subject, classes]);

  const tabs = [];

  if (store.createMode) {
    tabs.push(
      <TabPanel key="newItem" label={messages.newClass}>
        <TreeClassroomDetail
          onRemoveClass={() => {
            store.createMode = false;
            render();
          }}
          removing={removing}
          program={program}
          messages={messages}
          saving={saving}
          createMode={true}
          messagesAddUsers={messagesAddUsers}
          onSave={onSaveClass}
          teacherSelect={teacherSelect}
        />
      </TabPanel>
    );
  }

  const selects = React.useMemo(
    () => ({
      courses: map(program.courses, ({name, index, id}) => ({
        label: `${name ? `${name} (${index}º)` : `${index}º`}`,
        value: id,
      })),
      knowledges: map(program.knowledges, ({name, id}) => ({
        label: name,
        value: id,
      })),
      subjectTypes: map(program.subjectTypes, ({name, id}) => ({
        label: name,
        value: id,
      })),
    }),
    [program]
  );

  function onBeforeSaveSubject(data) {
    // eslint-disable-next-line no-nested-ternary
    const intialCourse = classes[0]
      ? isArray(classes[0].courses)
        ? map(classes[0].courses, 'id')
        : classes[0].courses.id
      : null;
    if (data.course !== intialCourse) {
      openConfirmationModal({
        title: messages.attention,
        description: messages.subjectChangeCourse,
        labels: {
          confirm: messages.subjectChangeCourseButton,
        },
        onConfirm: async () => {
          onSaveSubject(data);
        },
      })();
    } else {
      onSaveSubject(data);
    }
  }

  return (
    <ContextContainer>
      <Title order={3}>{classe.subject.name}</Title>
      <RadioGroup
        variant="icon"
        data={[
          {label: messages.basicInformation, value: '1'},
          {
            label: messages.groupsOfClasse,
            value: '2',
          },
          {label: messages.studentsEnrolled, value: '3'},
        ]}
        fullWidth
        onChange={(page) => {
          store.page = page;
          render();
        }}
        value={store.page}
      />
      {store.page === '1' ? (
        <form onSubmit={handleSubmit(onBeforeSaveSubject)} autoComplete="off">
          <ContextContainer direction="column" fullWidth>
            <Box>
              <Controller
                control={control}
                name="name"
                rules={{required: messages.subjectNameRequired}}
                render={({field}) => (
                  <TextInput error={errors.name} label={messages.subjectNameLabel} {...field} />
                )}
              />
            </Box>
            <Box>
              <Controller
                control={control}
                name="subjectType"
                rules={{required: messages.subjectTypeRequired}}
                render={({field}) => (
                  <Select
                    data={selects.subjectTypes}
                    error={errors.subjectType}
                    label={messages.subjectType}
                    {...field}
                  />
                )}
              />
            </Box>

            {program.maxNumberOfCourses > 1 ? (
              <Box>
                <Controller
                  control={control}
                  name="course"
                  render={({field}) => {
                    if (program.moreThanOneAcademicYear) {
                      return (
                        <MultiSelect
                          data={selects.courses}
                          label={messages.courseLabel}
                          {...field}
                        />
                      );
                    }
                    return (
                      <Select data={selects.courses} label={messages.courseLabel} {...field} />
                    );
                  }}
                />
              </Box>
            ) : null}

            {program.haveKnowledge ? (
              <Box>
                <Controller
                  control={control}
                  name="knowledge"
                  rules={{required: messages.knowledgeRequired}}
                  render={({field}) => (
                    <Select
                      data={selects.knowledges}
                      error={errors.knowledge}
                      label={messages.knowledge}
                      {...field}
                    />
                  )}
                />
              </Box>
            ) : null}

            <Box>
              <Controller
                control={control}
                name="image"
                render={({field}) => (
                  <InputWrapper label={messages.imageSubjectLabel}>
                    <ImagePicker {...field} />
                  </InputWrapper>
                )}
              />
            </Box>

            <Box>
              <Controller
                control={control}
                name="icon"
                render={({field}) => (
                  <InputWrapper label={messages.iconLabel}>
                    <ImagePicker {...field} />
                  </InputWrapper>
                )}
              />
            </Box>

            <Box>
              <Controller
                control={control}
                name="color"
                render={({field}) => <ColorInput label={messages.colorLabel} {...field} />}
              />
            </Box>

            <Stack fullWidth justifyContent="space-between">
              <Button
                leftIcon={<DeleteBinIcon/>}
                variant="outline"
                loading={removing}
                onClick={() => removeSubject(classe.subject.id)}
              >
                {messages.removeSubject}
              </Button>
              <Button loading={saving} type="submit">
                {messages.saveChanges}
              </Button>
            </Stack>
          </ContextContainer>
        </form>
      ) : null}
      {store.page === '2' ? (
        <Box>
          {!program.useOneStudentGroup && (
            <Box>
              <Button
                variant="light"
                leftIcon={<AddCircleIcon/>}
                disabled={store.createMode}
                onClick={() => {
                  onNew(treeItem);
                }}
              >
                {messages.newClassroom}
              </Button>
            </Box>
          )}
          {program.useOneStudentGroup ? (
            <TreeClassroomDetail
              messagesAddUsers={messagesAddUsers}
              removeUserFromClass={removeUserFromClass}
              program={program}
              classe={classes?.[0]}
              messages={messages}
              saving={saving}
              removing={removing}
              onSave={onSaveClass}
              center={center}
              item={treeItem}
              onRemoveClass={onRemoveClass}
              addClassUsers={addClassUsers}
              teacherSelect={teacherSelect}
            />
          ) : (
            <Tabs activeKey={store.createMode ? 'newItem' : classe.id} onTabClick={selectClass}>
              {tabs}
              {classes?.map((item) => (
                <TabPanel
                  disabled={store.createMode}
                  key={item.id}
                  label={item.groups?.abbreviation || item.groups?.name || item.treeName}
                >
                  <TreeClassroomDetail
                    messagesAddUsers={messagesAddUsers}
                    removeUserFromClass={removeUserFromClass}
                    program={program}
                    classe={item}
                    messages={messages}
                    saving={saving}
                    removing={removing}
                    onSave={onSaveClass}
                    center={center}
                    item={treeItem}
                    onRemoveClass={onRemoveClass}
                    addClassUsers={addClassUsers}
                    teacherSelect={teacherSelect}
                  />
                </TabPanel>
              ))}
            </Tabs>
          )}
        </Box>
      ) : null}

      {store.page === '3' ? (
        <Box>
          {program.useOneStudentGroup ? (
            <TreeClassroomUsersDetail
              messagesAddUsers={messagesAddUsers}
              removeUserFromClass={removeUserFromClass}
              program={program}
              classe={classes?.[0]}
              messages={messages}
              saving={saving}
              removing={removing}
              onSave={onSaveClass}
              center={center}
              item={treeItem}
              onRemoveClass={onRemoveClass}
              addClassUsers={addClassUsers}
              teacherSelect={teacherSelect}
            />
          ) : (
            <Tabs onTabClick={selectClass}>
              {classes.map((item) => (
                <TabPanel
                  disabled={store.createMode}
                  key={item.id}
                  label={item.groups?.abbreviation || item.groups?.name || item.treeName}
                >
                  <TreeClassroomUsersDetail
                    messagesAddUsers={messagesAddUsers}
                    removeUserFromClass={removeUserFromClass}
                    program={program}
                    classe={item}
                    messages={messages}
                    saving={saving}
                    removing={removing}
                    onSave={onSaveClass}
                    center={center}
                    item={treeItem}
                    onRemoveClass={onRemoveClass}
                    addClassUsers={addClassUsers}
                    teacherSelect={teacherSelect}
                  />
                </TabPanel>
              ))}
            </Tabs>
          )}
        </Box>
      ) : null}
    </ContextContainer>
  );
};

TreeClassDetail.propTypes = {
  classe: PropTypes.object,
  classes: PropTypes.array,
  program: PropTypes.object,
  messages: PropTypes.object,
  onSaveSubject: PropTypes.func,
  selectClass: PropTypes.func,
  onSaveClass: PropTypes.func,
  saving: PropTypes.bool,
  teacherSelect: PropTypes.any,
  createMode: PropTypes.bool,
  center: PropTypes.string,
  item: PropTypes.object,
  addClassUsers: PropTypes.func,
  messagesAddUsers: PropTypes.object,
  removeUserFromClass: PropTypes.func,
  removing: PropTypes.bool,
  onRemoveClass: PropTypes.func,
  removeSubject: PropTypes.func,
  onNew: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export {TreeClassDetail};
