/* eslint-disable import/prefer-default-export */
import { createStyles, pxToRem } from '@bubbles-ui/components';

export const LibraryCardBodyStyles = createStyles((theme, { fullHeight }) => ({
  root: {
    padding: pxToRem(16),
    paddingTop: pxToRem(24),
    flex: fullHeight && 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pxToRem(16),
  },

  draftBadge: {
    '& > div': {
      backgroundColor: 'transparent',
      border: '1px solid #878D96',
      borderRadius: 4,
      fontSize: 10,
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#4D5358',
      },
      '& > span': {
        marginTop: 2,
        color: '#4D5358',
      },
    },
  },
  draftText: {
    color: '#4D5358',

    fontSize: '10px',
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
}));
