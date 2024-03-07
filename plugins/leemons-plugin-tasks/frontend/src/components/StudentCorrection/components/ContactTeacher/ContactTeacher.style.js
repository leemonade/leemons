const { createStyles } = require('@bubbles-ui/components');

export const ContactTeacherStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing[12],
    marginBottom: theme.spacing[12],
    gap: theme.spacing[5],
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
}));

export default ContactTeacherStyles;
