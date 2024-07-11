/* eslint-disable import/prefer-default-export */
import { createStyles, pxToRem } from '@bubbles-ui/components';

export const NYACardBodyStyles = createStyles((theme, { fullHeight }) => {
  const cardAssignmentsStyles = theme.other.cardAssignments;
  return {
    root: {
      padding: pxToRem(16),
      paddingTop: pxToRem(22),
      flex: fullHeight && 1,
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    badgesContainer: {
      display: 'flex',
      gap: '8px',
    },
    newBadge: {
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
          color: '#4D5358',
        },
      },
    },
    draftText: {
      color: '#4D5358',
      fontSize: '10px',
    },
    calificationBadge: {
      '& > div': {
        backgroundColor: '#F2F4F8',
        border: '1px solid #878D96',
        borderRadius: 4,
        fontSize: 10,
        '&:hover': {
          backgroundColor: '#F2F4F8',
          color: '#4D5358',
        },
        '& > span': {
          color: '#4D5358',
        },
      },
    },
    title: {
      ...cardAssignmentsStyles.content.typo.lg,
      lineHeight: '20px',
      color: cardAssignmentsStyles.content.color.emphasis,
      paddingTop: '0px !important',
    },
    description: {
      ...cardAssignmentsStyles.content.typo.md,
      lineHeight: '20px',
      color: cardAssignmentsStyles.content.color.default,
      paddingTop: pxToRem(4),
    },
    subjectIcon: {
      marginRight: pxToRem(4),
    },
    subject: {
      display: 'flex',
      justifyContent: 'center',
      gap: 5,
      marginTop: pxToRem(16),
    },
    deadline: {},
    deadlineDate: {
      color: cardAssignmentsStyles.content.color.subje,
      ...cardAssignmentsStyles.content.typo['sm--medium'],
    },
    progress: {
      marginTop: pxToRem(16),
      marginBottom: pxToRem(44),
    },
  };
});
