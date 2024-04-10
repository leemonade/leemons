import { createStyles } from '@bubbles-ui/components';

const NodeRendererStyles = createStyles((theme, { depth, isActive }) => {
  const nodeActive = {
    backgroundColor: '#E2FF7A',
    borderLeft: '2px solid #B4E600',
  };
  const nodeInactive = {
    backgroundColor: 'transparent',
    borderLeft: '2px solid transparent',
  };
  return {
    node: {
      display: 'flex',
      paddingTop: 4,
      paddingBottom: 4,
      paddingRight: 8,
      paddingInlineStart: depth * 10 + 8,
      gap: 8,
      ...(isActive ? nodeActive : nodeInactive),
    },
    nodeText: {
      cursor: 'pointer',
      ...theme.other.tree.content.typo,
    },
    icon: {
      cursor: 'pointer',
      marginTop: 4,
    },
  };
});

export { NodeRendererStyles };
