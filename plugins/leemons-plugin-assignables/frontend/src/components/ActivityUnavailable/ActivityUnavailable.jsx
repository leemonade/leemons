import { ContextContainer, Stack, Text, TotalLayoutStepContainer } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { ActivityUnavailableFooter } from './ActivityUnavailableFooter';
import { useActivityStates } from './hooks/useActivityStates';

import prefixPN from '@assignables/helpers/prefixPN';

export function ActivityUnavailable({ instance, clean, singlePage, scrollRef }) {
  const [t] = useTranslateLoader(prefixPN('activityNotStarted'));

  const { isScheduled, isBlocked, sendMail, date, time } = useActivityStates({ instance });

  return (
    <TotalLayoutStepContainer
      Footer={<ActivityUnavailableFooter scrollRef={scrollRef} singlePage={singlePage} />}
      clean={clean}
    >
      <ContextContainer title={t('activityUnavailable')}>
        <Stack spacing={5} direction="column">
          {isScheduled && (
            <Stack spacing={1} direction="column">
              <Text>{t('activityNotStarted', { date, time })}</Text>
              {sendMail && <Text>{t('willSendMail')}</Text>}
            </Stack>
          )}
          {isBlocked && <Text>{t('activityBlocked')}</Text>}
          <Text>{t('checkBackLater')}</Text>
        </Stack>
      </ContextContainer>
    </TotalLayoutStepContainer>
  );
}

ActivityUnavailable.propTypes = {
  instance: PropTypes.object,
  scrollRef: PropTypes.object,
  clean: PropTypes.bool,
  singlePage: PropTypes.bool,
};
