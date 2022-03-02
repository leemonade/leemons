import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  NumberInput,
  Paragraph,
  TextInput,
  Title,
} from '@bubbles-ui/components';

const TreeCourseDetail = ({ course, messages, onSave, onGoProgram, saving }) => {
  const { reset, control, handleSubmit } = useForm({ defaultValues: course });

  React.useEffect(() => {
    reset(course);
  }, [course]);

  return (
    <Box>
      <form onSubmit={handleSubmit(onSave)}>
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{messages.title}</Title>
          <Box>
            <TextInput disabled label={messages.numberLabel} value={course.index} />
          </Box>
          <Box>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput label={messages.nameLabel} help={messages.nameHelper} {...field} />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <NumberInput defaultValue={0} min={0} label={messages.creditsLabel} {...field} />
              )}
            />
          </Box>
          <Box>
            <Paragraph>
              {messages.visitProgramDescription}&nbsp;
              <Button variant="link" onClick={onGoProgram}>
                {messages.visitProgramLabel}
              </Button>
            </Paragraph>
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

TreeCourseDetail.propTypes = {
  course: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  onGoProgram: PropTypes.func,
  saving: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeCourseDetail };
