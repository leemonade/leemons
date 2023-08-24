import {
  Avatar,
  Box,
  ContextContainer,
  createStyles,
  InputWrapper,
  ModalZoom,
  Select,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import SocketIoService from '@mqtt-socket-io/service';
import { updateUserImageRequest } from '@users/request';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import getUserFullName from '../../../../helpers/getUserFullName';

const Styles = createStyles((theme) => ({
  imageOver: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: theme.colors.text07,
    zIndex: 2,
    borderRadius: '50%',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.fontSizes[3],
    padding: theme.spacing[5],
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
}));

function UserImageAndPreferredGender({ t, user, session, form, isEditMode }) {
  const isMe = user.id === session?.id;
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const { classes: styles } = Styles();
  const { openDeleteConfirmationModal, setLoading } = useLayout();
  const [store, render] = useStore({
    genders: user.preferences?.gender
      ? [{ label: user.preferences?.gender, value: user.preferences?.gender }]
      : [],
    pronouns: user.preferences?.pronoun
      ? [{ label: user.preferences?.pronoun, value: user.preferences?.pronoun }]
      : [],
    pluralPronouns: user.preferences?.pluralPronoun
      ? [{ label: user.preferences?.pluralPronoun, value: user.preferences?.pluralPronoun }]
      : [],
  });

  const avatar = form.watch('user.avatar');

  SocketIoService.useOn('USER_CHANGE_AVATAR', (event, { url }) => {
    const a = avatar.split('?');
    if (url === a[0]) {
      form.setValue('user.avatar', `${url}?t=${Date.now()}`);
    }
  });

  function addData(name, e) {
    store[name].push({ label: e, value: e });
    render();
  }

  async function saveImage(file) {
    try {
      setLoading(true);
      await updateUserImageRequest(user.id, file);
      addSuccessAlert(t('imageUpdated'));
      setLoading(false);
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
    <ContextContainer direction="row" alignItems="center">
      <Box>
        <Box sx={() => ({ display: 'inline-block', position: 'relative' })}>
          {isEditMode || isMe ? (
            <Box className={styles.imageOver} onClick={selectImage}>
              {t('changeAvatar')}
            </Box>
          ) : null}
          <ModalZoom>
            <Avatar image={avatar} fullName={getUserFullName(user)} mx="auto" size="lg" />
          </ModalZoom>
        </Box>
      </Box>
      <InputWrapper label={t('preferredGenderLabel')}>
        <ContextContainer direction="row">
          <Controller
            name="preferences.gender"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                data={store.genders}
                required
                searchable
                creatable
                disabled={!isEditMode}
                getCreateLabel={(value) => `+ ${value}`}
                onCreate={(e) => addData('genders', e)}
                nothingFound={t('noResults')}
              />
            )}
          />
          <Controller
            name="preferences.pronoun"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                data={store.pronouns}
                required
                searchable
                creatable
                disabled={!isEditMode}
                getCreateLabel={(value) => `+ ${value}`}
                onCreate={(e) => addData('pronouns', e)}
                nothingFound={t('noResults')}
              />
            )}
          />
          <Controller
            name="preferences.pluralPronoun"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                data={store.pluralPronouns}
                required
                searchable
                creatable
                disabled={!isEditMode}
                getCreateLabel={(value) => `+ ${value}`}
                onCreate={(e) => addData('pluralPronouns', e)}
                nothingFound={t('noResults')}
              />
            )}
          />
        </ContextContainer>
      </InputWrapper>
    </ContextContainer>
  );
}

UserImageAndPreferredGender.propTypes = {
  user: PropTypes.object,
  t: PropTypes.func,
  form: PropTypes.object,
  isEditMode: PropTypes.bool,
  session: PropTypes.object,
};

export default UserImageAndPreferredGender;
