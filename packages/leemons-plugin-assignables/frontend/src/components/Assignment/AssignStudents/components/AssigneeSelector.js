import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';
import { getProfiles } from '@tasks/request/profiles';
import SelectClass from './SelectClass';
import SelectCustomGroup from './SelectCustomGroup';
import { useGroupedClassesWithSelectedSubjects } from '../hooks';

export default function AssigneeSelector({
  labels,
  profile,
  onChange,
  value,
  defaultValue,
  showResultsCheck,
  showCorrectAnswersCheck,
}) {
  const { control } = useFormContext();
  const [profiles, setProfiles] = useState(null);

  const groupedClassesWithSelectedSubjects = useGroupedClassesWithSelectedSubjects();

  const type = useWatch({
    control,
    name: 'type',
  });

  useEffect(() => {
    (async () => {
      const p = await getProfiles(profile);
      setProfiles([p[0].profile]);
    })();
  }, []);

  if (!profiles) {
    return null;
  }

  switch (type) {
    case 'class':
      return (
        <SelectClass
          labels={labels}
          profiles={profiles}
          value={value}
          onChange={onChange}
          defaultValue={defaultValue?.assignmentSetup}
          groupedClassesWithSelectedSubjects={groupedClassesWithSelectedSubjects}
          showResultsCheck={showResultsCheck}
          showCorrectAnswersCheck={showCorrectAnswersCheck}
        />
      );
    case 'customGroups':
      return (
        <SelectCustomGroup
          labels={labels}
          profiles={profiles}
          value={value}
          onChange={onChange}
          groupedClassesWithSelectedSubjects={groupedClassesWithSelectedSubjects}
          showResultsCheck={showResultsCheck}
          showCorrectAnswersCheck={showCorrectAnswersCheck}
        />
      );
    case 'session':
      // TODO: Implement session selector for tasks
      return null;
    default:
      return null;
  }
}

AssigneeSelector.propTypes = {
  labels: PropTypes.shape({}).isRequired,
  profile: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
  showResultsCheck: PropTypes.bool,
  defaultValue: PropTypes.object,
};
