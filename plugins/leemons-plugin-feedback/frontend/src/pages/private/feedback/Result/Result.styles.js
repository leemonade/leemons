import { createStyles } from '@bubbles-ui/components';

const ResultStyles = createStyles((theme) => ({
  teacherActions: {
    marginBottom: 16,
  },
  headerTitleContainer: {
    font: 'inherit',
  },
  headerTitleText: { marginRight: 8 },
  headerTitleIcon: {
    color: theme.colors.text05,
  },
  generalInformation: {
    paddingBlock: 8,
  },
  infoBox: {
    backgroundColor: theme.other.global.background.color.surface.muted,
    paddingInline: 16,
    paddingBlock: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    borderRadius: 4,
    alignItems: 'center',
  },
  infoText: {
    color: theme.colors.text01,
    fontSize: 32,
    fontWeight: 500,
    lineHeight: '24px',
  },
  infoTextLable: {
    ...theme.other.global.content.typo.heading.xsm,
  },
  questionContainer: {
    paddingInline: 20,
  },
  badge: {
    '& > div': {
      border: '1px solid #878D96',
      borderRadius: '4px ',
      backgroundColor: 'transparent ',
      padding: '2px 8px',
      height: '18px',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
  badgeText: {
    color: '#4D5358',
    fontSize: '10px',
    fontWeight: 500,
    lineHeight: '14px',
  },
}));

export default ResultStyles;
