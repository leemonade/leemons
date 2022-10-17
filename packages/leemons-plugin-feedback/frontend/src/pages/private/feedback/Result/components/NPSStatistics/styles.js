import { createStyles } from '@bubbles-ui/components';

const NSPStatisticsStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.uiBackground04,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing[2]}px ${theme.spacing[5]}px`,
    borderBottom: `1px solid ${theme.colors.ui02}`,
  },
  content: {
    padding: `${theme.spacing[5]}px ${theme.spacing[8]}px`,
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
