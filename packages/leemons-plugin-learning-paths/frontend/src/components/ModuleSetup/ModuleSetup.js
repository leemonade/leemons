import React, { cloneElement, useEffect, useMemo, useRef, useState } from 'react';

import { Box, HorizontalStepperContainer } from '@bubbles-ui/components';

import { fireEvent } from 'leemons-hooks';
import { get, isFunction, omit } from 'lodash';

import useAssignables from '@assignables/requests/hooks/queries/useAssignables';
import { unflatten } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { prefixPN } from '@learning-paths/helpers';
import createModuleRequest from '@learning-paths/requests/createModule';
import updateModuleRequest from '@learning-paths/requests/updateModule';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useHistory, useParams } from 'react-router-dom';
import { BasicData } from './components/BasicData/BasicData';
import { Header } from './components/Header';
import { StructureData } from './components/StructureData/StructureData';
import addAction from './helpers/addAction';
import { Resources } from './components/Resources';

export function useTabs({ localizations }) {
  return useMemo(
    () => [
      {
        id: 'basicData',
        label: localizations?.basicData,
      },
      {
        id: 'resources',
        label: localizations?.resources,
      },
      {
        id: 'structure',
        label: localizations?.structure,
      },
    ],
    [localizations]
  );
}

export function useModuleSetupLocalizations() {
  const key = prefixPN('moduleSetup');
  const [, translations] = useTranslateLoader(key);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return get(res, key);
    }

    return {};
  });
}

const stepsRenderers = {
  basicData: <BasicData />,
  resources: <Resources />,
  structure: <StructureData />,
};

const eventBase = 'plugin.learning-paths.modules.edit';

async function handleOnSaveEvent() {
  const actions = [];

  const promise = new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 300);
    actions.push(
      addAction(`${eventBase}.onSave.intercepted`, () => {
        clearTimeout(timer);
      })
    );
    actions.push(
      addAction(`${eventBase}.onSave.succeed`, () => {
        resolve();
      })
    );
    actions.push(
      addAction(`${eventBase}.onSave.failed`, ({ args: [reason] }) => {
        reject(reason);
      })
    );
  });

  try {
    await promise;
  } finally {
    actions.forEach((unsubscribe) => unsubscribe());
  }
}

function prepareAssignable(sharedData) {
  const assignable = {
    asset: {
      ...omit(get(sharedData, 'basicData'), 'subjects', 'program'),
      cover: get(sharedData, 'basicData.cover.id') || get(sharedData, 'basicData.cover'),
    },
    gradable: true,
    // TODO: Add center
    center: null,
    subjects: get(sharedData, 'basicData.subjects', []).map((subject) => ({
      ...subject,
      program: get(sharedData, 'basicData.program', null),
    })),
    submission: {
      activities: get(sharedData, 'state.activities', []).map((activity) => ({
        activity: activity.activity,
        id: activity.id,
      })),
    },
    resources: get(sharedData, 'state.resources', []),
    // EN: It's required
    // ES: Es requerido
    statement: 'Module',
  };

  return assignable;
}

function prepareSharedData(module) {
  const sharedData = {
    id: module.id,
    basicData: {
      ...omit(module.asset, 'file'),
      subjects: module?.subjects,
      program: module?.subjects?.[0]?.program,
    },
    state: {
      activities: module.submission.activities,
      resources: module.resources,
    },
  };

  return sharedData;
}

function onSaveDraft({ sharedDataRef, history, localizations }) {
  return addAction(`${eventBase}.onSaveDraft`, () => {
    handleOnSaveEvent()
      .then(async () => {
        const sharedData = sharedDataRef.current;

        let module;
        if (!sharedData?.id) {
          module = await createModuleRequest(prepareAssignable(sharedData), {
            published: false,
          });
        } else {
          module = await updateModuleRequest(sharedData.id, prepareAssignable(sharedData), {
            published: false,
          });
        }

        // TRANSLATE
        addSuccessAlert(localizations?.alert?.saveSuccess);

        history.replace(
          `/private/learning-paths/modules/${module.id}/edit${sharedData?.id ? '' : '?fromNew'}`
        );
      })
      .catch((e) => {
        addErrorAlert(localizations?.alert?.saveError, e.message ?? e);
      })
      .finally(() => fireEvent(`${eventBase}.onSave.finished`));

    fireEvent(`${eventBase}.onSave`);
  });
}

function onSaveAndPublish({ sharedDataRef, localizations }) {
  return addAction(`${eventBase}.onSave&Publish`, ({ args: [callback] }) => {
    handleOnSaveEvent()
      .then(async () => {
        const sharedData = sharedDataRef.current;

        if (!sharedData.id) {
          const { id } = await createModuleRequest(prepareAssignable(sharedData), {
            published: true,
          });

          sharedData.id = id;
        } else {
          const { id } = await updateModuleRequest(sharedData.id, prepareAssignable(sharedData), {
            published: true,
          });

          sharedData.id = id;
        }

        addSuccessAlert(localizations?.alert?.publishSuccess);

        if (isFunction(callback)) {
          callback(sharedData);
        }
      })
      .catch((e) => {
        addErrorAlert(localizations?.alert?.publishError, e.message ?? e);
      })
      .finally(() => fireEvent(`${eventBase}.onSave.finished`));

    fireEvent(`${eventBase}.onSave`);
  });
}

function useEventHandler({ localizations }) {
  const [, , sharedDataRef] = useModuleSetupContext();
  const history = useHistory();

  useEffect(
    () => onSaveDraft({ sharedDataRef, history, localizations }),
    [history, sharedDataRef, localizations]
  );
  useEffect(
    () => onSaveAndPublish({ sharedDataRef, localizations }),
    [sharedDataRef, localizations]
  );
}

export function useStepRenderer({ step, tabs, props }) {
  const tabId = tabs[step]?.id;

  const element = useMemo(
    () =>
      !stepsRenderers[tabId]
        ? null
        : cloneElement(stepsRenderers[tabId], {
          ...props,
        }),
    [tabId, props]
  );

  return element;
}

function useModuleInitialization() {
  const isInitialFetch = useRef(true);
  const [, updateSharedData] = useModuleSetupContext();
  const { id } = useParams();

  useEffect(() => {
    isInitialFetch.current = true;
  }, [id]);

  const { data: module } = useAssignables({
    id,
    enabled: !!(id && isInitialFetch),
    withFiles: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isInitialFetch.current && module) {
      isInitialFetch.current = false;

      updateSharedData(prepareSharedData(module));
    }
  }, [module]);
}

export function ModuleSetup() {
  const localizations = useModuleSetupLocalizations();
  const tabs = useTabs({ localizations: localizations?.tabs });

  useModuleInitialization();

  const minStep = 0;
  const maxStep = tabs?.length;
  const [currentStep, setCurrentStep] = useState(0);

  const onNextStep = () => {
    setCurrentStep((step) => (step < maxStep ? step + 1 : step));
  };
  const onPrevStep = () => {
    setCurrentStep((step) => (step > minStep ? step - 1 : step));
  };

  const renderer = useStepRenderer({
    step: currentStep,
    tabs,
    props: { localizations, onNextStep, onPrevStep },
  });

  useEventHandler({ localizations });

  return (
    <Box sx={{ position: 'relative' }}>
      <HorizontalStepperContainer
        Header={<Header localizations={localizations?.header} />}
        data={tabs}
        allowVisitedStepClick
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
        stickyAt={0}
        contentPadding={0}
        fullHeight
      >
        {renderer}
      </HorizontalStepperContainer>
    </Box>
  );
}
