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
  ImageProfilePicker,
} from '@bubbles-ui/components';
import useUserDetails from '@users/hooks/useUserDetails';
import { LocaleDate } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { RoomItemDisplay } from '@comunica/components';
import { UserAgentsTags } from './components/UserAgentsTags';

export const USER_DETAIL_VIEWS = {
  ADMIN: 'admin',
  STUDENT: 'student',
  TEACHER: 'teacher',
};

function UserDetail({
  userId,
  center,
  hideTags,
  viewMode = USER_DETAIL_VIEWS.ADMIN,
  sysProfileFilter,
  onLoadUser = noop,
  onLoadUserAgents = noop,
  onChangeAvatar = noop,
  canEdit,
  showChatButton = false,
  onChatHandler = noop,
}) {
  const enableUserDetails = !!userId;
  const { data: userDetails, isLoading } = useUserDetails({
    userId,
    enabled: enableUserDetails,
  });
  const [t] = useTranslateLoader(prefixPN('user_detail'));
  const [tForm] = useTranslateLoader(prefixPN('userForm'));
  const [avatar, setAvatar] = React.useState(userDetails?.user?.avatar);

  React.useEffect(() => {
    if (userDetails?.user) {
      onLoadUser(userDetails.user);
    }
    if (userDetails?.userAgents) {
      onLoadUserAgents(userDetails.userAgents);
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
      <Stack direction="column" alignItems="center" fullWidth spacing={3}>
        {!canEdit ? (
          <Avatar fullName={avatarFullName} size="xlg" image={avatarUrl} />
        ) : (
          <ImageProfilePicker
            value={avatar}
            onChange={(val) => {
              onChangeAvatar(val);
              setAvatar(val);
            }}
            url={avatarUrl}
            fullName={avatarFullName}
            labels={{
              uploadImage: tForm('uploadImage'),
              changeImage: tForm('changeImage'),
              delete: tForm('delete'),
              cancel: tForm('cancel'),
              accept: tForm('accept'),
            }}
          />
        )}
        <Stack spacing={2}>
          {profiles.map((profile) => (
            <Badge key={profile.id} label={profile.name} radius="default" closable={false} />
          ))}
        </Stack>
        <Title order={3}>{fullName}</Title>
        <Stack direction="row" spacing={2}>
          <Anchor href={`mailto:${user.email}`}>{user.email}</Anchor>
          {showChatButton && (
            <Box sx={{ cursor: 'pointer' }} onClick={onChatHandler}>
              <RoomItemDisplay />
            </Box>
          )}
        </Stack>
        <Box>
          <LocaleDate date={user.birthdate} options={{ dateStyle: 'medium' }} /> 🎂
        </Box>
      </Stack>
      {!hideTags && [USER_DETAIL_VIEWS.ADMIN, USER_DETAIL_VIEWS.TEACHER].includes(viewMode) && (
        <UserAgentsTags title={t('tagsTitle')} userAgentIds={userAgents.map(({ id }) => id)} />
      )}
    </ContextContainer>
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string.isRequired,
  center: PropTypes.object,
  hideTags: PropTypes.bool,
  sysProfileFilter: PropTypes.string,
  viewMode: PropTypes.oneOf(Object.values(USER_DETAIL_VIEWS)),
  onLoadUser: PropTypes.func,
  onLoadUserAgents: PropTypes.func,
  onChangeAvatar: PropTypes.func,
  canEdit: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  showChatButton: PropTypes.bool,
  onChatHandler: PropTypes.func,
};

export { UserDetail };
