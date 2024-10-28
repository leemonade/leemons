import React from 'react';

import {
  Badge,
  Title,
  Stack,
  Anchor,
  Avatar,
  Button,
  LoadingOverlay,
  ContextContainer,
  ImageProfilePicker,
} from '@bubbles-ui/components';
import { CommentIcon } from '@bubbles-ui/icons/solid';
import { useComunica } from '@comunica/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { compact, noop } from 'lodash';
import PropTypes from 'prop-types';

import { UserAgentsTags } from './components/UserAgentsTags';

import prefixPN from '@users/helpers/prefixPN';
import useUserDetails from '@users/hooks/useUserDetails';
import { getSessionUserAgent } from '@users/session';

export const USER_DETAIL_VIEWS = {
  ADMIN: 'admin',
  STUDENT: 'student',
  TEACHER: 'teacher',
};

function UserDetail({
  userId,
  hideTags,
  viewMode = USER_DETAIL_VIEWS.ADMIN,
  sysProfileFilter,
  onLoadUser = noop,
  onLoadUserAgents = noop,
  onChangeAvatar = noop,
  onChat = noop,
  canEdit,
}) {
  const enableUserDetails = !!userId;
  const { data: userDetails, isLoading } = useUserDetails({
    userId,
    enabled: enableUserDetails,
  });
  const [t] = useTranslateLoader(prefixPN('user_detail'));
  const [tForm] = useTranslateLoader(prefixPN('userForm'));
  const [avatar, setAvatar] = React.useState(userDetails?.user?.avatar);
  const userAgentId = getSessionUserAgent();
  const { openUserRoom, isChatEnabled } = useComunica();

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

  const isSelfView = userAgents.some((ua) => ua.id === userAgentId);

  const handleOpenChat = () => {
    const [userAgent] = userAgents;
    openUserRoom(userAgent.id);
    onChat();
  };

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
        <Anchor href={`mailto:${user.email}`}>{user.email}</Anchor>
        {/*
        <Box>
          <LocaleDate date={user.birthdate} options={{ dateStyle: 'medium' }} /> 🎂
        </Box>
        */}
      </Stack>
      {!hideTags && [USER_DETAIL_VIEWS.ADMIN, USER_DETAIL_VIEWS.TEACHER].includes(viewMode) && (
        <UserAgentsTags title={t('tagsTitle')} userAgentIds={userAgents.map(({ id }) => id)} />
      )}
      {!isSelfView && isChatEnabled && (
        <Stack justifyContent="center">
          <Button
            variant="link"
            onClick={handleOpenChat}
            rightIcon={<CommentIcon width={18} height={18} />}
          >
            {t('chatButton')}
          </Button>
        </Stack>
      )}
    </ContextContainer>
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string.isRequired,
  hideTags: PropTypes.bool,
  sysProfileFilter: PropTypes.string,
  viewMode: PropTypes.oneOf(Object.values(USER_DETAIL_VIEWS)),
  canEdit: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onLoadUser: PropTypes.func,
  onLoadUserAgents: PropTypes.func,
  onChangeAvatar: PropTypes.func,
  onChat: PropTypes.func,
};

export { UserDetail };
