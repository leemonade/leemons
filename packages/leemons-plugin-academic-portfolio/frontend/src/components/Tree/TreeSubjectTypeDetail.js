import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  NumberInput,
  Switch,
  TextInput,
  Title,
} from '@bubbles-ui/components';

const TreeSubjectTypeDetail = ({ subjectType, messages, onSave, saving }) => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: subjectType });

  React.useEffect(() => {
    reset(subjectType);
  }, [subjectType]);

  return (
    <Box>
      <form onSubmit={handleSubmit(onSave)}>
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{messages.title}</Title>
          <Box>
            <Controller
              control={control}
              name="name"
              render={({ field }) => <TextInput label={messages.nameLabel} {...field} />}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="credits_course"
              render={({ field }) => <NumberInput label={messages.crCourse} {...field} />}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="credits_program"
              render={({ field }) => <NumberInput label={messages.crProgram} {...field} />}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="groupVisibility"
              render={({ field }) => (
                <Switch {...field} label={messages.nested} checked={!!field.value} />
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
    </Box>
  );
};

TreeSubjectTypeDetail.propTypes = {
  subjectType: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  onGoProgram: PropTypes.func,
  saving: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeSubjectTypeDetail };
