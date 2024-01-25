import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ContextContainer, HtmlText, Stack } from '@bubbles-ui/components';
import { PluginComunicaIcon } from '@bubbles-ui/icons/outline';
import ScoreFeedback from '@assignables/widgets/dashboard/nya/components/EvaluationCardStudent/components/ScoreFeedback';
import { useClassesSubjects, useIsTeacher } from '@academic-portfolio/hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { noop } from 'lodash';

function EvaluationFeedback({ assignation, subject, onChatClick = noop }) {
  const [t] = useTranslateLoader(prefixPN('evaluationFeedbackComponent'));
  const { instance } = assignation ?? {};
  const subjects = useClassesSubjects(assignation?.instance?.classes);
  const isTeacher = useIsTeacher();

  const program = useMemo(
    () => subjects?.find((s) => s.id === subject)?.program,
    [subjects, subject]
  );
  const score = useMemo(
    () => assignation?.grades?.find((grade) => grade.type === 'main' && grade.subject === subject),
    [assignation?.grades, subject]
  );

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
          {score?.feedback ? (
            <Box sx={{ overflow: 'auto' }}>
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
        {!!score?.feedback && (
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
};

export default EvaluationFeedback;
