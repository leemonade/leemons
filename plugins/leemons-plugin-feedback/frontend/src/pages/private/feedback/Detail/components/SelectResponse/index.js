import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import {
  Box,
  Button,
  ContextContainer,
  Switch,
  ListInput,
  ListItem,
  NumberInput,
  Stack,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { Controller } from 'react-hook-form';
import { ListInputRender } from './components/ListInputRender';
import { ListItemValueRender } from './components/ListItemValueRender';

// eslint-disable-next-line import/prefer-default-export
export function SelectResponse({ form, t, multi }) {
  const responses = form.watch('properties.responses') || [];
  const withImages = form.watch('properties.withImages');
  const maxResponses = form.watch('properties.maxResponses');
  const minResponses = form.watch('properties.minResponses');
  const [showInput, setShowInput] = React.useState(false);

  return (
    <ContextContainer title={`${t('responsesLabel')} *`}>
      <Box>
        <Controller
          control={form.control}
          shouldUnregister
          name="properties.withImages"
          render={({ field }) => (
            <Switch
              {...field}
              checked={field.value}
              disabled={responses?.length}
              error={form.formState.errors.properties?.withImages}
              label={t('withImagesLabel')}
            />
          )}
        />
      </Box>

      <Box>
        <Controller
          control={form.control}
          name="properties.responses"
          shouldUnregister
          rules={{
            required: t('responsesRequired'),
            validate: (a) => {
              if (withImages) {
                let needImages = false;
                forEach(a, ({ value: { image } }) => {
                  if (!image) {
                    needImages = true;
                  }
                });
                if (needImages) return t('needImages');
              } else {
                let error = false;
                forEach(a, ({ value: { response } }) => {
                  if (!response) {
                    error = true;
                  }
                });
                if (error) return t('needResponse');
              }
              return true;
            },
          }}
          render={({ field }) => (
            <>
              <ListInput
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setShowInput(false);
                }}
                error={form.formState.errors.properties?.responses}
                inputRender={
                  <ListInputRender
                    t={t}
                    withImages={withImages}
                    onCancel={() => setShowInput(false)}
                    responsesSaved={field.value}
                  />
                }
                hideInput={!showInput}
                withInputBorder
                withItemBorder
                listRender={
                  <ListItem
                    labels={{ cancel: t('cancel'), saveChanges: t('saveChanges') }}
                    itemContainerRender={({ children }) => (
                      <Stack alignItems="center" fullWidth>
                        {children}
                      </Stack>
                    )}
                    itemValueRender={<ListItemValueRender t={t} withImages={withImages} />}
                  />
                }
                hideAddButton
                canAdd
              />
              {!showInput ? (
                <Button
                  variant="link"
                  onClick={() => setShowInput(true)}
                  leftIcon={<AddCircleIcon />}
                >
                  {t('addResponse')}
                </Button>
              ) : null}
            </>
          )}
        />
      </Box>
      {multi ? (
        <Box>
          <Stack spacing={4} style={{ width: 450 }}>
            <Controller
              control={form.control}
              shouldUnregister
              name="properties.minResponses"
              rules={{ required: t('minResponsesRequired') }}
              render={({ field }) => (
                <Box style={{ width: '100%' }}>
                  <NumberInput
                    required
                    disabled={!responses.length}
                    min={1}
                    max={maxResponses || responses.length}
                    label={t('minResponses')}
                    error={form.formState.errors.properties?.minResponses}
                    {...field}
                  />
                </Box>
              )}
            />

            <Controller
              control={form.control}
              name="properties.maxResponses"
              shouldUnregister
              rules={{ required: t('maxResponsesRequired') }}
              render={({ field }) => (
                <Box style={{ width: '100%' }}>
                  <NumberInput
                    required
                    disabled={!responses.length}
                    min={minResponses || 1}
                    max={responses.length}
                    label={t('maxResponses')}
                    error={form.formState.errors.properties?.maxResponses}
                    {...field}
                  />
                </Box>
              )}
            />
          </Stack>
        </Box>
      ) : null}
    </ContextContainer>
  );
}

SelectResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  multi: PropTypes.bool,
};
