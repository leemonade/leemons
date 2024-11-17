import React, { useState, useEffect } from 'react';
import {
  Text,
  Group,
  Box,
  ImageLoader,
  UnstyledButton,
  Collapse,
  TextClamp,
  Badge,
} from '@bubbles-ui/components';
import { ChevDownIcon, OpenIcon } from '@bubbles-ui/icons/outline';
import { motion, AnimatePresence } from 'framer-motion';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@menu-builder/helpers/prefixPN';
import { navTitleVariants } from '../../MainNavBar.constants';
import { NAV_ITEM_DEFAULT_PROPS, NAV_ITEM_PROP_TYPES } from './NavItem.constants';
import { NavItemStyles } from './NavItem.styles';
import { LinkWrapper } from '../LinkWrapper';

const NavItem = ({
  label,
  childrenCollection,
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
  window,
  isNew,
}) => {
  const { classes, theme } = NavItemStyles();
  const [t] = useTranslateLoader(prefixPN('labels'));
  const hasChildren = Array.isArray(childrenCollection) && childrenCollection.length > 0;
  const hasUniqueChildren = hasChildren && childrenCollection.length === 1;
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(expandedItem === id);
  }, [expandedItem, setOpened]);

  useEffect(() => {
    if (isCollapsed) setOpened(false);
    if (!isCollapsed && expandedItem === id) setOpened(true);
  }, [isCollapsed]);

  const handleOpenChildren = (childrenId) => {
    if (childrenCollection.length === 0) {
      onOpen(childrenId);
    } else {
      setOpened((o) => !o);
      onOpen(childrenId);
    }
  };
  const hasOpenIcon = window === 'BLANK' || window === 'NEW';
  const items = (hasChildren && !hasUniqueChildren ? childrenCollection : []).map(
    (child, index) => {
      const isChildrenActive = child.id === subItemActive?.id;
      const hasChildOpenIcon = child.window === 'BLANK' || child.window === 'NEW';
      return (
        <LinkWrapper
          useRouter={useRouter}
          url={child.url}
          window={child.window}
          key={`itemId--${index}`}
        >
          <Box className={classes.itemContainer}>
            <TextClamp lines={2}>
              <Text className={isChildrenActive ? classes.linkActive : classes.link}>
                {child.label}
              </Text>
            </TextClamp>
            {hasChildOpenIcon && <OpenIcon className={classes.childOpenIcon} />}
          </Box>
        </LinkWrapper>
      );
    }
  );

  return (
    <AnimatePresence>
      <LinkWrapper useRouter={useRouter} url={url} window={window} id={id} key="LinkChild">
        <UnstyledButton
          onClick={() => handleOpenChildren(id)}
          className={isActive ? classes.controlActive : classes.control}
        >
          <Group className={classes.itemWrapper}>
            <Box>
              <ImageLoader
                className={classes.icon}
                src={active && items.activeIconSvg ? activeIconSvg : iconSvg}
                alt={`figure ${iconAlt}`}
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
                </Box>
              </motion.div>
            </Box>
          </Group>
          <Box className={classes.chevronContainer}>
            {isNew && (
              <Badge closable={false} alt="badge" className={classes.badgeNew}>
                <Text size="xs" className={classes.newText}>
                  {t('new')}
                </Text>
              </Badge>
            )}
            {hasOpenIcon && <OpenIcon className={classes.openIcon} />}
            {hasChildren && !hasUniqueChildren && (
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
      {hasChildren && !hasUniqueChildren ? <Collapse in={opened}>{items}</Collapse> : null}
    </AnimatePresence>
  );
};

NavItem.displayName = 'NavItem';
NavItem.defaultProps = NAV_ITEM_DEFAULT_PROPS;
NavItem.propTypes = NAV_ITEM_PROP_TYPES;

export default NavItem;
export { NavItem };
