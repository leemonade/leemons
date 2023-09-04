import React, { useState } from 'react';
import {
  Navbar,
  Box,
  Text,
  ScrollArea,
  TextClamp,
  openSpotlight,
} from '@bubbles-ui/components';
import {
  MAIN_NAV_BAR_DEFAULT_PROPS,
  MAIN_NAV_BAR_PROP_TYPES,
  MAIN_NAV_WIDTH_EXPANDED,
  MAIN_NAV_WIDTH_COLLAPSED,
  mainNavVariants,
  navTitleVariants
} from './MainNavBar.constants';
import { find, isArray, isFunction, isEmpty } from 'lodash';
import { Logo } from './components/Logo';
import { MainNavBarStyles } from './MainNavBar.styles';
import { SpotLightButton } from './components/SpotLightButton';
import { NavItem } from './components/NavItem';
import { menuData } from './mock/menuData';
import { motion, AnimatePresence } from "framer-motion"

const MainNavBar = ({
  logoUrl,
  subNavWidth,
  lightMode,
  mainColor,
  navTitle,
}) => {
  const { classes } = MainNavBarStyles(
    { itemWidth: MAIN_NAV_WIDTH_EXPANDED, subNavWidth, lightMode, mainColor },
    { name: 'MainNav' }
  );

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);

  const handleItemClick = (item) => {
    if (item.id === expandedItem) {
      setExpandedItem(null);
    } else {
      setExpandedItem(item.id);
    }
  };

  const hasLogo = !isEmpty(logoUrl);

  const navBarItems = menuData.map((item, index) => {
    return (
      <NavItem
        {...item}
        key={`nav-item--${item.id}--${index}`}
        isCollapsed={isCollapsed}
        id={item.id}
        onOpen={() => handleItemClick(item)}
        expandedItem={expandedItem}
      />
    )
  });


  return (
    <>
      <AnimatePresence>
        <motion.div
          sx={() => ({ overflow: 'hidden' })}
          initial={{ width: MAIN_NAV_WIDTH_COLLAPSED }}
          amimate={isCollapsed ? "closed" : "open"}
          variants={mainNavVariants}
          whileHover={{ width: MAIN_NAV_WIDTH_EXPANDED }}
          transition={{ type: 'tween' }}
        >
          <Navbar onMouseEnter={() => setIsCollapsed(false)} onMouseLeave={() => setIsCollapsed(true)} sx={() => ({ overflow: 'hidden' })}
          >
            <Box className={classes.navWrapper}>
              {/* LOGO */}
              <Navbar.Section>
                <Box className={classes.logoContainer}>
                  {hasLogo ? (
                    <ImageLoader src={logoUrl} forceImage className={classes.logoUrl} height="auto" />
                  ) : (
                    <Logo isotype className={classes.logo} />
                  )}
                  {navTitle ? (
                    <motion.div
                      initial={{ opacity: '0' }}
                      animate={isCollapsed ? "closed" : "open"}
                      variants={navTitleVariants}
                    >
                      <TextClamp
                        lines={1}
                      >
                        <Text
                          role="expressive"
                          size="lg"
                          lines={1}
                        >
                          {navTitle}
                        </Text>
                      </TextClamp>
                    </motion.div>
                  ) : null}
                </Box>
              </Navbar.Section>
              <Box className={classes.navItemsWrapper}>
                <Navbar.Section >
                  {/* SPOTLIGHT */}
                  <SpotLightButton onClick={() => openSpotlight()} isCollapsed={isCollapsed} />
                </Navbar.Section>
                {/* ITEMS */}
                <Navbar.Section grow className={classes.links} component={ScrollArea} sx={() => ({ overflow: 'hidden' })}>
                  <div className={classes.linksInner}>{navBarItems}</div>
                </Navbar.Section>
              </Box>
            </Box>
          </Navbar>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
export { MainNavBar };

MainNavBar.displayName = 'MainNavBar';

MainNavBar.defaultProps = MAIN_NAV_BAR_DEFAULT_PROPS;
MainNavBar.propTypes = MAIN_NAV_BAR_PROP_TYPES;
