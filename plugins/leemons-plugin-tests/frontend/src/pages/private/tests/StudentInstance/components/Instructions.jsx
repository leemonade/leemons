import { InfoIcon, NoPauseIcon } from '@bubbles-ui/icons/solid';
import { AlarmClockIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';
import { getLocaleDuration, LocaleDuration } from '@common';
import React from 'react';
import dayjs from 'dayjs';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  Modal,
  Paragraph,
  Text,
  Stack,
} from '@bubbles-ui/components';
import { useSession } from '@users/session';

export const InstructionsStyles = createStyles((theme) => ({
  instructionsIcon: {
    color: '#878D96',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  instructions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  howItWorksModalContainer: {
    padding: theme.spacing[2],
    paddingTop: theme.spacing[6],
  },
}));

function Instructions({ instance }) {
  const session = useSession();
  const [t] = useTranslateLoader(prefixPN('instructions'));
  const { classes } = InstructionsStyles();
  const [showModal, setShowModal] = React.useState(false);
  const durationSeconds = React.useMemo(() => {
    if (instance?.duration) {
      const [value, unit] = instance.duration.split(' ');
      return dayjs.duration({ [unit]: value }).asSeconds();
    }
    return null;
  }, [instance]);

  return (
    <>
      <ContextContainer
        title={t('instructions')}
        spacing={3}
        titleRightZone={
          <>
            {durationSeconds ? (
              <Button
                variant="link"
                leftIcon={<InfoIcon />}
                rounded
                compact
                onClick={() => setShowModal(true)}
              >
                {t('howItWorks')}
              </Button>
            ) : null}
          </>
        }
      >
        <>
          <Box className={classes.instructionsIcon}>
            <Box>
              <AlarmClockIcon width={18} height={18} />
            </Box>
            <Text>
              {durationSeconds ? (
                <>
                  {t('timeLimit1')}{' '}
                  <b>
                    <LocaleDuration seconds={durationSeconds} />
                  </b>{' '}
                  {t('timeLimit2')}
                </>
              ) : (
                t('noTimeLimit')
              )}
            </Text>
          </Box>
          {durationSeconds ? (
            <Box className={classes.instructionsIcon}>
              <Box>
                <NoPauseIcon width={18} height={18} />
              </Box>
              <Text>
                <b>{t('withoutPause1')}</b> {t('withoutPause2')}
              </Text>
            </Box>
          ) : null}
        </>
      </ContextContainer>
      <Modal title={t('howItWorks')} opened={showModal} onClose={() => setShowModal(false)}>
        <Stack spacing="xl" direction="column">
          <ContextContainer title={t('limitedTime')}>
            <Paragraph
              dangerouslySetInnerHTML={{
                __html: t('limitedTimeDescription', {
                  time: getLocaleDuration({ seconds: durationSeconds }, session),
                }),
              }}
            />
          </ContextContainer>
          <ContextContainer title={t('canNotStop')}>
            <Paragraph
              dangerouslySetInnerHTML={{
                __html: t('canNotStopDescription', {
                  time: getLocaleDuration({ seconds: durationSeconds }, session),
                }),
              }}
            />
          </ContextContainer>
        </Stack>
      </Modal>
    </>
  );
}

Instructions.propTypes = {
  instance: PropTypes.object,
};

export { Instructions };
