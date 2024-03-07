/* eslint-disable import/prefer-default-export */
import { createStyles } from '@bubbles-ui/components';

export const LibraryCardSkeletonStyles = createStyles((theme) => ({
  root: {
    minWidth: 264,
    maxWidth: 320,
    width: '100%',
    height: 399,
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
  subjectContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 22,
    gap: 3,
    alignItems: 'center',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    gap: 3,
  },
}));
