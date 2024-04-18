import { createStyles } from '@bubbles-ui/components';

const CourseViewStyles = createStyles((theme) => ({
  root: {},
  content: { backgroundColor: 'white', padding: 24 },
  courseData: {
    marginBottom: 16,
  },
  responsable: {
    width: '50%',
  },
  responsableLink: {
    color: 'black',
    marginLeft: 8,
  },
  responsableContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  titleContainer: {
    marginTop: 40,
    marginBottom: 16,
  },
  enrollButton: {
    marginTop: 20,
  },
}));

export { CourseViewStyles };
