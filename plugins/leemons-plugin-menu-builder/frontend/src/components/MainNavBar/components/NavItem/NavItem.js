import React, { useState, useEffect } from 'react';
import {
  Text,
  Group,
  Box,
  ImageLoader,
  UnstyledButton,
  Collapse,
  TextClamp,
  // Badge,
} from '@bubbles-ui/components';
import { ChevDownIcon, OpenIcon } from '@bubbles-ui/icons/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { navTitleVariants } from '../../MainNavBar.constants';
import { NAV_ITEM_DEFAULT_PROPS, NAV_ITEM_PROP_TYPES } from './NavItem.constants';
import { NavItemStyles } from './NavItem.styles';
import { LinkWrapper } from '../LinkWrapper';

export const NavItem = ({
  label,
  children,
  useRouter,
  activeIconSvg,
  iconSvg,
  iconAlt,
  active,
  url,
  id,
  isCollapsed,
  expandedItem,
  onOpen,
  isActive,
  subItemActive,
  lightMode,
  window,
}) => {
  const { classes, theme } = NavItemStyles({ lightMode });
  const hasChildren = Array.isArray(children) && children.length > 0;
  const [opened, setOpened] = useState(false);
  const handleSvgProps = !activeIconSvg || (!!activeIconSvg && activeIconSvg === iconSvg);

  useEffect(() => {
    setOpened(expandedItem === id);
  }, [expandedItem, setOpened]);

  useEffect(() => {
    if (isCollapsed) setOpened(false);
    if (!isCollapsed && expandedItem === id) setOpened(true);
  }, [isCollapsed]);

  const handleOpenChildren = (childrenId) => {
    if (children.length === 0) {
      onOpen(childrenId);
    } else {
      setOpened((o) => !o);
      onOpen(childrenId);
    }
  };
  const hasOpenIcon = window === 'BLANK' || window === 'NEW';

  const items = (hasChildren ? children : []).map((child, index) => {
    const isChildrenActive = child.id === subItemActive?.id;
    const hasChildOpenIcon = child.window === 'BLANK' || child.window === 'NEW';
    return (
      <LinkWrapper
        useRouter={useRouter}
        url={child.url}
        id={child.id}
        key={`nav-child--${child.id}--${index}`}
      >
        <Box className={classes.itemContainer}>
          <TextClamp lines={2}>
            <Text className={isChildrenActive ? classes.linkActive : classes.link}>
              {child.label}
              {hasChildOpenIcon && <OpenIcon className={classes.childOpenIcon} />}
            </Text>
          </TextClamp>
        </Box>
      </LinkWrapper>
    );
  });

  return (
    <AnimatePresence>
      <LinkWrapper useRouter={useRouter} url={url} id={id}>
        <UnstyledButton
          onClick={() => handleOpenChildren(id)}
          className={isActive ? classes.controlActive : classes.control}
        >
          <Group className={classes.itemWrapper}>
            <Box>
              <ImageLoader
                className={classes.icon}
                src={active && items.activeIconSvg ? activeIconSvg : iconSvg}
                alt={iconAlt}
                strokeCurrent
                ignoreFill={!active && handleSvgProps}
              />
              <motion.div
                initial={{ opacity: '0' }}
                animate={isCollapsed ? 'closed' : 'open'}
                variants={navTitleVariants}
              >
                <Box ml="md" className={classes.labelContainer}>
                  <TextClamp lines={1}>
                    <Text className={classes.labelText}>{label}</Text>
                  </TextClamp>
                  {/* <Badge closable={false} alt="new" color={'blue'}>
                    <Text size="xs">NEW</Text>
                  </Badge> */}
                </Box>
              </motion.div>
            </Box>
          </Group>
          <Box className={classes.chevronContainer}>
            {hasOpenIcon && <OpenIcon className={classes.openIcon} />}
            {hasChildren && (
              <ChevDownIcon
                className={classes.chevron}
                style={{
                  transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 180}deg)` : 'none',
                }}
              />
            )}
          </Box>
        </UnstyledButton>
      </LinkWrapper>
      {hasChildren ? <Collapse in={opened}>{items}</Collapse> : null}
    </AnimatePresence>
  );
};

NavItem.displayName = 'NavItem';
NavItem.defaultProps = NAV_ITEM_DEFAULT_PROPS;
NavItem.propTypes = NAV_ITEM_PROP_TYPES;
