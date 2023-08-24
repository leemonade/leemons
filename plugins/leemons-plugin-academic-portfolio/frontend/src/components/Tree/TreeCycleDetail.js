import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, ContextContainer, Stack, TextInput, Title } from '@bubbles-ui/components';

const TreeCycleDetail = ({ item, messages, onSave, managersSelect, messagesAddUsers, saving }) => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: item.value });

  React.useEffect(() => {
    reset(item.value);
  }, [item]);

  return (
    <Box>
      <form onSubmit={handleSubmit(onSave)} autoComplete="off">
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{messages.title}</Title>
          <Box>
            <Controller
              control={control}
              name="name"
              rules={{ required: messages.nameRequired }}
              render={({ field }) => (
                <TextInput label={messages.name} error={errors.name} required {...field} />
              )}
            />
          </Box>
          {managersSelect ? (
            <Box>
              <Controller
                control={control}
                name="managers"
                render={({ field }) =>
                  React.cloneElement(managersSelect, {
                    label: messagesAddUsers.managersLabel,
                    maxSelectedValues: 999,
                    ...field,
                  })
                }
              />
            </Box>
          ) : null}

          <Stack fullWidth alignItems="end" justifyContent="end">
            <Box>
              <Button loading={saving} type="submit">
                {messages.save}
              </Button>
            </Box>
          </Stack>
        </ContextContainer>
      </form>
    </Box>
  );
};

TreeCycleDetail.propTypes = {
  messages: PropTypes.object,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  item: PropTypes.object,
  messagesAddUsers: PropTypes.any,
  managersSelect: PropTypes.any,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeCycleDetail };
