import { Stack, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { ActivityUnavailableLayout } from './ActivityUnavailableLayout';
import { useActivityStates } from './hooks/useActivityStates';

import prefixPN from '@assignables/helpers/prefixPN';

export function ActivityUnavailable({ instance, clean, singlePage, scrollRef }) {
  const [t] = useTranslateLoader(prefixPN('activityNotStarted'));

  const { isScheduled, isBlocked, sendMail, date, time } = useActivityStates({ instance });

  if (isScheduled) {
    return (
      <ActivityUnavailableLayout scrollRef={scrollRef} singlePage={singlePage} clean={clean} t={t}>
        <Stack spacing={1} direction="column">
          <Text>{t('activityNotStarted', { date, time })}</Text>
          {sendMail && <Text>{t('willSendMail')}</Text>}
        </Stack>
      </ActivityUnavailableLayout>
    );
  }

  if (isBlocked) {
    return (
      <ActivityUnavailableLayout scrollRef={scrollRef} singlePage={singlePage} clean={clean} t={t}>
        <Text>{t('activityBlocked')}</Text>
      </ActivityUnavailableLayout>
    );
  }

  return (
    <ActivityUnavailableLayout scrollRef={scrollRef} singlePage={singlePage} clean={clean} t={t} />
  );
}

ActivityUnavailable.propTypes = {
  instance: PropTypes.object,
  user: PropTypes.string,
  scrollRef: PropTypes.object,
  clean: PropTypes.bool,
  singlePage: PropTypes.bool,
};
