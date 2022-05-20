import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const TaskDetailHeaderStyles = createStyles((theme, { isFirstStep }) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
  },
  taskHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 5,
    backgroundColor: theme.colors.mainWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    height: isFirstStep ? 'calc(25vh - 16px)' : 60,
    position: 'relative',
  },
}));
