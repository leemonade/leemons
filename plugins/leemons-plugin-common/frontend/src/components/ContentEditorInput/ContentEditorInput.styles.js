import { createStyles } from '@bubbles-ui/components';

export const ContentEditorInputStyles = createStyles((theme, { hasFooter }) => ({
  root: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
  },
  textEditorContainer: {
    position: 'relative',
    flex: 4,
    marginBottom: hasFooter ? 40 : 0,
  },
}));

export default ContentEditorInputStyles;
