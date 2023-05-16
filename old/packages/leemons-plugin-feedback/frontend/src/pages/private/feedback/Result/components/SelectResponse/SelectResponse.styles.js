import { createStyles } from '@bubbles-ui/components';

const SelectResponseStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.interactive03,
    height: '100vh',
  },
  container: {
    padding: 36,
    paddingTop: 16,
    backgroundColor: 'white',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  question: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  questionImage: {
    height: 50,
    width: 50,
    borderRadius: 4,
    marginRight: 26,
  },
  percentageBarContainer: {
    marginTop: 8,
    height: 20,
    backgroundColor: theme.colors.ui03,
    borderRadius: 4,
  },
  percentageBar: {
    height: '100%',
    backgroundColor: theme.colors.text02,
    borderRadius: 4,
  },
}));

export default SelectResponseStyles;
