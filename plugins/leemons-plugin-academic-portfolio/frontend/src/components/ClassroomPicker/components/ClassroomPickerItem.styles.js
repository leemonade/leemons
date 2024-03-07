import { createStyles } from '@bubbles-ui/components/lib';

const ClassroomPickerItemStyles = createStyles((theme, { canRemove, isCollisionDetected }) => {
  const { cardAssignments } = theme.other;
  return {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      cursor: !canRemove && !isCollisionDetected && 'pointer',
      padding: '8px',
      '&:hover': {
        backgroundColor:
          canRemove || isCollisionDetected ? 'transparent' : theme.other.core.color.primary['100'],
      },
    },
    containerSubject: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center',
    },
    label: {
      color: cardAssignments.content.color.subject,
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '20px',
    },
    containerSchedule: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    collisionIcon: {
      color: theme.other.core.color.danger['500'],
    },
  };
});

export { ClassroomPickerItemStyles };
