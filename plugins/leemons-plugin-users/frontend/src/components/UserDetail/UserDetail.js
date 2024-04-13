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
import { UserAgentsTags } from './components/UserAgentsTags';

function UserDetail({ userId, centerId, onLoadUser = noop }) {
  const enableUserDetails = !!userId;
  const {
    data: userDetails,
    refetch: updateUserDetails,
    isLoading,
  } = useUserDetails({
    userId,
    enabled: enableUserDetails,
  });

  React.useEffect(() => {
    if (userDetails?.user) {
      onLoadUser(userDetails.user);
    }
  }, [userDetails]);

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
  const profiles = compact(userAgents.map(({ profile }) => profile));

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
      <UserAgentsTags title="Etiquetas" userAgentIds={userAgents.map(({ id }) => id)} />
    </ContextContainer>
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string.isRequired,
  centerId: PropTypes.string,
  onLoadUser: PropTypes.func,
};

export { UserDetail };
