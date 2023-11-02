/* eslint-disable import/prefer-default-export */
import { createStyles } from '@mantine/styles';

export const FavButtonStyles = createStyles((theme, { active }) => {
  const favButtonStyles = theme.other.buttonIconLike;
  return {
    root: {
      padding: 3,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loveIcon: {
      position: 'relative',
      zIndex: 10,
      paddingTop: 1,
      stroke: active
        ? favButtonStyles.content.color.primary.hover
        : favButtonStyles.content.color.primary.default,
      fill: active ? favButtonStyles.content.color.primary.hover : 'transparent',
      '&:hover': {
        stroke: favButtonStyles.content.color.primary.hover,
      },
    },
  };
});
