/* eslint-disable import/prefer-default-export */
import { createStyles, pxToRem } from '@bubbles-ui/components';

export const LibraryCardBodyStyles = createStyles((theme, { fullHeight }) => ({
  root: {
    padding: pxToRem(16),
    flex: fullHeight && 1,
    display: 'flex',
    flexDirection: 'column',
  },
  draftBadge: {
    '& > div': {
      backgroundColor: theme.other.badge.background.color.secondary.default,
      height: '16px',
      '&:hover': {
        backgroundColor: theme.other.badge.background.color.secondary.default,
      },
      '& > span': {
        marginTop: -2.5,
      },
    },
  },
  draftText: {
    color: theme.colors.mainWhite,
    fontSize: '8px',
  },
  titleContainer: {
    paddingTop: pxToRem(8),
  },
  title: {
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'Albert Sans',
    color: '#343A3F',
    lineHeight: '20px',
    paddingTop: '0px !important',
  },
  description: {
    fontSize: '14px',
    fontWeight: 400,
    fontFamily: 'Albert Sans',
    color: '#4D5358',
    paddingTop: pxToRem(8),
  },
  subject: {
    paddingTop: pxToRem(8),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
  },
  subjectName: {
    maxWidth: '70%',
  },
  // mainContainer: {
  //   // minHeight: 86,
  //   padding: `${pxToRem(14)} ${pxToRem(16)}`,
  //   // backgroundColor: theme.colors.mainWhite,
  //   flex: 1,
  // },
  // description: {
  //   color: theme.colors.text02,
  // },
  // tagsContainer: {
  //   // minHeight: 38,
  //   display: 'flex',
  //   gap: pxToRem(10),
  //   alignItems: 'center',
  //   flexWrap: 'wrap',
  //   padding: `${pxToRem(8)} ${pxToRem(16)}`,
  // },
  // label: {
  //   color: theme.colors.text05,
  // },
  // value: {
  //   color: theme.colors.text02,
  // },
}));
