import { createStyles } from '@bubbles-ui/components';

const TaskOngoingListStyles = createStyles((theme) => ({
  root: {},
  header: {
    position: 'fixed',
    height: 220,
    zIndex: 9,
  },
  taskHeaderContainer: {
    position: 'relative',
    height: '100%',
    zIndex: 1,
  },
  mainContent: {
    height: '370px',
    backgroundColor: theme.colors.mainWhite,
    display: 'flex',
    gap: theme.spacing[13],
  },
  leftSide: {
    width: '50%',
    padding: '16px 32px',
  },
  leftScoreBarWrapper: {
    height: 150,
    display: 'flex',
    marginTop: 48,
  },
  rightScoreBarWrapper: {
    height: '93%',
    width: '100%',
    marginTop: 24,
  },
  scoreBarLeftLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: 23,
    marginTop: 15,
    marginRight: 60,
  },
  legend: {
    display: 'flex',
    gap: 8,
    color: '#8E97A2',
  },
  rightSide: {
    width: '50%',
    padding: 24,
  },
}));

export { TaskOngoingListStyles };
export default TaskOngoingListStyles;
