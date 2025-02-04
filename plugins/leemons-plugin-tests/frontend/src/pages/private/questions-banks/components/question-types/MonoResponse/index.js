import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Box,
  Switch,
  ContextContainer,
  ListInput,
  ListItem,
  Button,
  Stack,
  Text,
  InputWrapper,
} from '@bubbles-ui/components';
import { TextEditorInput, TEXT_EDITOR_TEXTAREA_TOOLBARS } from '@bubbles-ui/editors';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { find, findIndex, forEach, capitalize, omit } from 'lodash';
import PropTypes from 'prop-types';

import { ListInputRender } from './components/ListInputRender';
import { ListItemRender } from './components/ListItemRender';

// eslint-disable-next-line import/prefer-default-export
export function MonoResponse({ form: _form, t, scrollRef }) {
  const form = useFormContext() || _form;

  const hasHelp = form.watch('hasHelp');
  const hasImageAnswers = form.watch('hasImageAnswers');
  const hasAnswerFeedback = form.watch('hasAnswerFeedback');
  const [showInput, setShowInput] = useState(false);

  function toggleHideOnHelp(item) {
    const data = form.getValues('choices');
    const index = findIndex(data, item);
    if (index >= 0) {
      data[index].hideOnHelp = !data[index].hideOnHelp;
      form.setValue('choices', data);
    }
  }

  function changeCorrectResponse(item) {
    const data = form.getValues('choices');
    const index = findIndex(data, item);
    if (index >= 0) {
      forEach(data, (choice) => {
        // eslint-disable-next-line no-param-reassign
        choice.isCorrect = false;
      });
      data[index].isCorrect = true;
      form.setValue('choices', data);
    }
  }

  function validateChoices(choicesValue) {
    const item = find(choicesValue, { isCorrect: true });
    if (!item) return t('errorMarkGoodResponse');

    let error = false;
    forEach(choicesValue, (choice) => {
      if (hasImageAnswers && !choice.image) {
        error = t('needImages');
        return;
      }

      if (!hasImageAnswers && !choice.text?.text) {
        error = t('needResponse');
        return;
      }

      if (hasAnswerFeedback && !choice.feedback?.text) {
        error = t('needExplanation') || 'Error';
      }
    });
    return error || true;
  }

  const removeHideOnHelp = () =>
    form.setValue(
      'choices',
      form.getValues('choices')?.map((choice) => omit(choice, 'hideOnHelp'))
    );

  // RENDER ································································································|

  return (
    <ContextContainer>
      <ContextContainer title={`${capitalize(t('explanationLabel'))}`}>
        <Controller
          control={form.control}
          name="hasAnswerFeedback"
          render={({ field }) => (
            <Switch
              {...field}
              checked={field.value}
              label={t('includeExplanationToEveryAnswerLabel')}
            />
          )}
        />
      </ContextContainer>
      {!hasAnswerFeedback ? (
        <Controller
          control={form.control}
          name="globalFeedback"
          render={({ field }) => (
            <TextEditorInput
              {...field}
              toolbars={TEXT_EDITOR_TEXTAREA_TOOLBARS}
              value={field.value?.text}
              editorStyles={{ minHeight: '96px' }}
              placeholder={t('explanationPlaceHolder')}
              onChange={(value) => {
                field.onChange({ format: 'html', text: value });
              }}
            />
          )}
        />
      ) : null}
      <ContextContainer title={`${t('responsesLabel')} *`} spacing={4}>
        <Controller
          control={form.control}
          name="hasImageAnswers"
          render={({ field }) => (
            <Switch {...field} checked={field.value} label={t('withImagesLabel')} />
          )}
        />

        <Text color="primary" strong>
          {t('responsesDescription')}
        </Text>
        <Controller
          name="choices"
          control={form.control}
          rules={{
            required: t('typeRequired'),
            validate: (choicesValue) => validateChoices(choicesValue),
          }}
          render={({ field }) => {
            let canSetHelp = true;

            const listValues = [];
            forEach(field.value, (item) => {
              if (item.hideOnHelp) canSetHelp = false;
              listValues.push({
                value: {
                  ...item,
                },
              });
            });

            return (
              <Box>
                <InputWrapper error={form.formState.errors.choices?.message || null}>
                  <ListInput
                    {...field}
                    value={listValues}
                    onChange={(e) => {
                      const cleanValues = e.map(({ value }) => value);
                      field.onChange(cleanValues);
                      setShowInput(false);
                    }}
                    hideInput={!showInput}
                    withItemBorder
                    withInputBorder
                    error={form.formState.errors.properties?.responses}
                    inputRender={
                      <ListInputRender
                        t={t}
                        useExplanation={hasAnswerFeedback}
                        withImages={hasImageAnswers}
                        onCancel={() => setShowInput(false)}
                        scrollRef={scrollRef}
                        responsesSaved={field.value}
                      />
                    }
                    listRender={
                      <ListItem
                        labels={{ cancel: t('cancel'), saveChanges: t('saveChanges') }}
                        itemContainerRender={({ children }) => (
                          <Stack alignItems="center" fullWidth>
                            {children}
                          </Stack>
                        )}
                        valueKey=""
                        itemValueRender={
                          <ListItemRender
                            t={t}
                            canSetHelp={canSetHelp}
                            useExplanation={hasAnswerFeedback}
                            withImages={hasImageAnswers}
                            toggleHideOnHelp={toggleHideOnHelp}
                            changeCorrectResponse={changeCorrectResponse}
                            showEye={field?.value?.length > 2 && hasHelp}
                          />
                        }
                      />
                    }
                    hideAddButton
                    canAdd
                  />
                </InputWrapper>
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
      </ContextContainer>
      <ContextContainer>
        <Controller
          control={form.control}
          name="hasHelp"
          render={({ field }) => (
            <Switch
              {...field}
              onChange={(value) => {
                field.onChange(value);
                if (!value) removeHideOnHelp();
              }}
              checked={field.value}
              label={t('hasCluesLabelWithMinResponses')}
              description={t('cluesSwitchDescription')}
            />
          )}
        />
      </ContextContainer>
    </ContextContainer>
  );
}

MonoResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  scrollRef: PropTypes.object,
};
