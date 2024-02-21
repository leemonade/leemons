import { createStyles } from '@bubbles-ui/components';

const ClassroomPickerStyles = createStyles((theme, { contentWidth, isOpen }) => ({
  popoverButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    padding: '8px 12px 8px 8px',
    border: `1px solid ${theme.other.input.border.color.default}`,
    backgroundColor: theme.other.input.background.color.default,
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
    width: contentWidth,
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
    borderRadius: 2,
    backgroundColor: theme.other.banner.background.color.warning,
    marginLeft: '8px',
    padding: '4px 8px',
  },
  collisionLabel: {
    color: theme.other.cardAssignments.content.color.subject,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
  },
  collisionIcon: {
    color: theme.other.banner.content.color.warning,
    marginRight: 8,
  },
}));

export { ClassroomPickerStyles };
