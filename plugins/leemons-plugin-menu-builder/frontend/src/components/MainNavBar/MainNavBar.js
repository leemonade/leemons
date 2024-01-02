import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  ImageLoader,
  Navbar,
  openSpotlight,
  Text,
  TextClamp,
  useHover,
} from '@bubbles-ui/components';
import { find, isArray, isEmpty } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  MAIN_NAV_BAR_DEFAULT_PROPS,
  MAIN_NAV_BAR_PROP_TYPES,
  MAIN_NAV_WIDTH_COLLAPSED,
  MAIN_NAV_WIDTH_EXPANDED,
  mainNavVariants,
  navTitleVariants,
} from './MainNavBar.constants';
import { Logo } from './components/Logo';
import { MainNavBarStyles } from './MainNavBar.styles';
import { SpotLightButton } from './components/SpotLightButton';
import { NavItem } from './components/NavItem';
import { UserButton } from './components/UserButton';
import { getUserFullName } from '../../helpers/getUserFullName';
import { getActiveItem } from '../../helpers/getActiveItem';

const MainNavBar = ({
  logoUrl,
  navTitle,
  isLoading,
  session,
  sessionMenu,
  menuData,
  useRouter,
  spotlightLabel,
}) => {
  // const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);
  const location = useLocation();
  const hasLogo = !isEmpty(logoUrl);
  const { hovered, ref } = useHover();

  const { classes } = MainNavBarStyles(
    { itemWidth: MAIN_NAV_WIDTH_EXPANDED, isCollapsed: !hovered },
    { name: 'MainNav' }
  );

  // ························································
  // HANDLERS

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

  // ························································
  // EFFECTS

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

  useEffect(() => {
    if (!isLoading && isArray(menuData) && menuData.length) {
      handleRouteChange();
    }
  }, [location]);

  // ························································
  // RENDER

  const navBarItems = useMemo(
    () =>
      menuData.map((item, index) => {
        const isSubItemActive =
          item.children.length > 0
            ? item.children.find((child) => child?.id === activeSubItem?.id)
            : false;
        const isActive = !hovered
          ? activeItem?.id === item.id
          : item.id === activeItem?.id && !isSubItemActive;
        return (
          <NavItem
            {...item}
            key={`navItem--${index}`}
            isCollapsed={!hovered}
            id={item.id}
            onOpen={() => handleItemClick(item)}
            expandedItem={expandedItem}
            isActive={isActive}
            subItemActive={isSubItemActive}
            useRouter={useRouter}
            childrenCollection={item.children}
          />
        );
      }),
    [hovered, activeItem, activeSubItem, menuData]
  );

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ width: hovered ? MAIN_NAV_WIDTH_EXPANDED : MAIN_NAV_WIDTH_COLLAPSED }}
          animate={hovered ? 'open' : 'closed'}
          variants={mainNavVariants}
          transition={{ type: 'tween' }}
        >
          <Navbar
            ref={ref}
            sx={() => ({ overflow: 'hidden' })}
            className={classes.navBar}
            withBorder={false}
          >
            <Box className={classes.navWrapper}>
              <Box>
                <Box className={classes.logoContainer}>
                  {hasLogo ? (
                    <ImageLoader
                      src={logoUrl}
                      forceImage
                      className={classes.logoUrl}
                      height="auto"
                      alt="custom-logo"
                    />
                  ) : (
                    <Logo isotype className={classes.logo} />
                  )}
                  {navTitle ? (
                    <motion.div
                      initial={{ opacity: '0' }}
                      animate={hovered ? 'open' : 'closed'}
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
                  <SpotLightButton
                    onClick={() => openSpotlight()}
                    isCollapsed={!hovered}
                    spotlightLabel={spotlightLabel}
                  />
                </Box>
                <Box className={classes.navItems}>
                  <Box className={classes.linksInner}>{navBarItems}</Box>
                  <Box>
                    <UserButton
                      name={getUserFullName(session)}
                      isCollapsed={!hovered}
                      session={session}
                      sessionMenu={sessionMenu}
                      onOpen={() => handleItemClick(sessionMenu)}
                      expandedItem={expandedItem}
                      subItemActive={activeSubItem}
                    />
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
export default MainNavBar;
export { MainNavBar };
