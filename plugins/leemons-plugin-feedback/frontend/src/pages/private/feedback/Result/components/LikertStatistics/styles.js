import { createStyles } from '@bubbles-ui/components';

const LikertStatistics = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.uiBackground04,
    paddingBottom: 24,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  badge: {
    '& > div': {
      border: '1px solid #878D96',
      borderRadius: '4px ',
      backgroundColor: '#F2F4F8',
      padding: '2px 8px',
    },
  },
  badgeText: {
    color: '#4D5358',
    fontSize: '10px',
    fontWeight: 500,
    lineHeight: '14px',
  },
  resultSection: {
    borderRadius: 4,
    padding: 10,
    paddingBottom: 8,
    borderBottom: '1px solid',
  },
  sectionDetractors: {
    backgroundColor: theme.colors.fatic01v0,
    borderBottomColor: theme.colors.fatic01,
  },
  sectionPassives: {
    backgroundColor: theme.colors.fatic03v0,
    borderBottomColor: theme.colors.fatic03,
  },
  sectionPromoters: {
    backgroundColor: theme.colors.fatic02v0,
    borderBottomColor: theme.colors.fatic02,
  },
  npsBar: {
    height: 100,
    backgroundColor: theme.colors.uiBackground02,
    borderRadius: 4,
    textAlign: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginTop: '8px',
  },
  npsBarInside: {
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderRadius: 2,
    zIndex: 0,
  },
}));

export default LikertStatistics;
