import { createStyles } from '@bubbles-ui/components';

const NSPStatisticsStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.uiBackground04,
    padding: '24px 20px',
    gap: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },

  resultSection: {
    padding: 10,
    paddingBottom: 8,
    borderBottom: '1px solid',
  },
  sectionDetractors: {
    borderBottomColor: theme.colors.fatic01,
  },
  sectionPassives: {
    borderBottomColor: theme.colors.fatic03,
  },
  sectionPromoters: {
    borderBottomColor: theme.colors.fatic02,
  },
  npsBar: {
    height: 170,
    backgroundColor: theme.colors.uiBackground02,
    borderRadius: 4,
    textAlign: 'center',
    paddingTop: theme.spacing[3],
    overflow: 'hidden',
    position: 'relative',
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

export default NSPStatisticsStyles;
