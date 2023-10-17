import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextClamp, Text } from '@bubbles-ui/components';
import capitalize from 'lodash/capitalize';

const ObjectiveItem = ({
  labels,
  messageCenters,
  messagePrograms,
  messagesProfiles,
  messageClasses,
  centers,
  profiles,
  programs,
  classes,
  isTeacher,
}) => {
  const getObjectiveString = (value, type) => {
    const arrays = {
      centers,
      profiles,
      programs,
      classes,
    };

    if (value[0] === '*') return labels.objectives[`all${capitalize(type)}`];
    const string = arrays[type]
      .reduce((prev, current) => {
        if (value.includes(current.value)) return [...prev, current.label];
        return prev;
      }, [])
      .join(', ');
    return string;
  };

  const getObjective = () => {
    const centersString = getObjectiveString(messageCenters, 'centers');
    const programsString = getObjectiveString(messagePrograms, 'programs');
    const profilesString = getObjectiveString(messagesProfiles, 'profiles');
    const classesString = isTeacher ? getObjectiveString(messageClasses, 'classes') : '';

    const firstRow = `${centersString} - ${programsString}`;
    const secondRow = `${profilesString} ${isTeacher ? `- ${classesString}` : ''}`;
    return [firstRow, secondRow];
  };

  const [firstRow, secondRow] = getObjective();

  return (
    <Box>
      <TextClamp lines={1}>
        <Text color="primary" role="productive">
          {firstRow || ''}
        </Text>
      </TextClamp>
      <TextClamp lines={1}>
        <Text color="primary" role="productive">
          {secondRow || ''}
        </Text>
      </TextClamp>
    </Box>
  );
};

ObjectiveItem.propTypes = {
  labels: PropTypes.object,
  messageCenters: PropTypes.array,
  messagePrograms: PropTypes.array,
  messagesProfiles: PropTypes.array,
  messageClasses: PropTypes.array,
  centers: PropTypes.array,
  profiles: PropTypes.array,
  programs: PropTypes.array,
  classes: PropTypes.array,
  isTeacher: PropTypes.array,
};

// eslint-disable-next-line import/prefer-default-export
export { ObjectiveItem };
