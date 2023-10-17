import React from 'react';
import PropTypes from 'prop-types';
import { Text, Button, UserDisplayItem, Box } from '@bubbles-ui/components';
import { PluginComunicaIcon } from '@bubbles-ui/icons/solid';
import { useApi } from '@common';
import getUserAgentsInfo from '@users/request/getUserAgentsInfo';
import contactTeacherStyles from './ContactTeacher.style';

export default function ContactTeacher({ assignation, subject, labels }) {
  const grade = assignation.grades.find((g) => g.subject === subject && g.type === 'main');
  const teacher = grade?.gradedBy;
  const [data] = useApi(getUserAgentsInfo, teacher);
  const user = data?.userAgents?.[0]?.user;

  const { classes } = contactTeacherStyles();

  if (!user) {
    return null;
  }

  if (grade && grade.gradedBy) {
    return (
      <Box className={classes?.container}>
        <Box className={classes?.content}>
          <Text strong color="primary" size="md">
            {labels?.title}
          </Text>
          <UserDisplayItem {...user} />
        </Box>
        <Button rounded rightIcon={<PluginComunicaIcon width={20} height={20} />}>
          {labels?.button}
        </Button>
      </Box>
    );
  }
  return null;
}

ContactTeacher.propTypes = {
  assignation: PropTypes.object.isRequired,
  subject: PropTypes.string.isRequired,
  labels: PropTypes.object.isRequired,
};
