import { useState } from 'react';

import { Avatar, Stack, Box, createStyles, ModalZoom } from '@bubbles-ui/components';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { UploadingFileModal } from '@leebrary/components';
import SocketIoService from '@mqtt-socket-io/service';
import PropTypes from 'prop-types';

import getUserFullName from '../../../../helpers/getUserFullName';

import { updateUserImageRequest } from '@users/request';

const Styles = createStyles((theme) => ({
  imageOver: {
    position: 'absolute',
    width: '100%',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: theme.colors.text07,
    zIndex: 2,
    borderRadius: '50%',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.fontSizes[1],
    lineHeight: '1em',
    padding: theme.spacing[5],
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
}));

function UserImage({ t, user, session, form, isEditMode }) {
  const isMe = user.id === session?.id;
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [uploadingFileInfo, setUploadingFileInfo] = useState(null);
  const { classes: styles } = Styles({}, { name: 'UserImage' });

  const avatar = form.watch('user.avatar');

  SocketIoService.useOn('USER_CHANGE_AVATAR', (event, { url }) => {
    const a = avatar.split('?');
    if (url === a[0]) {
      form.setValue('user.avatar', `${url}?t=${Date.now()}`);
    }
  });

  async function saveImage(file) {
    try {
      const { data } = await updateUserImageRequest(user.id, file, setUploadingFileInfo);
      setUploadingFileInfo(null);

      form.setValue('user.avatar', `${data.avatar}?t=${Date.now()}`);
      addSuccessAlert(t('imageUpdated'));
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  function selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        saveImage(file);
      }
    };
    input.click();
  }

  return (
    <>
      <Stack>
        <Box sx={() => ({ display: 'flex', position: 'relative' })}>
          {isEditMode || isMe ? (
            <Box className={styles.imageOver} onClick={selectImage}>
              {t('changeAvatar')}
            </Box>
          ) : null}
          <ModalZoom>
            <Avatar
              image={avatar}
              fullName={getUserFullName(user, { singleSurname: true })}
              mx="auto"
              size="lg"
            />
          </ModalZoom>
        </Box>
      </Stack>
      <UploadingFileModal opened={uploadingFileInfo !== null} info={uploadingFileInfo} />
    </>
  );
}

UserImage.propTypes = {
  user: PropTypes.object,
  t: PropTypes.func,
  form: PropTypes.object,
  isEditMode: PropTypes.bool,
  session: PropTypes.object,
};

export default UserImage;
