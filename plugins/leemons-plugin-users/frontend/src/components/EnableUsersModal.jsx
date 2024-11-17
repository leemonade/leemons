import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Box, Button, Modal, Paragraph } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { MultiSelectProfile } from './MultiSelectProfile';

function EnableUsersModal({ users, center, opened, onClose = noop, onConfirm = noop }) {
  const [t] = useTranslateLoader(prefixPN('enableUserModal'));
  const [profiles, setProfiles] = useState([]);

  return (
    <Modal opened={opened} onClose={onClose} title={t(users.length > 1 ? 'title' : 'titleSingle')}>
      <Paragraph
        dangerouslySetInnerHTML={{
          __html: t(users.length === 1 ? 'descriptionSingle' : 'description', {
            n: users?.length,
            centerName: center?.name,
          }),
        }}
      />
      <Box sx={{ width: 260, marginTop: 10 }}>
        <MultiSelectProfile label={t('selectProfiles')} value={profiles} onChange={setProfiles} />
      </Box>
      <Box
        sx={(theme) => ({
          marginTop: theme.spacing[4],
          display: 'flex',
          justifyContent: 'space-between',
        })}
      >
        <Button variant="link" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button onClick={() => onConfirm(profiles)} disabled={profiles.length === 0}>
          {t('confirm')}
        </Button>
      </Box>
    </Modal>
  );
}

EnableUsersModal.propTypes = {
  userAgents: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  users: PropTypes.array,
  center: PropTypes.object,
};

export { EnableUsersModal };
export default EnableUsersModal;
