import React, { useState, useEffect } from 'react';
import { Navbar, Box, Text, TextClamp, openSpotlight, ImageLoader } from '@bubbles-ui/components';
import { isEmpty, isArray, find } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MAIN_NAV_BAR_DEFAULT_PROPS,
  MAIN_NAV_BAR_PROP_TYPES,
  MAIN_NAV_WIDTH_EXPANDED,
  MAIN_NAV_WIDTH_COLLAPSED,
  mainNavVariants,
  navTitleVariants,
} from './MainNavBar.constants';
import { Logo } from './components/Logo';
import { MainNavBarStyles } from './MainNavBar.styles';
import { SpotLightButton } from './components/SpotLightButton';
import { NavItem } from './components/NavItem';
import { UserButton } from './components/UserButton';
import {
  menuData as mockedMenuData,
  session as mockedSession,
  sessionMenu as mockedSessionMenu,
} from './mock/menuData';
import { getUserFullName } from '../../helpers/getUserFullName';
import { getActiveItem } from '../../helpers/getActiveItem';

const MainNavBar = ({
  logoUrl,
  lightMode,
  navTitle,
  isLoading,
  session,
  sessionMenu,
  menuData,
}) => {
  const { classes } = MainNavBarStyles(
    { itemWidth: MAIN_NAV_WIDTH_EXPANDED, lightMode },
    { name: 'MainNav' }
  );
  // Mocks
  // const menuData = mockedMenuData;
  // const session = mockedSession;
  // const sessionMenu = mockedSessionMenu;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  const handleItemClick = (item) => {
    if (item.id === expandedItem) {
      setExpandedItem(null);
    } else {
      setExpandedItem(item.id);
    }
  };

  const handleRouteChange = () => {
    let menu = menuData;
    if (sessionMenu) {
      menu = [...menu, sessionMenu];
    }
    const items = getActiveItem(menu);

    if (items?.activeItem && items.activeItem.id !== activeItem?.id) {
      setActiveItem(items.activeItem);
    }

    if (items?.activeSubItem && items.activeSubItem.id !== activeSubItem?.id) {
      setActiveSubItem(items.activeSubItem);
    }
  };

  useEffect(() => {
    if (isLoading || !menuData || (isArray(menuData) && !menuData.length)) {
      handleRouteChange();
    }
    if (menuData && activeItem) {
      let menu = menuData;
      if (sessionMenu) {
        menu = [...menu, sessionMenu];
      }
      setActiveItem(find(menu, { id: activeItem.id }));
    }
  }, [menuData, sessionMenu, isLoading]);

  const hasLogo = !isEmpty(logoUrl);

  const navBarItems = menuData.map((item, index) => {
    const isSubItemActive =
      item.children.length > 0
        ? item.children.find((child) => child?.id === activeSubItem?.id)
        : false;
    return (
      <NavItem
        {...item}
        key={`nav-item--${item.id}--${index}`}
        isCollapsed={isCollapsed}
        id={item.id}
        onOpen={() => handleItemClick(item)}
        expandedItem={expandedItem}
        isActive={activeItem?.id === item.id && !isSubItemActive}
        subItemActive={isSubItemActive}
        lightMode={lightMode}
      />
    );
  });

  return (
    <>
      <AnimatePresence>
        <motion.div
          sx={() => ({ overflow: 'hidden' })}
          initial={{ width: MAIN_NAV_WIDTH_COLLAPSED }}
          amimate={isCollapsed ? 'closed' : 'open'}
          variants={mainNavVariants}
          whileHover={{ width: MAIN_NAV_WIDTH_EXPANDED }}
          transition={{ type: 'tween' }}
        >
          <Navbar
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
            sx={() => ({ overflow: 'hidden' })}
          >
            <Box className={classes.navWrapper}>
              {/* LOGO */}
              <Box>
                <Box className={classes.logoContainer}>
                  {hasLogo ? (
                    <ImageLoader
                      src={logoUrl}
                      forceImage
                      className={classes.logoUrl}
                      height="auto"
                    />
                  ) : (
                    <Logo isotype className={classes.logo} />
                  )}
                  {navTitle ? (
                    <motion.div
                      initial={{ opacity: '0' }}
                      animate={isCollapsed ? 'closed' : 'open'}
                      variants={navTitleVariants}
                    >
                      <TextClamp lines={1}>
                        <Text
                          role="expressive"
                          size="lg"
                          lines={1}
                          strong={true}
                          className={classes.navTitle}
                        >
                          {navTitle}
                        </Text>
                      </TextClamp>
                    </motion.div>
                  ) : null}
                </Box>
              </Box>
              <Box className={classes.navItemsWrapper}>
                <Box>
                  {/* SPOTLIGHT */}
                  <SpotLightButton
                    onClick={() => openSpotlight()}
                    isCollapsed={isCollapsed}
                    lightMode={lightMode}
                  />
                </Box>
                {/* ITEMS */}
                <Box className={classes.navItems}>
                  <Box className={classes.linksInner}>{navBarItems}</Box>
                  <Box>
                    <Box>
                      <UserButton
                        name={getUserFullName(session)}
                        isCollapsed={isCollapsed}
                        session={session}
                        sessionMenu={sessionMenu}
                        onOpen={() => handleItemClick(sessionMenu)}
                        expandedItem={expandedItem}
                        subItemActive={activeSubItem}
                        lightMode={lightMode}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Navbar>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

MainNavBar.displayName = 'MainNavBar';

MainNavBar.defaultProps = MAIN_NAV_BAR_DEFAULT_PROPS;
MainNavBar.propTypes = MAIN_NAV_BAR_PROP_TYPES;
export { MainNavBar };
