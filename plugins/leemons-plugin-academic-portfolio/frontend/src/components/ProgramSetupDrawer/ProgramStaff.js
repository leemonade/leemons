import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { ContextContainer, Alert, Stack } from '@bubbles-ui/components';
import { addErrorAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import { SelectUserAgent } from '@users/components';
import PropTypes from 'prop-types';

import { PROGRAM_STAFF_ROLES } from '@academic-portfolio/config/constants';
import { useAcademicProfiles } from '@academic-portfolio/hooks';
import { validateStaffChangeRequest } from '@academic-portfolio/request';

const activeRoles = [PROGRAM_STAFF_ROLES.PROGRAM_COORDINATOR];

const ProgramStaff = ({ control, localizations, isEditing, programId }) => {
  const profiles = useAcademicProfiles();
  const [staffValidationError, setStaffValidationError] = useState(null);
  const { openConfirmationModal } = useLayout();

  async function handleStaffChangeValidation(role, value) {
    try {
      await validateStaffChangeRequest({ program: programId, staff: { [role]: value } });
    } catch (error) {
      if (error.code === 'VALIDATE_STAFF_CHANGE_DENIED') {
        setStaffValidationError(localizations?.staffChangeDenied);
        return false;
      }
      addErrorAlert(error.message);
      return false;
    }
    return true;
  }

  async function handleOnChange(role, value, onChange) {
    if (!isEditing) {
      onChange(value);
      return;
    }

    openConfirmationModal({
      title: localizations?.staffChangeModal?.[role]?.title,
      description: localizations?.staffChangeModal?.[role]?.description,
      onConfirm: async () => {
        const result = await handleStaffChangeValidation(role, value);
        if (result) {
          onChange(value);
        }
      },
    })();
  }

  if (!profiles?.teacher) return null;
  return (
    <ContextContainer title={localizations?.title}>
      <Stack direction="column" spacing={2}>
        <Stack>
          {activeRoles.map((role) => (
            <Controller
              key={role}
              name={`staff.${role}`}
              control={control}
              render={({ field }) => (
                <SelectUserAgent
                  label={localizations?.roles?.[role] || ''}
                  {...field}
                  profiles={[profiles.teacher]}
                  maxSelectedValues={1}
                  onChange={(value) => {
                    handleOnChange(role, value, field.onChange);
                  }}
                  sx={{ width: 216 }}
                />
              )}
            />
          ))}
        </Stack>
        {staffValidationError && (
          <Alert
            severity="error"
            closable={localizations?.closeAlert ?? 'close'}
            onClose={() => setStaffValidationError(null)}
          >
            {staffValidationError}
          </Alert>
        )}
      </Stack>
    </ContextContainer>
  );
};

ProgramStaff.propTypes = {
  isEditing: PropTypes.bool,
  control: PropTypes.object,
  localizations: PropTypes.shape({
    title: PropTypes.string,
    roles: PropTypes.objectOf(PropTypes.string),
    staffChangeDenied: PropTypes.string,
    closeAlert: PropTypes.string,
    staffChangeModal: PropTypes.shape({
      [PROGRAM_STAFF_ROLES.PROGRAM_COORDINATOR]: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
      }),
    }),
  }),
  programId: PropTypes.string,
};

export default ProgramStaff;
