import React, { useState } from 'react';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import { Box, Button, ImageLoader, Modal, Text, Title, createStyles } from '@bubbles-ui/components';
import { getLocaleDuration, LocaleDuration } from '@common';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';

dayjs.extend(dayjsDuration);

const useBeforeStartStyles = createStyles((theme) => ({
  timeLimitContainer: {
    paddingTop: theme.spacing[6],
    width: 500,
    margin: '0px auto',
    paddingBottom: theme.spacing[5],
  },
  timeLimitContent: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[5],
    width: '100%',
    height: 142,
    position: 'relative',
    backgroundImage: 'url(/public/tests/infoBg.jpg)',
    backgroundSize: 'cover',
  },
  timeLimitImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 207,
    height: 184,
  },
  timeLimitInfo: {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: 340,
    transform: 'translateY(-50%)',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'space-around',
  },
  howItWorksModalContainer: {
    padding: theme.spacing[2],
    paddingTop: theme.spacing[6],
  },
}));

export default function LimitedTimeAlert({ assignation, labels, show }) {
  const [value, unit] = assignation?.instance?.duration?.split(' ') || [];
  const durationSeconds = dayjs.duration(value, unit).asSeconds();
  const { classes } = useBeforeStartStyles();

  const [showModal, setShowModal] = useState(false);

  if (!show) {
    return null;
  }
  return (
    <>
      <Box className={classes.timeLimitContainer}>
        <Title order={5}>{labels?.beforeStart}</Title>
        <Box className={classes.timeLimitContent}>
          <Box className={classes.timeLimitInfo}>
            <Box>
              <Box sx={() => ({ position: 'relative', height: '24px', marginBottom: '24px' })}>
                <ImageLoader className="stroke-current" src={'/public/tests/clock.svg'} />
              </Box>
              <Title order={4}>
                {durationSeconds ? (
                  <LocaleDuration seconds={durationSeconds} />
                ) : (
                  labels?.noTimeLimit
                )}
              </Title>
            </Box>
            {durationSeconds ? (
              <Box>
                <Box sx={() => ({ position: 'relative', height: '32px', marginBottom: '16px' })}>
                  <ImageLoader className="stroke-current" src={'/public/tests/pause.svg'} />
                </Box>
                <Title order={4}>{labels?.withoutPause}</Title>
              </Box>
            ) : null}
          </Box>
          <img className={classes.timeLimitImage} src="/public/tests/ninaBrazoLevantado.png" />
          {durationSeconds ? (
            <Box
              sx={() => ({
                position: 'absolute',
                bottom: '0px',
                width: '340px',
                textAlign: 'center',
              })}
            >
              <Button
                position="right"
                variant="link"
                rightIcon={<AlertInformationCircleIcon />}
                rounded
                compact
                onClick={() => setShowModal(true)}
              >
                {labels?.howItWorks}
              </Button>
            </Box>
          ) : null}
        </Box>
      </Box>
      <Modal title={labels?.howItWorks} opened={showModal} onClose={() => setShowModal(false)}>
        <Box className={classes.howItWorksModalContainer}>
          <Title>Este texto no está</Title>
          <Text>Cuando Juanjo tenga el copy, estará</Text>
          {/* <Title order={5} sx={(theme) => ({ marginBottom: theme.spacing[2] })}>
            {t('limitedTime')}
          </Title>
          <Text
            dangerouslySetInnerHTML={{
              __html: t('limitedTimeDescription', {
                time: getLocaleDuration({ seconds: durationSeconds }),
              }),
            }}
          />

          <Title
            order={5}
            sx={(theme) => ({
              marginTop: theme.spacing[6],
              marginBottom: theme.spacing[2],
            })}
          >
            {t('canNotStop')}
          </Title>
          <Text
            dangerouslySetInnerHTML={{
              __html: t('canNotStopDescription', {
                time: getLocaleDuration({ seconds: durationSeconds }),
              }),
            }}
          /> */}
        </Box>
      </Modal>
    </>
  );
}
