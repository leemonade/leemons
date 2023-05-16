import React from 'react';
import PropTypes from 'prop-types';
import { filter, groupBy, map, uniq } from 'lodash';
import {
  ActionButton,
  ActivityAccordion,
  ActivityAccordionPanel,
  Box,
  Text,
  UserDisplayItem,
} from '@bubbles-ui/components';
import {
  RemoveIcon,
  SchoolTeacherMaleIcon,
  SingleActionsGraduateIcon,
} from '@bubbles-ui/icons/outline';
import { MembersListStyles } from './MembersList.styles';

const sysIcons = {
  teacher: <SchoolTeacherMaleIcon />,
  student: <SingleActionsGraduateIcon />,
};

function MembersList({
  t,
  opened,
  userAgents: _userAgents,
  profiles: _profiles,
  onClose = () => {},
}) {
  const { classes } = MembersListStyles({ opened }, { name: 'MembersList' });

  const userAgentsByProfile = React.useMemo(() => {
    const goodUserAgents = filter(_userAgents, { roomDeleted: 0 });
    return groupBy(goodUserAgents, 'profile');
  }, [_userAgents]);

  const profiles = React.useMemo(() => {
    const goodUserAgents = filter(_userAgents, { roomDeleted: 0 });
    const profileIds = uniq(map(goodUserAgents, 'profile'));
    return filter(_profiles, ({ id }) => profileIds.includes(id));
  }, [_profiles, _userAgents]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <ActionButton icon={<RemoveIcon height={16} width={16} />} onClick={onClose} />
      </Box>
      <Text role="productive" color="primary" stronger size="md" className={classes.title}>
        {t('members')}
      </Text>
      <ActivityAccordion compact>
        {profiles.map((profile) => (
          <ActivityAccordionPanel
            key={profile.id}
            label={profile.name}
            icon={profile.sysName ? sysIcons[profile.sysName] : null}
          >
            <Box className={classes.userWrapper}>
              {userAgentsByProfile[profile.id].map((userAgent) => (
                <UserDisplayItem {...userAgent} key={userAgent.id} />
              ))}
            </Box>
          </ActivityAccordionPanel>
        ))}
      </ActivityAccordion>
    </Box>
  );
}

MembersList.propTypes = {
  t: PropTypes.func,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  userAgents: PropTypes.any,
  profiles: PropTypes.any,
};

export { MembersList };
export default MembersList;
