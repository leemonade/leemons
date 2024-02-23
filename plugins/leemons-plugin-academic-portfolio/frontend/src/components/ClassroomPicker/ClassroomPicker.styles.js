import { createStyles, getInputStyle } from '@bubbles-ui/components';

const ClassroomPickerStyles = createStyles((theme, { isOpen }) => {
  const inputTheme = theme.other.input;

  return {
    popoverButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...getInputStyle(inputTheme, theme.other.global),
      height: 40,
      padding: '8px 16px 8px 8px',
      width: 'auto',
      borderRadius: 4,
    },
    popoverButtonText: {
      ...theme.other.input.content.typo,
    },
    chevronIcon: {
      color: theme.other.input.content.color.icon,
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease-in-out',
    },
    popoverContent: {
      padding: '8px',
      maxHeight: 300,
      overflowY: 'auto',
    },
    allSubjectsContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: 8,
      '&:hover': {
        backgroundColor: theme.other.core.color.primary['100'],
      },
    },
    allSubjectsCircle: {
      backgroundColor: theme.other.core.color.primary['200'],
      borderRadius: 50,
      width: 24,
      height: 24,
      marginRight: 8,
      display: 'grid',
      placeContent: 'center',
    },
    allSubjectsLabel: {
      color: theme.other.cardAssignments.content.color.subject,
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '20px',
    },
    collisionContainer: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: 4,
      backgroundColor: theme.other.banner.background.color.warning,
      padding: 8,
    },
    collisionLabel: {
      color: theme.other.cardAssignments.content.color.subject,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '20px',
      marginLeft: 8,
    },
    collisionIcon: {
      color: theme.other.banner.content.color.warning,
      marginRight: 8,
    },
    unstyledButton: {
      margin: 0,
      padding: 0,
      width: '100%',
      display: 'block',
      borderRadius: 4,
      overflow: 'hidden',
    },
    disabled: {
      cursor: 'not-allowed',
      backgroundColor: 'rgb(242, 244, 248)',
      borderColor: 'rgb(193, 199, 205)',
      color: 'rgb(193, 199, 205)',
      opacity: 0.6,
    },
    simpleDisabled: {
      cursor: 'not-allowed',
    },
  };
});

export { ClassroomPickerStyles };
