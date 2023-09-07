import PropTypes from 'prop-types';

export const MAIN_NAV_BAR_DEFAULT_PROPS = {
  useRouter: false,
  lightMode: true,
  mainColor: 'red',
  logoUrl: '',
  useSpotlight: true,
  navTitle: 'leemons',
  isLoading: true,
  menuData: [],
};

export const MAIN_NAV_BAR_PROP_TYPES = {
  hideSubNavOnClose: PropTypes.bool,
  useRouter: PropTypes.bool,
  lightMode: PropTypes.bool,
  mainColor: PropTypes.string,
  drawerColor: PropTypes.string,
  logoUrl: PropTypes.string,
  useSpotlight: PropTypes.bool,
  spotlightTooltip: PropTypes.string,
  isLoading: PropTypes.bool,
  menuData: PropTypes.array,
};

export const MAIN_NAV_WIDTH_EXPANDED = 250;
export const MAIN_NAV_WIDTH_COLLAPSED = 56;

export const mainNavVariants = {
  open: {
    x: 0,
    transition: {
      duration: 1.5,
      staggerChildren: 0.2,
    },
  },
  closed: {
    x: 400,
    transition: {
      duration: 1.5,
      staggerChildren: 0.2,
    },
  },
};

export const navTitleVariants = {
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      staggerDirection: 1,
    },
  },
  closed: {
    opacity: 0,
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
};
