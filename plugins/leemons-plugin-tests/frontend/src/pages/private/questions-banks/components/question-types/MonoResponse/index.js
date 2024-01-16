import React from 'react';
import PropTypes from 'prop-types';
import { find, findIndex, forEach, capitalize } from 'lodash';
import {
  Box,
  Switch,
  ContextContainer,
  ListInput,
  ListItem,
  Button,
  Stack,
  Text,
} from '@bubbles-ui/components';
import { Controller, useFormContext } from 'react-hook-form';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ViewOffIcon } from '@bubbles-ui/icons/outline';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { ListInputRender } from './components/ListInputRender';
import { ListItemRender } from './components/ListItemRender';

// eslint-disable-next-line import/prefer-default-export
export function MonoResponse({ form: _form, t }) {
  const form = useFormContext() ?? _form;
  const withImages = form.watch('withImages');
  const properties = form.watch('properties');
  const [showInput, setShowInput] = React.useState(false);

  const splits = t('responsesDescription').split('{{icon}}');
  const responsesDescription = [
    splits[0],
    <Box
      key={2}
      sx={(theme) => ({
        display: 'inline',
        fontSize: theme.fontSizes[3],
        verticalAlign: 'middle',
      })}
    >
      <ViewOffIcon />
    </Box>,
    splits[1],
  ];

  function toggleHideOnHelp(item) {
    const data = form.getValues('properties.responses');
    const index = findIndex(data, { value: item });
    if (index >= 0) {
      data[index].value.hideOnHelp = !data[index].value.hideOnHelp;
      form.setValue('properties.responses', data);
    }
  }

  function changeCorrectResponse(item) {
    const data = form.getValues('properties.responses');
    const index = findIndex(data, { value: item });
    if (index >= 0) {
      forEach(data, ({ value }) => {
        // eslint-disable-next-line no-param-reassign
        value.isCorrectResponse = false;
      });
      data[index].value.isCorrectResponse = true;
      form.setValue('properties.responses', data);
    }
  }

  return (
    <ContextContainer>
      <ContextContainer title={capitalize(t('explanationLabel'))}>
        <Controller
          control={form.control}
          name="properties.explanationInResponses"
          render={({ field }) => (
            <Switch
              {...field}
              checked={field.value}
              label={t('includeExplanationToEveryAnswerLabel')}
            />
          )}
        />
      </ContextContainer>
      {!properties?.explanationInResponses ? (
        <Controller
          control={form.control}
          name="properties.explanation"
          render={({ field }) => <TextEditorInput {...field} />}
        />
      ) : null}
      <ContextContainer title={t('responsesLabel')}>
        <Controller
          control={form.control}
          name="withImages"
          render={({ field }) => (
            <Switch {...field} checked={field.value} label={t('withImagesLabel')} />
          )}
        />
      </ContextContainer>
      <Text color="primary" strong>
        Primero añade las respuestas y después selecciona la respuesta correcta pulsando el circulo.
      </Text>
      <Controller
        control={form.control}
        name="properties.responses"
        rules={{
          required: t('typeRequired'),
          validate: (a) => {
            if (withImages) {
              let needImages = false;
              forEach(a, ({ value: { image } }) => {
                if (!image) {
                  needImages = true;
                }
              });
              if (needImages) return t('needImages');
            } else if (properties?.explanationInResponses) {
              let error = false;
              forEach(a, ({ value: { response, explanation } }) => {
                if (!response || !explanation) {
                  error = true;
                }
              });
              if (error) return t('needExplanationAndResponse');
            } else {
              let error = false;
              forEach(a, ({ value: { response } }) => {
                if (!response) {
                  error = true;
                }
              });
              if (error) return t('needResponse');
            }
            const item = find(a, { value: { isCorrectResponse: true } });
            return item ? true : t('errorMarkGoodResponse');
          },
        }}
        render={({ field }) => {
          let canSetHelp = true;
          forEach(field.value, ({ value: { hideOnHelp } }) => {
            if (hideOnHelp) canSetHelp = false;
          });
          return (
            <Box>
              <ListInput
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setShowInput(false);
                }}
                hideInput={!showInput}
                withItemBorder
                withInputBorder
                error={form.formState.errors.properties?.responses}
                inputRender={
                  <ListInputRender
                    t={t}
                    useExplanation={properties?.explanationInResponses}
                    withImages={withImages}
                    onCancel={() => setShowInput(false)}
                  />
                }
                listRender={
                  <ListItem
                    itemContainerRender={({ children }) => (
                      <Stack alignItems="center" fullWidth>
                        {children}
                      </Stack>
                    )}
                    itemValueRender={
                      <ListItemRender
                        t={t}
                        canSetHelp={canSetHelp}
                        useExplanation={properties?.explanationInResponses}
                        withImages={withImages}
                        toggleHideOnHelp={toggleHideOnHelp}
                        changeCorrectResponse={changeCorrectResponse}
                        showEye={field?.value?.length > 2}
                      />
                    }
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
            </Box>
          );
        }}
      />

      {/*
      <InputWrapper
        required
        label={t('responsesLabel')}
        description={
          <Box>
            <Box style={{ alignSelf: 'flex-end' }}>
              <Controller
                control={form.control}
                name="withImages"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    error={form.formState.errors.withImages}
                    label={t('withImagesLabel')}
                    {...field}
                  />
                )}
              />
            </Box>
            {responsesDescription}
          </Box>
        }
      >
      */}
    </ContextContainer>
  );
}

MonoResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
