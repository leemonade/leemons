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

const TreeProgramDetail = ({ program, messages, onSave, onGoProgram, saving }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: program });

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
                <TextInput label={messages.nameLabel} error={errors.name} required {...field} />
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="abbreviation"
              rules={{
                required: messages.abbreviationRequired,
                maxLength: 8,
                minLength: 1,
              }}
              render={({ field }) => (
                <TextInput
                  label={messages.abbreviationLabel}
                  help={messages.abbreviationHelper}
                  error={errors.abbreviation}
                  maxLength={8}
                  required
                  {...field}
                />
              )}
            />
          </Box>
          {program.credits ? (
            <Box>
              <Controller
                name="credits"
                control={control}
                render={({ field }) => (
                  <NumberInput defaultValue={0} min={0} label={messages.creditsLabel} {...field} />
                )}
              />
            </Box>
          ) : null}
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

TreeProgramDetail.propTypes = {
  program: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  onGoProgram: PropTypes.func,
  saving: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeProgramDetail };
