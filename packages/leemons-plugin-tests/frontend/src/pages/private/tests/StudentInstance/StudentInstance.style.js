import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const StudentInstanceStyles = createStyles((theme, { isFirstStep }) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
  },
  header: {
    height: isFirstStep ? 'calc(25vh - 16px)' : 60,
    position: 'relative',
  },
  mainContent: {
    display: 'flex',
    height: isFirstStep ? 'calc(75vh - 16px)' : 'calc(100% - 60px)',
    backgroundColor: isFirstStep ? theme.colors.uiBackground01 : theme.colors.uiBackground02,
  },
  verticalStepper: { width: 232, backgroundColor: theme.colors.uiBackground01 },
  pages: {
    flex: 1,
    display: 'flex',
  },
  loremIpsum: {
    paddingTop: 16,
    paddingLeft: theme.spacing[10],
    paddingRight: theme.spacing[10],
    width: '100%',
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
  statementText: {
    paddingTop: 24,
    paddingBottom: 40,
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
    justifyContent: 'space-between',
    gap: theme.spacing[5],
    marginBottom: theme.spacing[8],
  },
  continueButtonFirst: {
    display: 'flex',
    justifyContent: 'end',
    gap: theme.spacing[5],
    marginBottom: theme.spacing[8],
  },
  limitedWidthStep: {
    width: '100%',
    maxWidth: theme.breakpoints.md,
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
