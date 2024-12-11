import { Text, ContextContainer, createStyles } from '@bubbles-ui/components';
import propTypes from 'prop-types';

import OpenResponseRules from './OpenResponseRules';
import ShortResponseRules from './ShortResponseRules';

const useStyles = createStyles((theme) => ({
  questionConfigContainer: {
    paddingInline: 24,
  },
  questionConfigTitle: {
    fontWeight: 500,
  },
  questionConfig: {
    gap: 8,
    paddingInline: 24,
    flexDirection: 'column',
  },
}));

export const RulesByQuestionType = ({ control, t }) => {
  const { classes } = useStyles();

  return (
    <ContextContainer spacing={4}>
      <Text strong>{t('rulesByQuestionType.title')}</Text>
      <ShortResponseRules control={control} classes={classes} t={t} />
      <OpenResponseRules control={control} classes={classes} t={t} />
    </ContextContainer>
  );
};

RulesByQuestionType.propTypes = {
  control: propTypes.object,
  t: propTypes.func,
};

export default RulesByQuestionType;
