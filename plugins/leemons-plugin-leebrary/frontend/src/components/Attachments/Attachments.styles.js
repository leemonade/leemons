import { createStyles } from '@bubbles-ui/components';

const AttachmentsStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.mainWhite,
    border: `1px solid ${theme.other.table.border.color.default}`,
    borderRadius: 4,
    width: '50%',
    minWidth: 320,
    minHeight: 66,
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragIcon: {
    width: 56,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxWidth: 72,
    minWidth: 72,
    height: '100%',
    maxHeight: 60,
    minHeight: 48,
    borderRadius: 4,
    backgroundColor: theme.colors.interactive03h,
    overflow: 'hidden',
  },
  title: {
    ...theme.other.global.content.typo.body['md--bold'],
  },
  bodyContainer: {
    width: '100%',
    marginLeft: 8,
    padding: '8px',
  },
  actionButton: {
    width: 56,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 16,
  },
}));

export { AttachmentsStyles };
