import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { findIndex, forEach, capitalize } from 'lodash';
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
import { TextEditorInput, TEXT_EDITOR_TEXTAREA_TOOLBARS } from '@bubbles-ui/editors';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { ListInputRender } from './components/ListInputRender';
import { ListItemRender } from './components/ListItemRender';

const validateImages = (responses) => responses.every(({ value: { image } }) => image);
const validateExplanations = (responses) =>
  responses.every(({ value: { response, explanation } }) => response && explanation);
const validateResponses = (responses) => responses.every(({ value: { response } }) => response);
const hasCorrectResponse = (responses) =>
  responses.some(({ value: { isCorrectResponse } }) => isCorrectResponse);

function MonoResponse({ form: _form, t, scrollRef }) {
  const form = useFormContext() ?? _form;
  const withImages = form.watch('withImages');
  const properties = form.watch('properties');
  const [showInput, setShowInput] = React.useState(false);

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

  const monoResponseAnwsersMargin = useMemo(() => {
    if (!properties?.hasClues) {
      if (withImages) return { marginBottom: 120 };
      return { marginBottom: 40 };
    }
    return {};
  }, [properties?.hasClues, withImages]);

  return (
    <ContextContainer>
      <ContextContainer title={`${capitalize(t('explanationLabel'))}`}>
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
          render={({ field }) => (
            <TextEditorInput
              {...field}
              toolbars={TEXT_EDITOR_TEXTAREA_TOOLBARS}
              editorStyles={{ minHeight: '96px' }}
              placeholder={t('explanationPlaceHolder')}
            />
          )}
        />
      ) : null}
      <ContextContainer title={`${t('responsesLabel')} *`} spacing={0}>
        <Controller
          control={form.control}
          name="withImages"
          render={({ field }) => (
            <Switch {...field} checked={field.value} label={t('withImagesLabel')} />
          )}
        />
        <Controller
          control={form.control}
          name="properties.hasClues"
          render={({ field }) => (
            <Switch {...field} checked={field.value} label={t('hasCluesLabel')} />
          )}
        />
      </ContextContainer>
      <Text color="primary" strong>
        {t('responsesDescription')}
      </Text>
      <Controller
        control={form.control}
        name="properties.responses"
        rules={{
          required: t('typeRequired'),
          validate: (responses) => {
            if (withImages && !validateImages(responses)) {
              return t('needImages');
            }
            if (properties?.explanationInResponses && !validateExplanations(responses)) {
              return t('needExplanationAndResponse');
            }
            if (!validateResponses(responses)) {
              return t('needResponse');
            }
            if (!hasCorrectResponse(responses)) {
              return t('errorMarkGoodResponse');
            }
            return true;
          },
        }}
        render={({ field }) => {
          let canSetHelp = true;
          forEach(field.value, ({ value: { hideOnHelp } }) => {
            if (hideOnHelp) canSetHelp = false;
          });
          return (
            <Box sx={monoResponseAnwsersMargin}>
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
                    itemValueRender={
                      <ListItemRender
                        t={t}
                        canSetHelp={canSetHelp}
                        useExplanation={properties?.explanationInResponses}
                        withImages={withImages}
                        toggleHideOnHelp={toggleHideOnHelp}
                        changeCorrectResponse={changeCorrectResponse}
                        showEye={field?.value?.length > 2}
                        // showEye
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
    </ContextContainer>
  );
}

MonoResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  scrollRef: PropTypes.object,
};

export { MonoResponse };
