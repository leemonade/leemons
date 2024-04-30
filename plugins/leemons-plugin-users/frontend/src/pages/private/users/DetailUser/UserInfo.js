import React from 'react';
import PropTypes from 'prop-types';
import { TLayout, Box, Stack, ImageLoader } from '@bubbles-ui/components';
import { USER_DETAIL_VIEWS, UserDetail as UserDetailSummary } from '@users/components/UserDetail';
import { EnrollUserSummary } from '@academic-portfolio/components/EnrollUserSummary';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { getSessionCenter, getSessionProfile } from '@users/session';
import { UserAgentsTags } from '@users/components/UserDetail/components/UserAgentsTags';
import { useRequestErrorMessage } from '@common';
import { addErrorAlert } from '@layout/alert';
import { updateUserImageRequest } from '@users/request';
import compressImage from '@leebrary/helpers/compressImage';

function getViewMode(profile) {
  if (profile?.sysName === 'teacher') return USER_DETAIL_VIEWS.TEACHER;
  if (profile?.sysName === 'admin') return USER_DETAIL_VIEWS.ADMIN;
  return USER_DETAIL_VIEWS.STUDENT;
}

function UserInfo({ session }) {
  const [t] = useTranslateLoader(prefixPN('detailUser'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [userAgents, setUserAgents] = React.useState([]);
  const center = getSessionCenter();
  const profile = getSessionProfile();
  const viewMode = getViewMode(profile);
  const userId = session.id;

  // ····················································
  // HANDLERS

  async function handleOnChangeAvatar(file) {
    try {
      let compressedFile = null;
      if (file) {
        compressedFile = await compressImage({
          file: new File([file], file.name, { type: file.type }),
          config: {
            quality: 0.8,
            maxWidth: 200,
            maxHeight: 200,
          },
        });
      }
      await updateUserImageRequest(userId, compressedFile);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  return (
    <TLayout>
      <TLayout.Header
        title={t('title')}
        cancelable={false}
        icon={
          <Stack justifyContent="center" alignItems="center">
            <ImageLoader
              style={{ position: 'relative' }}
              src="/public/users/menu-icon.svg"
              width={18}
              height={18}
            />
          </Stack>
        }
      ></TLayout.Header>
      <TLayout.Content>
        <Stack spacing={10}>
          <Box sx={{ width: '40%' }}>
            <UserDetailSummary
              userId={userId}
              center={center}
              viewMode={viewMode}
              onLoadUserAgents={setUserAgents}
              onChangeAvatar={handleOnChangeAvatar}
              canEdit={true}
            />
          </Box>
          <Box sx={{ width: '60%' }}>
            {[USER_DETAIL_VIEWS.ADMIN, USER_DETAIL_VIEWS.TEACHER].includes(viewMode) && (
              <UserAgentsTags
                title={t('tagsTitle')}
                userAgentIds={userAgents.map(({ id }) => id)}
              />
            )}
            <EnrollUserSummary userId={userId} center={center} viewMode={viewMode} />
          </Box>
        </Stack>
      </TLayout.Content>
    </TLayout>
  );
}

UserInfo.propTypes = {
  session: PropTypes.object.isRequired,
};

export default UserInfo;
