import { ContextContainer, Stack, Text, TotalLayoutStepContainer } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { ActivityUnavailableFooter } from './ActivityUnavailableFooter';

export function ActivityUnavailableLayout({ children, scrollRef, singlePage, clean, t }) {
  return (
    <TotalLayoutStepContainer
      Footer={<ActivityUnavailableFooter scrollRef={scrollRef} singlePage={singlePage} />}
      clean={clean}
    >
      <ContextContainer title={t('activityUnavailable')}>
        <Stack spacing={5} direction="column">
          {children}
          <Text>{t('checkBackLater')}</Text>
        </Stack>
      </ContextContainer>
    </TotalLayoutStepContainer>
  );
}

ActivityUnavailableLayout.propTypes = {
  children: PropTypes.node.isRequired,
  scrollRef: PropTypes.object,
  singlePage: PropTypes.bool,
  clean: PropTypes.bool,
  t: PropTypes.func.isRequired,
};
