import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ColorInput,
  ContextContainer,
  NumberInput,
  TextInput,
  Title,
} from '@bubbles-ui/components';

const TreeKnowledgeDetail = ({ knowledge, program, messages, onSave, saving }) => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: knowledge });

  React.useEffect(() => {
    reset(knowledge);
  }, [knowledge]);

  const abbrRules = {
    required: messages.abbreviationRequired,
    maxLength: {
      value: program.maxKnowledgeAbbreviation,
      message: messages.maxLength.replace('{max}', program.maxKnowledgeAbbreviation),
    },
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSave)}>
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{messages.title}</Title>
          <Box>
            <Controller
              control={control}
              name="name"
              rules={{ required: messages.nameRequired }}
              render={({ field }) => (
                <TextInput {...field} label={messages.nameLabel} error={errors.name} required />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="abbreviation"
              control={control}
              rules={abbrRules}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={messages.abbreviationLabel}
                  help={messages.abbreviationHelper.replace(
                    '{max}',
                    program.maxKnowledgeAbbreviation
                  )}
                  error={errors.abbreviation}
                  required
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="color"
              control={control}
              rules={{
                required: messages.colorRequired,
              }}
              render={({ field }) => (
                <ColorInput {...field} label={messages.colorLabel} error={errors.color} required />
              )}
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
            <Button loading={saving} type="submit">
              {messages.save}
            </Button>
          </Box>
        </ContextContainer>
      </form>
    </Box>
  );
};

TreeKnowledgeDetail.propTypes = {
  knowledge: PropTypes.object,
  program: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeKnowledgeDetail };
