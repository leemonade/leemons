import { Avatar, createStyles, Stack, Text, TextClamp, Box } from '@bubbles-ui/components';

interface Props {
  student: {
    name: string;
    avatar: string | null;
  };
}

const useStyles = createStyles(() => ({
  cell: {
    boxShadow: "0px 1px 0px 0px #F2F2F2"
  },
  container: {
    padding: "8px 16px"
  }
}));

export function StudentCell({ student }: Props) {
  const { classes } = useStyles(null, { name: 'StudentCell' });

  return (
    <td className={classes.cell}>
      <Box className={classes.container}>
        <Stack alignItems="center" spacing={2}>
          <Avatar image={student.avatar} fullName={student.name} />
          <TextClamp lines={1}>
          <Text>{student.name}</Text>
          </TextClamp>
        </Stack>
      </Box>
    </td>
  );
}
