import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const StudentInstanceStyles = createStyles((theme, { isFirstStep }) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
    height: '100%',
  },
  header: {
    height: isFirstStep ? 'calc(25vh)' : 60,
    position: 'relative',
  },
  mainContent: {
    display: 'flex',
    height: isFirstStep ? 'calc(75vh)' : 'calc(100% - 60px)',
    backgroundColor: isFirstStep ? theme.colors.uiBackground01 : theme.colors.uiBackground02,
    overflow: 'auto',
    // paddingBottom: theme.spacing[12],
  },
  verticalStepper: { width: 232, backgroundColor: theme.colors.uiBackground01 },
  verticalStepperContent: {
    position: 'relative',
    zIndex: 1,
  },
  pages: {
    flex: 1,
    display: 'flex',
    justifyContent: 'start',
    padding: `${theme.spacing[8]}px ${theme.spacing[12]}px`,
    paddingLeft: theme.spacing[13],
    overflow: 'auto',
  },
  pagesContent: {
    width: '100%',
    maxWidth: theme.breakpoints.sm,
  },
  loremIpsum: {
    paddingTop: 16,
    width: '100%',
    paddingBottom: theme.spacing[12],
  },
  loremIpsumEmbedded: {
    paddingLeft: theme.spacing[0],
    paddingRight: theme.spacing[0],
    maxWidth: '100%',
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
    maxWidth: theme.breakpoints.sm,
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
