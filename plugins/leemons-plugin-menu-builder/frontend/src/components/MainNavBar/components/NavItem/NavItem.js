import React, { useState, cloneElement } from 'react';
import { NavItemStyles } from './NavItem.styles';
import { Text, Group, Box, ImageLoader, UnstyledButton, Collapse } from '@bubbles-ui/components';
import { ChevDownIcon } from '@bubbles-ui/icons/outline';
import { Link } from 'react-router-dom';
import { navTitleVariants } from '../../MainNavBar.constants';
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from 'react';


const Wrapper = ({ useRouter, url, id, children }) => {
  if (url) {
    if (useRouter) {
      return (
        <Link key={id} to={url}>
          {children}
        </Link>
      );
    }
    return (
      <a key={id} href={url}>
        {children}
      </a>
    );
  }
  return children;
};

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
  onOpen
}) => {
  const { classes, theme } = NavItemStyles();
  const hasChildren = Array.isArray(children) && children.length > 0;
  const [opened, setOpened] = useState(false);
  const handleSvgProps = !activeIconSvg || (!!activeIconSvg && activeIconSvg === iconSvg);
  const items = (hasChildren ? children : []).map((child, index) => (
    <Text className={classes.link} key={`nav-child--${child.label}--${index}`} onClick={(event) => event.preventDefault()}>
      {child.label}
    </Text>
  ));

  useEffect(() => {
    expandedItem === id ? setOpened(true) : setOpened(false);
  }, [expandedItem, setOpened]);

  useEffect(() => {

    isCollapsed && setOpened(false);
    !isCollapsed && expandedItem === id && setOpened(true);
  }, [isCollapsed]);


  const handleOpenChildren = (id) => {
    setOpened((o) => !o)
    onOpen(id)
  }


  return (
    <>
      <AnimatePresence>
        <Wrapper useRouter={useRouter} url={url} id={id}>
          <UnstyledButton onClick={() => handleOpenChildren(id)} className={classes.control}>
            <Group className={classes.itemWrapper}>
              <Box >
                <ImageLoader
                  className={classes.icon}
                  src={active && item.activeIconSvg ? activeIconSvg : iconSvg}
                  alt={iconAlt}
                  strokeCurrent
                  ignoreFill={!active && handleSvgProps}
                />
                <motion.div
                  initial={{ opacity: '0' }}
                  animate={isCollapsed ? "closed" : "open"}
                  variants={navTitleVariants}
                >
                  <Box ml="md">{label}</Box>
                </motion.div>
              </Box>
            </Group>
            <Box className={classes.chevronContainer}>
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
        </Wrapper>
        {hasChildren ? <Collapse in={opened}>{items}</Collapse> : null}
      </AnimatePresence>
    </>
  );
};
