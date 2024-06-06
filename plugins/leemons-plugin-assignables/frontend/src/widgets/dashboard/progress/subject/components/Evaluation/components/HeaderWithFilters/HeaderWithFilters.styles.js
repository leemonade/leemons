import { createStyles } from '@bubbles-ui/components';

const useHeaderWithFiltersStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    typeText: {
      ...globalTheme.content.typo.body.md,
      color: globalTheme.content.color.text.dark,
    },
    descriptionText: {
      ...globalTheme.content.typo.body.sm,
      color: globalTheme.content.color.text.dark,
    },
  };
});

export default useHeaderWithFiltersStyles;
