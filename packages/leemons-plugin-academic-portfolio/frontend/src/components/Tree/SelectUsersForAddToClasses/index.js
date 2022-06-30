import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paragraph, TabPanel, Tabs, Stack, Alert } from '@bubbles-ui/components';
import { forEach } from 'lodash';
import { ByTag } from './ByTag';
import { ByData } from './ByData';

const SelectUsersForAddToClasses = ({
  showMessages = true,
  tree,
  center,
  messages,
  onChange,
  disableSave,
}) => {
  const _classes = React.useMemo(() => {
    const getClasses = (item) => {
      let classes = [];
      if (item.nodeType === 'class') {
        classes.push(item.value);
      }
      if (item.childrens) {
        forEach(item.childrens, (e) => {
          classes = classes.concat(getClasses(e));
        });
      }
      return classes;
    };

    return getClasses(tree);
  }, [tree]);

  return (
    <Box>
      {showMessages ? (
        <Box>
          <Alert severity="info" variant="block" title={messages.title} closeable={false}>
            <Stack direction="column" fullWidth spacing={4}>
              <Box>{messages.description}</Box>
              <Box>
                <strong>{messages.note} </strong>
                {messages.noteDescription}
              </Box>
            </Stack>
          </Alert>
        </Box>
      ) : null}

      <Tabs destroyInactiveTabPanel>
        <TabPanel label={messages.byTag}>
          <ByTag
            center={center}
            messages={messages}
            classes={_classes}
            disableSave={disableSave}
            onChange={onChange}
          />
        </TabPanel>
        <TabPanel label={messages.byData}>
          <ByData
            center={center}
            messages={messages}
            classes={_classes}
            disableSave={disableSave}
            onChange={onChange}
          />
        </TabPanel>
      </Tabs>
    </Box>
  );
};

SelectUsersForAddToClasses.propTypes = {
  tree: PropTypes.object,
  center: PropTypes.string,
  showMessages: PropTypes.bool,
  messages: PropTypes.object,
  onChange: PropTypes.func,
  disableSave: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { SelectUsersForAddToClasses };
