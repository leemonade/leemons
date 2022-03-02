import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  TabPanel,
  Tabs,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import { TreeClassroomDetail } from './TreeClassroomDetail';

const TreeClassDetail = ({
  classe,
  classes,
  program,
  messages,
  onSaveSubject,
  onSaveClass,
  selectClass,
  saving,
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
    reset(classe.subject);
  }, [classe.subject]);

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

  return (
    <Box>
      <ContextContainer direction="column" fullWidth divided>
        <form onSubmit={handleSubmit(onSaveSubject)}>
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
              <Button loading={saving} type="submit">
                {messages.save}
              </Button>
            </Box>
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
                      program={program}
                      classe={item}
                      messages={messages}
                      saving={saving}
                      onSave={onSaveClass}
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
};

// eslint-disable-next-line import/prefer-default-export
export { TreeClassDetail };
