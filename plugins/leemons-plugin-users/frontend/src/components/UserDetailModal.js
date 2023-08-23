import React from 'react';
import PropTypes from 'prop-types';
import { LoadingOverlay } from '@bubbles-ui/components';
import { UserDetailModal as UserDetailModalBubbles } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import { find } from 'lodash';
import prefixPN from '@users/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getUserAgentDetailForPageRequest, getUserDetailForPageRequest } from '../request';

function UserDetailModal({ userAgent, opened, onClose = () => {} }) {
  const [t] = useTranslateLoader(prefixPN('userDetailModal'));
  const [store, render] = useStore({
    opened: false,
    loading: false,
  });

  async function load() {
    store.loading = true;
    render();
    const {
      data: { tags, user },
    } = await getUserAgentDetailForPageRequest(userAgent);
    const { data } = await getUserDetailForPageRequest(user);

    const _userAgent = find(data.userAgents, { id: userAgent });

    store.data = {
      user: {
        name: data.user.name,
        surnames: data.user.surnames,
        avatar: data.user.avatar,
        rol: _userAgent.profile.name,
        email: data.user.email,
        number: data.user.phone,
        gender: t(data.user.gender),
        birthday: data.user.birthdate ? new Date(data.user.birthdate) : null,
      },
      badges: tags,
    };

    store.loading = false;
    store.opened = opened;
    render();
  }

  React.useEffect(() => {
    if (userAgent) {
      load();
    }
    if (!opened) {
      store.opened = false;
      render();
    }
  }, [userAgent, opened]);

  return (
    <>
      {store.loading ? <LoadingOverlay visible /> : null}
      <UserDetailModalBubbles
        {...store.data}
        labels={{
          personalInformation: t('personalInformation'),
          badges: t('badges'),
          email: t('email'),
          name: t('name'),
          surnames: t('surnames'),
          rol: t('rol'),
          birthday: t('birthday'),
          gender: t('gender'),
        }}
        opened={store.opened}
        onClose={onClose}
      />
    </>
  );
}

UserDetailModal.propTypes = {
  userAgent: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
};

export { UserDetailModal };
export default UserDetailModal;
