import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const TaskDoingStyles = createStyles((theme, { isFirstStep }) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
  },
  taskHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 5,
    backgroundColor: theme.colors.mainWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    height: isFirstStep ? 'calc(25vh - 16px)' : 60,
    position: 'relative',
  },
  mainContent: {
    display: 'flex',
    height: isFirstStep ? 'calc(75vh - 16px)' : 'calc(100% - 60px)',
  },
  verticalStepper: { width: 232 },
  pages: {
    flex: 1,
    display: 'flex',
  },
  loremIpsum: {
    paddingTop: 16,
    paddingInline: '10%',
  },
  resources: {
    padding: 16,
    backgroundColor: theme.colors.ui03,
  },
  subtitle: {
    display: 'block',
    paddingTop: 24,
    paddingBottom: 40,
    fontSize: 18,
  },
  mainText: {
    display: 'block',
    paddingTop: 16,
    paddingBottom: 32,
    fontSize: 16,
  },
  itemDisplayContainer: {
    backgroundColor: theme.colors.mainWhite,
    padding: 12,
  },
  fileItemList: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  continueButton: {
    display: 'flex',
    justifyContent: 'end',
    gap: theme.spacing[5],
  },
  preDoing: {
    width: '100%',
    padding: '36px 247.5px',
  },
  preDoingText: {
    display: 'block',
    fontSize: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  preDoingSubtitle: {
    display: 'block',
    paddingTop: 24,
  },
  preDoingButton: {
    paddingTop: 24,
  },
  scoreFeedbackContainer: {
    marginTop: 48,
    marginBottom: 40,
  },
  scoreFeedback: {
    padding: 24,
    borderTopRightRadius: 'inherit',
    borderBottomRightRadius: 'inherit',
  },
  calification: {
    paddingTop: 24,
    paddingLeft: '10%',
    paddingRight: '20%',
  },
  calificationFooter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
}));
