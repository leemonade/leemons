import React from 'react';
import PropTypes from 'prop-types';
import { Box, LoadingOverlay, Stack, VerticalStepperContainer } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { PluginAssignmentsIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { useStore } from '@common';
import MailProviders from '@admin/pages/private/Setup/components/MailProviders';
import { Start } from './components/Start';
import { Locales } from './components/Locales';

// Pagina a la que solo tendra acceso el super admin
function Setup({ session }) {
  const [t] = useTranslateLoader(prefixPN('setup'));

  // ····················································
  // SETTINGS

  const [store, render] = useStore({
    loading: false,
    currentStep: 1,
    headerHeight: null,
    steps: 3,
  });

  // ····················································
  // HANDLERS

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  const handleOnNext = () => {
    if (store.currentStep < store.steps - 1) {
      store.currentStep += 1;
    } else {
      //
    }
    render();
  };

  const handleOnPrev = () => {
    if (store.currentStep > 0) {
      store.currentStep -= 1;
      render();
    }
  };

  if (store.loading) return <LoadingOverlay visible />;

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
      <Stack direction="column" fullHeight>
        <AdminPageHeader
          values={{ title: t('title') }}
          buttons={{}}
          icon={<PluginAssignmentsIcon />}
          variant="teacher"
          loading={store.saving}
          onResize={handleOnHeaderResize}
        />

        <Box>
          <VerticalStepperContainer
            currentStep={store.currentStep}
            stickyAt={store.headerHeight}
            data={[
              { label: t('welcome.label'), status: 'OK' },
              { label: t('mails.label'), status: 'OK' },
              { label: t('languages.label'), status: 'OK' },
              { label: 'Step 2', status: 'OK' },
            ]}
          >
            {
              [
                <Start
                  key="s1"
                  onNext={handleOnNext}
                  onNextLabel={t('common.labels.nextButton')}
                />,
                <MailProviders
                  key="s2"
                  onNext={handleOnNext}
                  onNextLabel={t('common.labels.saveAndNextButton')}
                />,
                <Locales
                  key="s3"
                  onNext={handleOnNext}
                  onNextLabel={t('common.labels.saveAndNextButton')}
                />,
              ][store.currentStep]
            }
          </VerticalStepperContainer>
        </Box>
      </Stack>
    </Box>
  );
}

Setup.propTypes = {
  session: PropTypes.object,
};

export default Setup;
