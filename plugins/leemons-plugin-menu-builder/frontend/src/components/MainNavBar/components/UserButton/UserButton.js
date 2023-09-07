/* eslint-disable import/prefer-default-export */
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
import { AnimatePresence, motion } from 'framer-motion';
import { getUserFullName } from '../../../../helpers/getUserFullName';
import { UserButttonStyles } from './UserButton.styles';
import { navTitleVariants } from '../../MainNavBar.constants';
import { USER_BUTTON_PROP_TYPES, USER_BUTTON_DEFAULT_PROPS } from './UserButton.constants';

export function UserButton({
  name,
  isCollapsed,
  session,
  sessionMenu,
  onOpen,
  expandedItem,
  subItemActive,
  lightMode,
}) {
  const [opened, setOpened] = useState(false);
  const { classes, theme } = UserButttonStyles({ opened, lightMode });
  const hasChildren = sessionMenu?.children.length > 0;
  const items = (hasChildren ? sessionMenu.children : []).map((child, index) => {
    const isChildrenActive = child.id === subItemActive?.id;
    return (
      <Box
        className={isChildrenActive ? classes.childrenContainerActive : classes.childrenContainer}
        key={`user-nav-child--${child.label}--${index}`}
      >
        <TextClamp lines={1}>
          <Text className={classes.link} onClick={(event) => event.preventDefault()}>
            {child.label}
          </Text>
        </TextClamp>
        {child?.openIcon && <OpenIcon className={classes.openIcon} />}
      </Box>
    );
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
      <Group>
        <UnstyledButton className={classes.control} onClick={() => handleOpenChildren()}>
          <Group className={classes.itemWrapper}>
            <Avatar
              src={session?.avatar}
              radius="xl"
              size="sm"
              image={session?.avatar}
              fullName={session ? getUserFullName(session) : undefined}
              alt={session ? getUserFullName(session) : 'user icon'}
            />
            <motion.div
              initial={{ opacity: '0' }}
              animate={isCollapsed ? 'closed' : 'open'}
              variants={navTitleVariants}
            >
              <TextClamp lines={1}>
                <Text className={classes.nameContainer}>{name}</Text>
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
          <Collapse in={opened}>{items}</Collapse>
        </Box>
      ) : null}
    </AnimatePresence>
  );
}

UserButton.defaultProps = USER_BUTTON_DEFAULT_PROPS;
UserButton.propTypes = USER_BUTTON_PROP_TYPES;
