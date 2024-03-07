import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';
import assignModuleRequest from '@learning-paths/requests/assignModule';
import { useHistory } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import { Config } from './components/Config';

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

function SetupStep({ onPrevStep, scrollRef, id, localizations, assignable }) {
  const history = useHistory();
  const { getValues, setValue, useWatch } = useModuleAssignContext();
  const assignButtonIsLoading = useWatch({ name: 'assignButtonIsLoading' });
  const activitiesLoaded = useWatch({ name: 'state.activities.loaded' });
  const activitiesLoadedCount = useMemo(
    () => Object.values(activitiesLoaded ?? {}).filter(Boolean).length,
    [activitiesLoaded]
  );
  const activitiesLength = assignable?.submission?.activities?.length;
  return (
    <TotalLayoutStepContainer
      Footer={
        <TotalLayoutFooterContainer
          scrollRef={scrollRef}
          fixed
          leftZone={
            <Button leftIcon={<ChevLeftIcon />} variant="outline" onClick={onPrevStep}>
              {localizations?.buttons?.previous}
            </Button>
          }
          rightZone={
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
          }
        />
      }
    >
      <Config assignable={assignable} localizations={localizations} />
    </TotalLayoutStepContainer>
  );
}

SetupStep.propTypes = {
  id: PropTypes.string,
  onPrevStep: PropTypes.func,
  scrollRef: PropTypes.object,
  localizations: PropTypes.object,
  assignable: PropTypes.object,
};

export default SetupStep;
