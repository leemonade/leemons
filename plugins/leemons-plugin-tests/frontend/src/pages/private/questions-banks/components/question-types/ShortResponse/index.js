import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Switch,
  ContextContainer,
  TextInput,
  Stack,
  Tooltip,
  Text,
  Box,
  TagsInput,
} from '@bubbles-ui/components';
import { TextEditorInput, TEXT_EDITOR_TEXTAREA_TOOLBARS } from '@bubbles-ui/editors';
import { InfoIcon } from '@bubbles-ui/icons/solid';
import { find, capitalize } from 'lodash';
import PropTypes from 'prop-types';

export default function ShortResponse({ form: _form, t }) {
  const form = useFormContext() || _form;
  const [altChoices, setAltChoices] = useState([]);

  function validateChoices(choicesValue) {
    const mainResponseText = find(choicesValue, { isMainChoice: true })?.text?.text;
    if (!mainResponseText) return t('typeRequired');

    return true;
  }

  // EFFECTS ·······························································································|
  useEffect(() => {
    setAltChoices(() => {
      const choicesValue = form.getValues('choices') ?? [];
      return choicesValue.filter((item) => !item?.isMainChoice);
    });
  }, []);

  // RENDER ································································································|

  return (
    <ContextContainer>
      <ContextContainer title={`${capitalize(t('explanationLabel'))}`}>
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
              error={form.formState.errors.globalFeedback?.message}
              onChange={(value) => {
                field.onChange({ format: 'html', text: value });
              }}
            />
          )}
        />
      </ContextContainer>
      <ContextContainer title={`${t('responsesLabel')} *`} spacing={0}>
        <Stack spacing={4}>
          <Controller
            control={form.control}
            name="choices"
            rules={{
              required: t('typeRequired'),
              validate: (choicesValue) => validateChoices(choicesValue),
            }}
            render={({ field }) => {
              const currentMainChoice = (field.value || []).find((item) => item?.isMainChoice);
              const currentAltChoices = (field.value || []).filter((item) => !item?.isMainChoice);

              return (
                <TextInput
                  label={t('responseLabel')}
                  sx={{ width: '100%' }}
                  placeholder={t('responsePlaceholder')}
                  required
                  value={currentMainChoice?.text?.text ?? ''}
                  error={form.formState.errors.choices?.message}
                  onChange={(mainChoiceTextValue) => {
                    field.onChange([
                      {
                        text: { text: mainChoiceTextValue, format: 'plain' },
                        isCorrect: true,
                        isMainChoice: true,
                      },
                      ...(currentAltChoices || []),
                    ]);
                  }}
                />
              );
            }}
          />

          <Box sx={{ width: '100%' }}>
            <TagsInput
              label={
                <Tooltip
                  autoHeight
                  size="md"
                  multiline
                  position="right-start"
                  label={'Equaly valid alternative answers'}
                >
                  <Stack spacing={1}>
                    <Text>{t('alternativeResponseLabel')}</Text>
                    <InfoIcon width={15} height={15} />
                  </Stack>
                </Tooltip>
              }
              styles={{ width: '100%' }}
              value={altChoices.map((item) => item?.text?.text)}
              placeholder={t('tagsInputPlaceholder')}
              onChange={(values) => {
                const finalAltChoices = [
                  ...values.map((item) => ({
                    text: { text: item, format: 'plain' },
                    isCorrect: true,
                  })),
                ];
                setAltChoices(finalAltChoices);
                const currentMainChoice = form
                  .getValues('choices')
                  ?.find((item) => item?.isMainChoice);
                if (currentMainChoice) {
                  form.setValue('choices', [currentMainChoice, ...finalAltChoices]);
                } else {
                  form.setValue('choices', finalAltChoices);
                }
              }}
            />
          </Box>
        </Stack>
      </ContextContainer>
      <ContextContainer>
        <Controller
          control={form.control}
          name="hasHelp"
          render={({ field }) => (
            <Switch
              {...field}
              checked={field.value}
              label={t('hasCluesLabel')}
              description={t('cluesSwitchDescription')}
            />
          )}
        />
      </ContextContainer>
    </ContextContainer>
  );
}

ShortResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export { ShortResponse };
