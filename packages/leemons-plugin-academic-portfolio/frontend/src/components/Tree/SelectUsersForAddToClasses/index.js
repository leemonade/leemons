import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paragraph, TabPanel, Tabs, Title } from '@bubbles-ui/components';
import { useStore } from '@common';
import { ByTag } from './ByTag';

const SelectUsersForAddToClasses = ({ tree, messages }) => {
  const [store, render] = useStore({});

  return (
    <Box>
      <Box>
        <Title order={4}>{messages.title}</Title>
        <Paragraph>{messages.description}</Paragraph>
        <Paragraph>
          <strong>{messages.note}</strong>
          {messages.noteDescription}
        </Paragraph>
      </Box>
      <Tabs>
        <TabPanel label={messages.byTag}>
          <ByTag />
        </TabPanel>
        <TabPanel label={messages.byData}>
          <Box>Contewefnt ofwhat</Box>
        </TabPanel>
      </Tabs>
    </Box>
  );
};

SelectUsersForAddToClasses.propTypes = {
  tree: PropTypes.object,
  messages: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { SelectUsersForAddToClasses };
