/* eslint-disable import/prefer-default-export */
import { createStyles, pxToRem } from '@bubbles-ui/components';

const spaceBetween = 'space-between';
export const NYACardSkeletonStyles = createStyles((theme) => ({
  root: {
    minWidth: pxToRem(264),
    maxWidth: pxToRem(264),
    minHeight: pxToRem(380),
    width: '100%',
    borderRadius: '2px',
    backgroundColor: theme.colors.mainWhite,
    border: '1px solid  #DDE1E6',
  },
  subjectCover: {
    height: 4,
    backgroundColor: '#A2A9B0',
    borderRadius: '1px 1px 0px 0px',
  },
  cardContent: {
    padding: '16px',
  },
  badgesContainer: {
    display: 'flex',
    gap: 8,
  },
  deadlineContainer: {
    display: 'flex',
    paddingTop: pxToRem(20),
    gap: 8,
  },
  progressBar: {
    display: 'flex',
    justifyContent: spaceBetween,
    paddingTop: pxToRem(20),
  },
  subjectContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 22,
    gap: 3,
    alignItems: 'center',
  },
  footer: {
    display: 'flex',
    justifyContent: spaceBetween,
  },
  footerContainer: {
    display: 'flex',
    justifyContent: spaceBetween,
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
}));
