import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  Select,
  Stack,
  TabPanel,
  Tabs,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import { useStore } from '@common';
import { forEach, isString, map } from 'lodash';
import { TreeClassroomDetail } from './TreeClassroomDetail';

const TreeClassDetail = ({
  messagesAddUsers,
  classe,
  classes,
  program,
  messages,
  onSaveSubject,
  onSaveClass,
  addClassUsers,
  selectClass,
  saving,
  removeUserFromClass,
  center,
  item: treeItem,
  teacherSelect,
  createMode = false,
}) => {
  const [store, render] = useStore({
    createMode,
  });
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: classe.subject });

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
      ...classe.subject,
      subjectType,
      knowledge,
    });
  }, [classe.subject, classes]);

  const tabs = [];

  if (store.createMode) {
    tabs.push(
      <TabPanel key="newItem" label={messages.newClass}>
        <TreeClassroomDetail
          program={program}
          messages={messages}
          saving={saving}
          onSave={onSaveClass}
          teacherSelect={teacherSelect}
        />
      </TabPanel>
    );
  }

  const selects = React.useMemo(
    () => ({
      knowledges: map(program.knowledges, ({ name, id }) => ({
        label: name,
        value: id,
      })),
      subjectTypes: map(program.subjectTypes, ({ name, id }) => ({
        label: name,
        value: id,
      })),
    }),
    [program]
  );

  return (
    <Box>
      <ContextContainer direction="column" fullWidth divided>
        <form onSubmit={handleSubmit(onSaveSubject)} autoComplete="off">
          <ContextContainer direction="column" fullWidth>
            <Title order={4}>{messages.title}</Title>
            <Box>
              <Controller
                control={control}
                name="name"
                rules={{ required: messages.subjectNameRequired }}
                render={({ field }) => (
                  <TextInput error={errors.name} label={messages.subjectNameLabel} {...field} />
                )}
              />
            </Box>
            <Box>
              <Controller
                control={control}
                name="subjectType"
                rules={{ required: messages.subjectTypeRequired }}
                render={({ field }) => (
                  <Select
                    data={selects.subjectTypes}
                    error={errors.subjectType}
                    label={messages.subjectType}
                    {...field}
                  />
                )}
              />
            </Box>
            {program.haveKnowledge ? (
              <Box>
                <Controller
                  control={control}
                  name="knowledge"
                  rules={{ required: messages.knowledgeRequired }}
                  render={({ field }) => (
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
                render={({ field }) => (
                  <InputWrapper label={messages.imageLabel}>
                    <ImagePicker {...field} />
                  </InputWrapper>
                )}
              />
            </Box>

            <Box>
              <Controller
                control={control}
                name="icon"
                render={({ field }) => (
                  <InputWrapper label={messages.iconLabel}>
                    <ImagePicker {...field} />
                  </InputWrapper>
                )}
              />
            </Box>

            <Stack fullWidth justifyContent="end">
              <Button loading={saving} type="submit">
                {messages.save}
              </Button>
            </Stack>
          </ContextContainer>
        </form>
        <Box>
          <ContextContainer direction="column" fullWidth>
            <Title order={4}>{messages.classrooms}</Title>
            <Box>
              <Tabs activeKey={store.createMode ? 'newItem' : classe.id} onTabClick={selectClass}>
                {tabs}
                {classes.map((item) => (
                  <TabPanel disabled={store.createMode} key={item.id} label={item.treeName}>
                    <TreeClassroomDetail
                      messagesAddUsers={messagesAddUsers}
                      removeUserFromClass={removeUserFromClass}
                      program={program}
                      classe={item}
                      messages={messages}
                      saving={saving}
                      onSave={onSaveClass}
                      center={center}
                      item={treeItem}
                      addClassUsers={addClassUsers}
                      teacherSelect={teacherSelect}
                    />
                  </TabPanel>
                ))}
              </Tabs>
            </Box>
          </ContextContainer>
        </Box>
      </ContextContainer>
    </Box>
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
};

// eslint-disable-next-line import/prefer-default-export
export { TreeClassDetail };
