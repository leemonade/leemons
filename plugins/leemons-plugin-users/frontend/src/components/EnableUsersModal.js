import { Box, Button, Modal } from '@bubbles-ui/components';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import PropTypes from 'prop-types';
import React from 'react';
import { getUserAgentsInfoRequest } from '../request';

function EnableUsersModal({ userAgents, opened, onClose = () => {}, onConfirm = () => {} }) {
  const [t] = useTranslateLoader(prefixPN('enableUserModal'));
  const [store, render] = useStore({});

  async function load() {
    const {
      userAgents: [userAgent],
    } = await getUserAgentsInfoRequest([userAgents[0]], {
      withCenter: true,
      withProfile: true,
    });
    store.center = userAgent.center;
    store.profile = userAgent.profile;
    render();
  }

  React.useEffect(() => {
    if (userAgents.length) {
      load();
    }
  }, [JSON.stringify(userAgents)]);

  return (
    <Modal opened={opened} onClose={onClose} title={t('title')}>
      <Box
        dangerouslySetInnerHTML={{
          __html: t('description', {
            n: userAgents?.length,
            centerName: store.center?.name,
            profileName: store.profile?.name,
          }),
        }}
      />
      <Box
        sx={(theme) => ({
          marginTop: theme.spacing[4],
          display: 'flex',
          justifyContent: 'space-between',
        })}
      >
        <Button variant="outline" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button onClick={onConfirm}>{t('confirm')}</Button>
      </Box>
    </Modal>
  );
}

EnableUsersModal.propTypes = {
  userAgents: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export { EnableUsersModal };
export default EnableUsersModal;
