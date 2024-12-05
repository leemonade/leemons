import React from 'react';

import { Text, Stack, Box, createStyles, ImageLoader } from '@bubbles-ui/components';
import { filter } from 'lodash';
import PropTypes from 'prop-types';

import { getQuestionClues } from '../helpers/getQuestionClues';

const useNoteClueStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',

    backgroundColor: '#E8F0FC', // It should be theme.other.banner.background.color.info but colors do not match
    borderRadius: theme.other.banner.border.radius,
    gap: 8,
    padding: 16,
  },
}));

function Icon({ src }) {
  return (
    <Box sx={() => ({ position: 'relative', display: 'inline-block', verticalAlign: '' })}>
      <Box sx={() => ({ position: 'relative', width: '24px', height: '24px' })}>
        <ImageLoader height="24px" src={src} />
      </Box>
    </Box>
  );
}

Icon.propTypes = {
  src: PropTypes.string,
};

export default function QuestionNoteClues(props) {
  const { question, store, t } = props;
  const { classes } = useNoteClueStyles();
  const clues = React.useMemo(
    () =>
      filter(
        getQuestionClues(question, store.questionResponses?.[question.id].cluesTypes, store.config),
        {
          type: 'note',
        }
      ),
    [question, store.questionResponses?.[question.id]?.clues, store.config, store.questionResponses]
  );

  if (clues.length) {
    return clues.map((clue, index) => (
      <Box key={`clue-${index}-${question.id}`} className={classes.container}>
        <Stack alignItems="center" spacing={1}>
          <Icon src="/public/tests/responseDetail/hint.svg" />
          <Text sx={{ paddingTop: 2 }} color="primary" strong>
            {t('hint')}
          </Text>
        </Stack>
        <Text>{clue.text}</Text>
      </Box>
    ));
  }
  return null;
}

QuestionNoteClues.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  customStyles: PropTypes.object,
};
