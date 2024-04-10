import { createStyles, makeStyles } from '@bubbles-ui/components';

const TreeHeaderStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    marginBottom: 8,
    gap: 0,
    alignItems: 'center',
  },
  headerText: {
    color: '#878D96',
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'uppercase',
    paddingRight: 4,
  },
  divider: {
    width: '100%',
    marginRight: 16,
  },
}));

export { TreeHeaderStyles };
