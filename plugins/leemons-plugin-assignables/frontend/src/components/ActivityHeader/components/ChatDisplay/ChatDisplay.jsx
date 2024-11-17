import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@bubbles-ui/components';
import { CommentIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { useComunica } from '@comunica/context';

function ChatDisplay({ instance }) {
  const [t] = useTranslateLoader(prefixPN('activity_dashboard'));
  const { openRoom } = useComunica();

  function onChatHandler() {
    openRoom(`assignables.instance:${instance.id}:group`);
  }

  return (
    <Box>
      <Button
        leftIcon={<CommentIcon width={15} height={15} />}
        variant="link"
        onClick={onChatHandler}
      >
        {t('chatButton')}
      </Button>
    </Box>
  );
}

ChatDisplay.propTypes = {
  instance: PropTypes.object.isRequired,
};

export { ChatDisplay };
