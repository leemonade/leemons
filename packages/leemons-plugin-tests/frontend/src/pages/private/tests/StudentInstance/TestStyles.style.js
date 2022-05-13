import { createStyles, getFontProductive } from '@bubbles-ui/components';

export const TestStyles = createStyles((theme, {}) => ({
  timeLimitContainer: {
    paddingTop: theme.spacing[6],
    width: 500,
    margin: '0px auto',
    paddingBottom: theme.spacing[5],
  },
  timeLimitContent: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[5],
    width: '100%',
    height: 142,
    position: 'relative',
    backgroundImage: 'url(/public/tests/infoBg.jpg)',
    backgroundSize: 'cover',
  },
  timeLimitImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 207,
    height: 184,
  },
  timeLimitInfo: {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: 340,
    transform: 'translateY(-50%)',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'space-around',
  },
  howItWorksModalContainer: {
    padding: theme.spacing[2],
    paddingTop: theme.spacing[6],
  },
  tagline: {
    marginBottom: theme.spacing[7],
  },
  resumeBoxContainer: {
    display: 'flex',
    gap: theme.spacing[2],
    justifyContent: 'center',
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  resumeBox: {
    width: 162,
    borderRadius: 4,
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[4],
    backgroundColor: theme.colors.uiBackground02,
  },
  resumeNumber: {
    color: theme.colors.text01,
    fontSize: 32,
    textAlign: 'center',
  },
  resumeLabel: {
    ...getFontProductive(),
    color: theme.colors.text01,
    fontSize: theme.fontSizes[1],
    textAlign: 'center',
  },
}));
