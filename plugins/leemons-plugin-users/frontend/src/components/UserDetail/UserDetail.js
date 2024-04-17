import React from 'react';
import PropTypes from 'prop-types';
import { compact, noop } from 'lodash';
import {
  Box,
  Badge,
  Title,
  Stack,
  Anchor,
  Avatar,
  LoadingOverlay,
  ContextContainer,
} from '@bubbles-ui/components';
import useUserDetails from '@users/hooks/useUserDetails';
import { LocaleDate } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { UserAgentsTags } from './components/UserAgentsTags';

export const USER_DETAIL_VIEWS = {
  ADMIN: 'admin',
  STUDENT: 'student',
  TEACHER: 'teacher',
};

function UserDetail({
  userId,
  center,
  viewMode = USER_DETAIL_VIEWS.ADMIN,
  sysProfileFilter,
  onLoadUser = noop,
}) {
  const enableUserDetails = !!userId;
  const { data: userDetails, isLoading } = useUserDetails({
    userId,
    enabled: enableUserDetails,
  });
  const [t] = useTranslateLoader(prefixPN('user_detail'));

  React.useEffect(() => {
    if (userDetails?.user) {
      onLoadUser(userDetails.user);
    }
  }, [userDetails]);

  // ····················································
  // RENDER

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (!userDetails?.user) {
    return null;
  }

  const { user, userAgents } = userDetails;
  const fullName = `${compact([user.surnames, user.secondSurname]).join(' ')}, ${user.name}`;
  const avatarFullName = `${user.name} ${user.surnames}`;
  const avatarUrl = user.avatar;
  const profiles = compact(
    userAgents
      .filter((ua) => !ua.disabled)
      .map(({ profile }) => profile)
      .filter((profile) => (sysProfileFilter ? sysProfileFilter === profile.sysName : true))
  );

  return (
    <ContextContainer>
      <Stack direction="column" alignItems="center" fullWidth spacing={2}>
        <Avatar fullName={avatarFullName} size="xlg" image={avatarUrl} />
        <Stack spacing={2}>
          {profiles.map((profile) => (
            <Badge key={profile.id} label={profile.name} radius="default" closable={false} />
          ))}
        </Stack>
        <Title order={3}>{fullName}</Title>
        <Anchor href={`mailto:${user.email}`}>{user.email}</Anchor>
        <Box>
          <LocaleDate date={user.birthdate} options={{ dateStyle: 'medium' }} /> 🎂
        </Box>
      </Stack>
      {[USER_DETAIL_VIEWS.ADMIN, USER_DETAIL_VIEWS.TEACHER].includes(viewMode) && (
        <UserAgentsTags title={t('tagsTitle')} userAgentIds={userAgents.map(({ id }) => id)} />
      )}
    </ContextContainer>
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string.isRequired,
  center: PropTypes.object,
  onLoadUser: PropTypes.func,
  sysProfileFilter: PropTypes.string,
  viewMode: PropTypes.oneOf(Object.values(USER_DETAIL_VIEWS)),
};

export { UserDetail };
