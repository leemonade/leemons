import React from 'react';
import PropTypes from 'prop-types';
import { find, findIndex, forEach } from 'lodash';
import {
  Box,
  Checkbox,
  ContextContainer,
  InputWrapper,
  ListInput,
  ListItem,
  Paper,
  Stack,
} from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ViewOffIcon } from '@bubbles-ui/icons/outline';
import { ListInputRender } from './components/ListInputRender';
import { ListItemValueRender } from './components/ListItemValueRender';

// eslint-disable-next-line import/prefer-default-export
export function MonoResponse({ form, t }) {
  const explanationInResponses = form.watch('properties.explanationInResponses');
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
      <InputWrapper label={t('explanationLabel')}>
        <Controller
          control={form.control}
          name="properties.explanationInResponses"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              label={t('includeExplanationToEveryAnswerLabel')}
              {...field}
            />
          )}
        />
        {!explanationInResponses ? (
          <Controller
            control={form.control}
            name="properties.explanation"
            render={({ field }) => <TextEditorInput {...field} />}
          />
        ) : null}
      </InputWrapper>
      <InputWrapper required label={t('responsesLabel')} description={responsesDescription}>
        <Controller
          control={form.control}
          name="properties.responses"
          rules={{
            required: t('typeRequired'),
            validate: (a) => {
              const item = find(a, { value: { isCorrectResponse: true } });
              return item ? true : t('errorMarkGoodResponse');
            },
          }}
          render={({ field }) => (
            <ListInput
              {...field}
              error={form.formState.errors.properties?.responses}
              inputRender={<ListInputRender t={t} useExplanation={explanationInResponses} />}
              listRender={
                <ListItem
                  itemContainerRender={({ children }) => (
                    <Paper
                      fullWidth
                      sx={(theme) => ({
                        marginTop: theme.spacing[2],
                        marginBottom: theme.spacing[2],
                        width: '100%',
                      })}
                    >
                      <Stack alignItems={explanationInResponses ? 'top' : 'center'} fullWidth>
                        {children}
                      </Stack>
                    </Paper>
                  )}
                  itemValueRender={
                    <ListItemValueRender
                      t={t}
                      useExplanation={explanationInResponses}
                      toggleHideOnHelp={toggleHideOnHelp}
                      changeCorrectResponse={changeCorrectResponse}
                    />
                  }
                />
              }
              hideAddButton
              canAdd
            />
          )}
        />
      </InputWrapper>
    </ContextContainer>
  );
}

MonoResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
