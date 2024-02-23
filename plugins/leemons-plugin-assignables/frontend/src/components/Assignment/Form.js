import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { get } from 'lodash';

import {
  Box,
  ImageLoader,
  TotalLayoutContainer,
  TotalLayoutHeader,
  VerticalStepperContainer,
  Stack,
} from '@bubbles-ui/components';

import { unflatten } from '@common';
import prefixPN from '@assignables/helpers/prefixPN';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import Form from './FormComponent';

export function useFormLocalizations() {
  const key = prefixPN('assignmentForm');
  const [, translations] = useTranslateLoader(key);

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return get(res, key);
    }

    return {};
  }, [translations]);
}

export default function FormWithLayout({ assignable, children, ...props }) {
  const roleIcon = assignable?.roleDetails?.icon;

  const history = useHistory();
  const scrollRef = useRef();

  /*
    === Localizations ===
  */
  const localizations = useFormLocalizations();
  const roleLocalizations = useRolesLocalizations([assignable?.roleDetails?.name]);

  /*
    === Handle steps ===
  */
  const [currentStep, setCurrentStep] = useState(0);

  const formComponent = (
    <Form
      {...props}
      assignable={assignable}
      withoutLayout
      scrollRef={scrollRef}
      localizations={localizations}
    />
  );

  const steps = useMemo(() => {
    if (!children) {
      return [];
    }

    return [
      { label: localizations?.steps?.assignation, component: formComponent },
      ...(Array.isArray(children) ? children : [children]).map((child) => ({
        label: child?.props?.stepName,
        component: child,
      })),
    ];
  }, [children, formComponent, localizations?.steps?.assignation]);

  const onNextStep = () => {
    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onPrevStep = () => {
    if (currentStep - 1 >= 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepComponent = React.cloneElement(steps[currentStep]?.component || formComponent, {
    onNextStep,
    onPrevStep,
    scrollRef,

    hasNextStep: currentStep + 1 < steps.length,
    hasPrevStep: currentStep - 1 >= 0,
  });

  /*
    === Render ===
  */

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          cancelable
          onCancel={history.goBack}
          title={`${localizations?.steps?.action} ${
            roleLocalizations[assignable?.roleDetails?.name]?.singular
          }`}
          formTitlePlaceholder={assignable?.asset?.name}
          icon={
            <Box sx={{ position: 'relative', width: 24, height: 24 }}>
              <ImageLoader src={roleIcon} width={18} height={18} />
            </Box>
          }
        />
      }
    >
      {!steps?.length ? (
        <Stack
          sx={{ backgroundColor: '#f8f9fb', overflow: 'auto' }}
          justifyContent="center"
          ref={scrollRef}
        >
          {StepComponent}
        </Stack>
      ) : (
        <VerticalStepperContainer scrollRef={scrollRef} data={steps} currentStep={currentStep}>
          {StepComponent}
        </VerticalStepperContainer>
      )}
    </TotalLayoutContainer>
  );
}

FormWithLayout.propTypes = {
  children: PropTypes.node,

  loading: PropTypes.bool,
  action: PropTypes.string,
  assignable: PropTypes.object,
  buttonsComponent: PropTypes.node,
  defaultValues: PropTypes.object,
  evaluationType: PropTypes.oneOf(['manual', 'auto', 'none']).isRequired,
  evaluationTypes: PropTypes.arrayOf('string'),
  hideMaxTime: PropTypes.bool,
  hideSectionHeaders: PropTypes.bool,
  onlyOneSubject: PropTypes.bool,
  onSubmit: PropTypes.func,
  showEvaluation: PropTypes.bool,
  showInstructions: PropTypes.bool,
  showMessageForStudents: PropTypes.bool,
  showReport: PropTypes.bool,
  showResponses: PropTypes.bool,
};
