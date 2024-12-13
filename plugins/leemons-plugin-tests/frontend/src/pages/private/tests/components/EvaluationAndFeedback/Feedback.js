import { useState } from 'react';

import useAssignationComunicaRoom from '@assignables/hooks/useAssignationComunicaRoom';
import { Box, Button, Stack, Switch, ContextContainer, HtmlText } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { PluginComunicaIcon, SendMessageIcon } from '@bubbles-ui/icons/outline';
import { useComunica } from '@comunica/context';
import { useLayout } from '@layout/context';
import PropTypes from 'prop-types';

export default function Feedback({ isTeacher, onSaveFeedback, assignation, instance, t }) {
  const [feedback, setFeedback] = useState(assignation.grades?.[0]?.feedback ?? null);
  const [showFeedback, setShowFeedback] = useState(!!assignation.grades?.[0]?.feedback);
  const [tempShowFeedback, setTempShowFeedback] = useState(!!assignation.grades?.[0]?.feedback);
  const { openDeleteConfirmationModal } = useLayout();

  const room = useAssignationComunicaRoom({
    assignation,
    subject: instance?.subjects?.[0]?.subject,
  });
  const { openRoom: openComunicaRoom } = useComunica();

  const onChatClick = () => {
    openComunicaRoom(room);
  };

  const mutateFeedbackFromSwitch = (switchValue) => {
    const feedbackToSave = switchValue ? feedback : null;
    setFeedback(feedbackToSave);
    onSaveFeedback({
      feedback: feedbackToSave,
      hideSuccessAlert: switchValue,
    });
    setShowFeedback(switchValue);
  };

  const handleSwitchChange = (newValue) => {
    if (!newValue) {
      setTempShowFeedback(false);

      openDeleteConfirmationModal({
        onConfirm: () => {
          //  Update the real state after confirmation only and mutate
          setShowFeedback(false);
          mutateFeedbackFromSwitch(false);
        },
        onCancel: () => {
          setTempShowFeedback(true);
        },
      })();
    } else {
      setShowFeedback(true);
      setTempShowFeedback(true);
      mutateFeedbackFromSwitch(true);
    }
  };

  if (isTeacher && !instance.dates.evaluationClosed) {
    return (
      <ContextContainer>
        <Switch
          label={t('feedbackForStudent')}
          onChange={handleSwitchChange}
          checked={tempShowFeedback}
        />
        {showFeedback && (
          <>
            <Box sx={(theme) => ({ paddingLeft: theme.spacing[10] })}>
              <TextEditorInput
                value={feedback}
                editorStyles={{ minHeight: '96px' }}
                onChange={(e) => {
                  setFeedback(e);
                }}
              />
            </Box>
            <Stack justifyContent="end" spacing={2}>
              <Button
                leftIcon={<SendMessageIcon />}
                onClick={() => setTimeout(() => onSaveFeedback({ feedback }), 100)}
                disabled={!feedback}
              >
                {t('saveAndSendFeedback')}
              </Button>
            </Stack>
          </>
        )}
      </ContextContainer>
    );
  }

  return (
    <Stack fullWidth direction="column" spacing={4} alignItems="start" sx={{ padding: 8 }}>
      <Box
        noFlex
        sx={{
          maxHeight: 80,
          overflowY: 'auto',
        }}
      >
        <HtmlText>{feedback}</HtmlText>
      </Box>
      {room && (
        <Button variant="link" leftIcon={<PluginComunicaIcon />} onClick={onChatClick}>
          {isTeacher ? t('contactStudent') : t('contactTeacher')}
        </Button>
      )}
    </Stack>
  );
}

Feedback.propTypes = {
  isTeacher: PropTypes.bool,
  onSaveFeedback: PropTypes.func,
  instance: PropTypes.object,
  t: PropTypes.func,
  assignation: PropTypes.object,
};
