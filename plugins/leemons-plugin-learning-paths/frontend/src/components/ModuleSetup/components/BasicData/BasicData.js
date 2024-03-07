import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Loader,
  createStyles,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { noop } from 'lodash';
import { fireEvent } from 'leemons-hooks';
import { useForm, useWatch } from 'react-hook-form';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { AssetFormInput } from '@leebrary/components';
import addAction from '../../helpers/addAction';

const advancedConfig = {
  alwaysOpen: true,
  fileToRight: true,
  colorToRight: true,
  program: { show: true, required: false },
  subjects: { show: true, required: false, showLevel: true, maxOne: false },
};

function useOnSave({ onSubmit }) {
  const eventBase = 'plugin.learning-paths.modules.edit';
  useEffect(
    () =>
      addAction(`${eventBase}.onSave`, () => {
        fireEvent(`${eventBase}.onSave.intercepted`);

        onSubmit()
          .then(() => fireEvent(`${eventBase}.onSave.succeed`))
          // TRANSLATE
          .catch(() => fireEvent(`${eventBase}.onSave.failed`, 'Reason: validation failed'));
      }),
    [onSubmit]
  );
}

function useOnSubmit({ handleSubmit }) {
  const [, setSharedData] = useModuleSetupContext();

  return useCallback(
    () =>
      new Promise((resolve, reject) => {
        handleSubmit((values) => {
          setSharedData((sharedData) => ({
            ...sharedData,
            basicData: values,
          }));
          resolve();
        }, reject)();
      }),
    [handleSubmit, setSharedData]
  );
}

function useEmitTitle({ control }) {
  const [, setSharedData] = useModuleSetupContext();

  const name = useWatch({ control, name: 'name' });

  useEffect(() => {
    setSharedData((sharedData) => ({
      ...sharedData,
      basicData: {
        ...sharedData.basicData,
        name,
      },
    }));
  }, [name]);
}

export const useBasicDataStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    form: {
      paddingLeft: globalTheme.spacing.padding.xlg,
      paddingRight: globalTheme.spacing.padding.xlg,
      paddingTop: globalTheme.spacing.padding.xlg,
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'end',

      borderTop: `1px solid ${globalTheme.border.color.line.muted}`,
      marginTop: globalTheme.spacing.padding.xlg,

      paddingLeft: globalTheme.spacing.padding.xlg,
      paddingRight: globalTheme.spacing.padding.xlg,
      paddingTop: globalTheme.spacing.padding.xlg,
      paddingBottom: globalTheme.spacing.padding.xlg,
    },
  };
});

export function BasicData({ localizations, scrollRef, onNextStep = noop, onSave = noop }) {
  const [sharedData] = useModuleSetupContext();
  const form = useForm({ defaultValues: sharedData?.basicData ?? {} });

  // When sharedData.basicData brings data from the server it will be updated
  // Otherwise this is only used to handle the title changes and all fields are set in the sharedData.basicData object on submit
  useEffect(() => {
    Object.keys(sharedData?.basicData ?? {}).forEach((key) => {
      form.setValue(key, sharedData.basicData[key]);
    });
  }, [sharedData?.basicData]);

  const onSubmit = useOnSubmit({ handleSubmit: form.handleSubmit });
  useOnSave({ onSubmit });

  useEmitTitle({ control: form.control });

  if (!localizations?.steps?.basicData?.errors) {
    return <Loader />;
  }

  return (
    <TotalLayoutStepContainer
      stepName={localizations?.tabs?.basicData}
      Footer={
        <TotalLayoutFooterContainer
          scrollRef={scrollRef}
          fixed
          rightZone={
            <>
              <Button variant="link" onClick={onSave}>
                {localizations?.buttons?.saveDraft}
              </Button>
              <Button
                onClick={() =>
                  onSubmit()
                    .then(onNextStep)
                    .catch(() => {})
                }
                rightIcon={<ChevRightIcon />}
              >
                {localizations?.buttons?.next}
              </Button>
            </>
          }
        />
      }
    >
      <AssetFormInput
        form={form}
        advancedConfig={advancedConfig}
        errorMessages={localizations?.steps?.basicData?.errors}
        category="assignables.learningpaths.module"
        tagsPluginName="learning-paths"
        preview
      />
    </TotalLayoutStepContainer>
  );
}

BasicData.propTypes = {
  localizations: PropTypes.object,
  onNextStep: PropTypes.func,
  onSave: PropTypes.func,
  scrollRef: PropTypes.object,
};
