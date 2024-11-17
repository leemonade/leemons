import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Box, Radio, Stack, TabPanel, Tabs} from '@bubbles-ui/components';
import {forEach, map} from 'lodash';
import {ByTag} from './ByTag';
import {ByData} from './ByData';

const SelectUsersForAddToClasses = ({
                                      showMessages = true,
                                      tree,
                                      radioMode,
                                      center,
                                      messages,
                                      onChange,
                                      disableSave,
                                      ignoreAddedUsers,
                                    }) => {
  const [activeTab, setActiveTab] = React.useState(1);

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
      if (ignoreAddedUsers) {
        return map(classes, ({students, ..._class}) => ({
          ..._class,
          students: [],
        }));
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

      {radioMode ? (
        <Box>
          <Stack>
            <Radio checked={activeTab === 1} onChange={() => setActiveTab(1)}>
              {messages.byData}
            </Radio>
            <Radio checked={activeTab === 0} onChange={() => setActiveTab(0)}>
              {messages.byTag}
            </Radio>
          </Stack>
          {activeTab === 0 ? (
            <ByTag
              center={center}
              messages={messages}
              classes={_classes}
              disableSave={disableSave}
              onChange={onChange}
            />
          ) : null}
          {activeTab === 1 ? (
            <ByData
              center={center}
              messages={messages}
              classes={_classes}
              disableSave={disableSave}
              onChange={onChange}
              ignoreAddedUsers={ignoreAddedUsers}
            />
          ) : null}
        </Box>
      ) : (
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
              ignoreAddedUsers={ignoreAddedUsers}
            />
          </TabPanel>
        </Tabs>
      )}
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
  ignoreAddedUsers: PropTypes.bool,
  radioMode: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export {SelectUsersForAddToClasses};
