import { createStyles } from '@mantine/styles';

export const FavButtonStyles = createStyles((theme, { isActive, isParentHovered }) => {
  const leemonsStyles = theme.other;
  const isIconActive = isActive ? 'rgba(255,255,255, 0.5)' : theme.colors.fatic01;
  return {
    root: {
      padding: 5,
      borderRadius: '50%',
      backgroundColor: isParentHovered ? leemonsStyles.core.color.white : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loveIcon: {
      position: 'relative',
      zIndex: 1,
      paddingTop: 1,
      stroke: isParentHovered ? theme.colors.fatic01 : isIconActive,
      fill: isActive ? theme.colors.fatic01 : 'transparent',
    },
  };
});
