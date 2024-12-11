import { Controller, useFormContext } from 'react-hook-form';

import { Switch, ContextContainer, RadioGroup } from '@bubbles-ui/components';
import { TextEditorInput, TEXT_EDITOR_TEXTAREA_TOOLBARS } from '@bubbles-ui/editors';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';

function TrueFalse({ form: formProp, t }) {
  const contextForm = useFormContext();
  const form = contextForm || formProp;

  // RENDER ································································································|

  return (
    <>
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
                onChange={(value) => {
                  field.onChange({ format: 'html', text: value });
                }}
              />
            )}
          />
        </ContextContainer>

        <ContextContainer title={`${t('responsesLabel')} *`} spacing={4}>
          <Controller
            control={form.control}
            name="trueFalseProperties.isTrue"
            rules={{
              validate: (value) => {
                if (typeof value === 'boolean') return true;
                return t('needsResponse');
              },
            }}
            render={({ field }) => (
              <RadioGroup
                {...field}
                data={[
                  { label: t('questionLabels.trueFalse.true'), value: true },
                  { label: t('questionLabels.trueFalse.false'), value: false },
                ]}
                error={form.formState.errors.trueFalseProperties?.isTrue}
              />
            )}
          />
        </ContextContainer>
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
    </>
  );
}

TrueFalse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export { TrueFalse };
