import { createStyles } from '@bubbles-ui/components';

const TreeHeaderStyles = createStyles((theme) => ({
  header: {
    marginBottom: 8,
  },
  headerText: {
    ...theme.other.tree.content.typo,
    color: theme.other.tree.border.color['hover-alt'],
    textTransform: 'uppercase',
  },
}));

export { TreeHeaderStyles };
