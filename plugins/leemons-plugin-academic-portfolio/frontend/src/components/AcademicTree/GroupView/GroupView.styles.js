import { createStyles } from '@bubbles-ui/components';

const GroupViewStyles = createStyles((theme) => ({
  root: {},
  content: { backgroundColor: 'white', padding: 24 },
  courseData: {
    marginBottom: 16,
  },
  responsable: {
    marginBottom: 16,
    width: '50%',
  },
  responsableContainer: {
    display: 'flex',
    gap: 10,
  },
  titleContainer: {
    marginTop: 40,
    marginBottom: 16,
  },
  enrollButton: {
    marginTop: 20,
  },
}));

export { GroupViewStyles };
