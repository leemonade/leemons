import { createStyles, Box, Text, TextClamp } from "@bubbles-ui/components";
import { Sx } from "@mantine/styles";

const useStyles = createStyles((theme, { center }: { center?: boolean}) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: center ? 'center' : 'start',

    minWidth: 94,
    maxWidth: 224,
    padding: 8
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: "24px",
    color: "#212B3D"
  }
}));

export function Header({ center, label, sx }: { center?: boolean, label: string, sx?: Sx }) {
  const { classes } = useStyles({center}, { name: 'Header' });

  return <Box className={classes.root} sx={sx}>
    <TextClamp lines={1} className={classes.label}>
      <Text className={classes.label}>{label}</Text>
    </TextClamp>
  </Box>
}

