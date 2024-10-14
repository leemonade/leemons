import React, { useState, useEffect } from 'react';

import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  Collapse,
  TextClamp,
} from '@bubbles-ui/components';
import { ChevUpIcon, OpenIcon } from '@bubbles-ui/icons/outline';
import SocketIoService from '@mqtt-socket-io/service';
import { AnimatePresence, motion } from 'framer-motion';

import { navTitleVariants } from '../../MainNavBar.constants';
import { LinkWrapper } from '../LinkWrapper';

import { USER_BUTTON_PROP_TYPES, USER_BUTTON_DEFAULT_PROPS } from './UserButton.constants';
import { UserButttonStyles } from './UserButton.styles';

function UserButton({
  name,
  surnames,
  isCollapsed,
  session,
  sessionMenu,
  onOpen,
  expandedItem,
  subItemActive,
  useRouter,
}) {
  const [opened, setOpened] = useState(false);
  const { classes, theme } = UserButttonStyles({ opened });
  const [avatar, setAvatar] = useState(session?.avatar);

  const hasChildren = sessionMenu?.children.length > 0;
  const items = (hasChildren ? sessionMenu.children : []).map((child, index) => {
    const isChildrenActive = child.id === subItemActive?.id;
    const hasOpenIcon = child.window === 'BLANK' || child.window === 'NEW';
    return (
      <LinkWrapper
        useRouter={useRouter}
        url={child.url}
        window={child.window}
        id={child.id}
        key={`itemLink--${index}`}
      >
        <Box
          className={isChildrenActive ? classes.childrenContainerActive : classes.childrenContainer}
        >
          <TextClamp lines={1}>
            <Text className={classes.link}>{child.label}</Text>
          </TextClamp>
          {hasOpenIcon && <OpenIcon className={classes.openIcon} />}
        </Box>
      </LinkWrapper>
    );
  });

  SocketIoService.useOn('USER_CHANGE_AVATAR', (val, param) => {
    const newUrl = new URL(param?.url);
    newUrl.searchParams.set('t', new Date().getMilliseconds());
    setAvatar(newUrl.href);
  });

  useEffect(() => {
    setOpened(expandedItem === sessionMenu?.id);
  }, [expandedItem, setOpened]);

  useEffect(() => {
    if (isCollapsed) setOpened(false);
    if (!isCollapsed && expandedItem === sessionMenu?.id) setOpened(true);
  }, [isCollapsed]);

  const handleOpenChildren = () => {
    setOpened((o) => !o);
    onOpen(sessionMenu?.id);
  };

  return (
    <AnimatePresence>
      <Group key="groupKey">
        <UnstyledButton className={classes.control} onClick={() => handleOpenChildren()}>
          <Group className={classes.itemWrapper}>
            <Avatar
              src={avatar}
              radius="xl"
              size="sm"
              image={avatar}
              fullName={session ? `${surnames}, ${name}` : null}
              alt={session ? `${surnames}, ${name}` : 'user avatar'}
            />
            <motion.div
              initial={{ opacity: '0' }}
              animate={isCollapsed ? 'closed' : 'open'}
              variants={navTitleVariants}
            >
              <TextClamp lines={1}>
                <Text className={classes.nameContainer}>{`${surnames}, ${name}`}</Text>
              </TextClamp>
            </motion.div>
          </Group>
          <Box className={classes.chevronContainer}>
            <ChevUpIcon
              className={classes.chevron}
              style={{
                transform: opened ? `rotate(${theme.dir === 'rtl' ? 90 : 180}deg)` : 'none',
              }}
            />
          </Box>
        </UnstyledButton>
      </Group>
      {hasChildren ? (
        <Box className={classes.menuItemsContainer}>
          <Collapse in={opened}>
            <Box className={classes.menuItems}>{items}</Box>
          </Collapse>
        </Box>
      ) : null}
    </AnimatePresence>
  );
}

UserButton.defaultProps = USER_BUTTON_DEFAULT_PROPS;
UserButton.propTypes = USER_BUTTON_PROP_TYPES;

export { UserButton };
