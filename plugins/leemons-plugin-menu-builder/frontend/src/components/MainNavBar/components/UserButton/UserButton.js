import React, { useState, useEffect } from "react";
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  Collapse,
} from "@bubbles-ui/components";
import { getUserFullName } from '../../../../helpers/getUserFullName'
import { ChevDownIcon, OpenIcon } from '@bubbles-ui/icons/outline';
import { UserButttonStyles } from "./UserButton.styles";
import { navTitleVariants } from "../../MainNavBar.constants";
import { AnimatePresence, motion } from "framer-motion"


export function UserButton({ image, name, isCollapsed, session, sessionMenu, onOpen, expandedItem }) {

  const [opened, setOpened] = useState(false);
  const { classes, theme } = UserButttonStyles({ opened });
  const hasChildren = sessionMenu?.children.length > 0
  const items = (hasChildren ? sessionMenu?.children : []).map((child, index) => (
    <Box className={classes.childrenContainer} key={`user-nav-child--${child.label}--${index}`}>
      <Text className={classes.link} onClick={(event) => event.preventDefault()}>
        {child.label}
      </Text>
      {child?.openIcon && (
        <OpenIcon />
      )}
    </Box>
  ));
  console.clear()
  console.log('expandedItem', expandedItem)

  useEffect(() => {
    expandedItem === sessionMenu?.id ? setOpened(true) : setOpened(false);
  }, [expandedItem, setOpened]);

  useEffect(() => {
    isCollapsed && setOpened(false);
    !isCollapsed && expandedItem === sessionMenu?.id && setOpened(true);
  }, [isCollapsed]);

  const handleOpenChildren = (id) => {
    setOpened((o) => !o)
    onOpen(sessionMenu?.id)
  }

  return (
    <AnimatePresence>
      <Group>
        <UnstyledButton className={classes.control} onClick={() => handleOpenChildren()}>
          <Group className={classes.itemWrapper}>
            <Avatar
              src={image}
              radius="xl"
              size='sm'
              image={session?.avatar}
              fullName={session ? getUserFullName(session) : undefined}
            />
            <motion.div
              initial={{ opacity: '0' }}
              animate={isCollapsed ? "closed" : "open"}
              variants={navTitleVariants}
            >
              <Box >{name}</Box>
            </motion.div>
          </Group>
          <Box className={classes.chevronContainer}>
            <ChevDownIcon
              className={classes.chevron}
              style={{
                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 180}deg)` : 'none',
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

