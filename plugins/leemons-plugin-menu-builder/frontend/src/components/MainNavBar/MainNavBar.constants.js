import PropTypes from 'prop-types';

export const MAIN_NAV_BAR_DEFAULT_PROPS = {
  isLoading: false,
  useSpotlight: true,
  logoUrl: '',
  navTitle: 'Leemons LXP',
  spotlightLabel: 'Search',
  session: null,
  sessionMenu: null,
  menuData: [],
  useRouter: true,
};

export const MAIN_NAV_BAR_PROP_TYPES = {
  logoUrl: PropTypes.string,
  navTitle: PropTypes.string,
  isLoading: PropTypes.bool,
  session: PropTypes.any,
  sessionMenu: PropTypes.any,
  menuData: PropTypes.array,
  useRouter: PropTypes.bool,
  spotlightLabel: PropTypes.string,
};

export const MAIN_NAV_WIDTH_EXPANDED = 250;
export const MAIN_NAV_WIDTH_COLLAPSED = 56;

export const mainNavVariants = {
  open: {
    width: MAIN_NAV_WIDTH_EXPANDED,
    transition: {
      duration: 0.2,
      staggerChildren: 0.2,
    },
  },
  closed: {
    width: MAIN_NAV_WIDTH_COLLAPSED,
    transition: {
      duration: 0.2,
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
