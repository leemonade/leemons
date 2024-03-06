import { createStyles } from '@bubbles-ui/components';

const ObjectivesStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  input: {
    width: '400px !important',
    flex: 1,
  },
  button: {
    marginTop: 28,
  },
}));

export { ObjectivesStyles };
