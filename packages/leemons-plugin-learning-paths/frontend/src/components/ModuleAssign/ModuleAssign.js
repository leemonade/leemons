import React, { useMemo, useState } from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import Form from '@assignables/components/Assignment/Form';
import useAssignables from '@assignables/requests/hooks/queries/useAssignables';
import {
  Box,
  Button,
  HorizontalStepperContainer,
  Loader,
  createStyles,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { prefixPN } from '@learning-paths/helpers';
import { get } from 'lodash';
import {
  LayoutHeader,
  useLayoutLocalizations,
} from '@assignables/components/Assignment/components/Layout';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';
import assignModuleRequest from '@learning-paths/requests/assignModule';
import { useHistory } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import { Config } from './components/Config';

export function useModuleAssignLocalizations() {
  // key is string
  const keys = [
    prefixPN('assignation'),
    prefixPN('moduleSetup.steps.structureData.moduleComposer'),
  ];
  const [, translations] = useTranslateLoader(keys);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return {
        ...get(res, keys[0], {}),
        structureData: get(res, keys[1]),
      };
    }

    return {};
  });
}

export const useModuleAssignStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      padding: globalTheme.spacing.padding.xlg,
      borderTop: `1px solid ${globalTheme.border.color.line.muted}`,
      background: globalTheme.background.color.surface.default,
    },
  };
});

function useTabs({ localizations }) {
  return useMemo(
    () => [
      {
        id: 'assignationForm',
        label: localizations?.steps?.assignmentForm?.action,
      },
      {
        id: 'setup',
        label: localizations?.steps?.setup?.action,
      },
    ],
    [localizations?.steps]
  );
}

function AssignmentStep({ localizations, assignable, onNextStep }) {
  const { setValue, useWatch } = useModuleAssignContext();
  const { classes } = useModuleAssignStyles();

  const value = useWatch({ name: 'assignationForm.raw' });

  return (
    <Form
      action={localizations?.steps?.assignmentForm?.action}
      assignable={assignable}
      hideMaxTime
      showInstructions
      showMessageForStudents
      withoutLayout
      onSubmit={(values) => {
        setValue('assignationForm', values);
        onNextStep();
      }}
      buttonsComponent={
        <Box className={classes.buttons}>
          <Box></Box>
          <Button type="submit" rightIcon={<ChevRightIcon />} variant="outline">
            {localizations?.buttons?.next}
          </Button>
        </Box>
      }
      defaultValues={value}
    />
  );
}

function onAssign(id, { assignationForm, state: { activities, time, type } }) {
  const activitiesWithState = {};
  Object.keys(type).forEach((key) => {
    const activity = activities[key];
    let duration = null;

    if (time?.[key] instanceof Date) {
      const hours = time?.[key].getHours();
      const minutes = time?.[key].getMinutes();

      duration = `${hours * 60 + minutes} minutes`;
    }

    activitiesWithState[key] = {
      config: activity?.config || activity?.defaultConfig || null,
      state: { duration, requirement: type?.[key] },
    };
  });

  const assignationObject = {
    assignationForm: assignationForm?.value,
    activities: activitiesWithState,
  };

  return assignModuleRequest(id, assignationObject);
}

export function ModuleAssign({ id }) {
  const { isLoading, data: assignable } = useAssignables({ id });
  const localizations = useModuleAssignLocalizations();
  const layoutLocalizations = useLayoutLocalizations();
  const [currentStep, setCurrentStep] = useState(0);
  const { classes, cx } = useModuleAssignStyles();
  const tabs = useTabs({ localizations });
  const { getValues, setValue, useWatch } = useModuleAssignContext();
  const history = useHistory();

  const assignButtonIsLoading = useWatch({ name: 'assignButtonIsLoading' });
  const activitiesLoaded = useWatch({ name: 'state.activities.loaded' });
  const activitiesLoadedCount = useMemo(
    () => Object.values(activitiesLoaded ?? {}).filter(Boolean).length,
    [activitiesLoaded]
  );
  const activitiesLength = assignable?.submission?.activities?.length;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <HorizontalStepperContainer
      Header={<LayoutHeader assign={layoutLocalizations?.assign} name={assignable?.asset?.name} />}
      data={tabs}
      allowVisitedStepClick
      currentStep={currentStep}
      onStepClick={(step) => setCurrentStep(step)}
      stickyAt={0}
      contentPadding={0}
      fullHeight
    >
      {currentStep === 0 && (
        <AssignmentStep
          assignable={assignable}
          localizations={localizations}
          onNextStep={() => setCurrentStep((step) => step + 1)}
        />
      )}
      {currentStep === 1 && (
        <>
          <Config assignable={assignable} localizations={localizations} />
          <Box className={cx(classes.buttons, classes.buttonContainer)}>
            <Button
              leftIcon={<ChevLeftIcon />}
              variant="link"
              onClick={() => setCurrentStep((step) => step - 1)}
            >
              {localizations?.buttons?.previous}
            </Button>
            <Button
              disabled={activitiesLength !== activitiesLoadedCount}
              loading={assignButtonIsLoading}
              onClick={() => {
                setValue('assignButtonIsLoading', true);
                onAssign(id, getValues())
                  .then(({ assignation: { module } }) =>
                    history.push(`/private/learning-paths/modules/dashboard/${module}`)
                  )
                  .catch((e) =>
                    addErrorAlert(`${localizations?.alert?.failedToAssign}: ${e.message}`)
                  )
                  .finally(() => setValue('assignButtonIsLoading', false));
              }}
            >
              {localizations?.buttons?.assign}
            </Button>
          </Box>
        </>
      )}
    </HorizontalStepperContainer>
  );
}

ModuleAssign.propTypes = {
  id: PropTypes.string,
};
