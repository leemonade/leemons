import React from 'react';
import PropTypes from 'prop-types';
import Form from '@assignables/components/Assignment/Form';
import useAssignables from '@assignables/requests/hooks/queries/useAssignables';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';
import { useModuleAssignLocalizations } from './useModuleAssignLocalizations';
import SetupStep from './SetupStep';

export function ModuleAssign({ id }) {
  const { isLoading, data: assignable } = useAssignables({ id });
  const localizations = useModuleAssignLocalizations();
  const { setValue, useWatch } = useModuleAssignContext();
  const formDefaultValue = useWatch({ name: 'assignationForm.raw' });

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <Form
      assignable={assignable}
      hideMaxTime
      showInstructions
      showMessageForStudents
      withoutLayout
      onSubmit={(values) => {
        setValue('assignationForm', values);
      }}
      onlyOneSubject
      defaultValues={formDefaultValue}
    >
      <SetupStep
        stepName={localizations?.steps?.setup?.action}
        id={id}
        localizations={localizations}
        assignable={assignable}
      />
    </Form>
  );
}

ModuleAssign.propTypes = {
  id: PropTypes.string,
};

export default ModuleAssign;
