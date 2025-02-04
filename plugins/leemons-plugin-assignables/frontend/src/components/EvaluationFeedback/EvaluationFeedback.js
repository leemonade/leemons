import { useIsTeacher } from '@academic-portfolio/hooks';
import { Box, Button, ContextContainer, HtmlText, Stack } from '@bubbles-ui/components';
import { PluginComunicaIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { noop } from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '@assignables/helpers/prefixPN';
import ScoreFeedback from '@assignables/widgets/dashboard/nya/components/EvaluationCardStudent/components/ScoreFeedback';
import { useScoreFeedbackData } from '@assignables/widgets/dashboard/nya/hooks';

function EvaluationFeedback({ assignation, subject, onChatClick = noop, hideChat }) {
  const [t] = useTranslateLoader(prefixPN('evaluationFeedbackComponent'));
  const isTeacher = useIsTeacher();
  const { program, score, instance } = useScoreFeedbackData({ assignation, subject });

  let componentToReturn = null;

  if (instance?.requiresScoring) {
    componentToReturn = (
      <Stack spacing={4} direction="column" alignItems="end">
        <Stack spacing={4} sx={{ height: 250, width: '100%' }}>
          <Box sx={{ width: 160, minWidth: 160 }}>
            <ScoreFeedback
              instance={instance}
              program={program}
              score={score?.grade}
              isFeedback={false}
              hideBadge
              fullSize
            />
          </Box>
          {score?.feedback || hideChat ? (
            <Box sx={{ overflow: 'auto', width: '100%' }}>
              <HtmlText>{score?.feedback}</HtmlText>
            </Box>
          ) : (
            <Button
              variant="link"
              leftIcon={<PluginComunicaIcon />}
              sx={{ alignSelf: 'end' }}
              onClick={onChatClick}
            >
              {t(isTeacher ? 'contactStudent' : 'contactTeacher')}
            </Button>
          )}
        </Stack>
      </Stack>
    );
  } else if (instance?.allowFeedback) {
    componentToReturn = (
      <Stack sx={{ overflow: 'auto', maxHeight: 250 }}>
        <HtmlText>{score?.feedback}</HtmlText>
      </Stack>
    );
  }

  return (
    <Box>
      <ContextContainer title={t('feedback')}>
        {componentToReturn}
        {!!score?.feedback && !hideChat && (
          <Box>
            <Stack fullWidth justifyContent="end">
              <Button variant="link" leftIcon={<PluginComunicaIcon />} onClick={onChatClick}>
                {t(isTeacher ? 'contactStudent' : 'contactTeacher')}
              </Button>
            </Stack>
          </Box>
        )}
      </ContextContainer>
    </Box>
  );
}

EvaluationFeedback.propTypes = {
  assignation: PropTypes.shape({
    instance: PropTypes.shape({
      id: PropTypes.string.isRequired,
      classes: PropTypes.arrayOf(PropTypes.string),
    }),
    grades: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  onChatClick: PropTypes.func,
  subject: PropTypes.any,
  hideChat: PropTypes.bool,
};

export default EvaluationFeedback;
