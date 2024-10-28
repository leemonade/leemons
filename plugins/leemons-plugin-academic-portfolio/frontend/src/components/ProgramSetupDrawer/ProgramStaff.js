import { Controller } from 'react-hook-form';

import { ContextContainer } from '@bubbles-ui/components';
import { SelectUserAgent } from '@users/components';
import PropTypes from 'prop-types';

import { PROGRAM_STAFF_ROLES } from '@academic-portfolio/config/constants';
import { useAcademicProfiles } from '@academic-portfolio/hooks';

const activeRoles = [PROGRAM_STAFF_ROLES.PROGRAM_COORDINATOR];

const ProgramStaff = ({ control, localizations, isEditing }) => {
  const profiles = useAcademicProfiles();

  // Todo: request validation to backend for changes
  const handleOnChange = (role, value, onChange) => {
    if (isEditing) {
      console.log('isEditing', role, value);
    }
    onChange(value);
  };

  if (!profiles?.teacher) return null;
  return (
    <ContextContainer title={localizations?.title}>
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
              sx={{ width: 216 }}
              onChange={(value) => {
                handleOnChange(role, value, field.onChange);
              }}
            />
          )}
        />
      ))}
    </ContextContainer>
  );
};

ProgramStaff.propTypes = {
  isEditing: PropTypes.bool,
  control: PropTypes.object,
  localizations: PropTypes.shape({
    title: PropTypes.string,
    roles: PropTypes.objectOf(PropTypes.string),
  }),
};

export default ProgramStaff;
