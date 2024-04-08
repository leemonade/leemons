import { createStyles } from '@bubbles-ui/components';

const DetailQuestionsStyles = createStyles((theme) => ({
  containerSelection: {
    paddingLeft: 24,
  },
  counter: {
    color: theme.other.chip.content.color.default,
    backgroundColor: theme.other.core.color.neutral['100'],
    borderRadius: 4,
    display: 'block',
    width: 'fit-content',
    padding: 10,
    marginBottom: 4,
    ...theme.other.global.content.typo.heading.xsm,
  },
  selectedCounter: {
    color: theme.other.chip.content.color.default,
    backgroundColor: theme.other.core.color.neutral['100'],
    borderRadius: 4,
    display: 'block',
    width: 'fit-content',
    padding: 10,
    ...theme.other.global.content.typo.heading.xsm,
    marginTop: 24,
    marginBottom: 8,
  },
  counterContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 8,
  },
  containerMultiSelect: {
    width: '100%',
  },
  generatorContainer: {
    paddingLeft: 16,
  },
  radioGroup: {
    marginTop: -12,
  },
}));

export { DetailQuestionsStyles };
