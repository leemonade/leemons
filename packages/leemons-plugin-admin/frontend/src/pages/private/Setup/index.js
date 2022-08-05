import React from 'react';
import PropTypes from 'prop-types';
import { Box, LoadingOverlay, Stack, VerticalStepperContainer } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { PluginAssignmentsIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { useStore } from '@common';
import MailProviders from '@admin/pages/private/Setup/components/MailProviders';
import Centers from '@admin/pages/private/Setup/components/Centers';
import Admins from '@admin/pages/private/Setup/components/Admins';
import Profiles from '@admin/pages/private/Setup/components/Profiles';
import Organization from '@admin/pages/private/Setup/components/Organization';
import Finish from '@admin/pages/private/Setup/components/Finish';
import { getSettingsRequest } from '@admin/request/settings';
import { Start } from './components/Start';
import { Locales } from './components/Locales';

// Pagina a la que solo tendra acceso el super admin
function Setup({ session }) {
  const [t] = useTranslateLoader(prefixPN('setup'));

  // ····················································
  // SETTINGS

  const [store, render] = useStore({
    loading: true,
    currentStep: 0,
    headerHeight: null,
    steps: 7,
  });

  // ····················································
  // HANDLERS

  async function load() {
    try {
      store.loading = true;
      render();
      const { settings } = await getSettingsRequest();
      store.configured = !!settings.configured;
      if (store.configured) {
        store.steps = 6;
      }
      render();
    } catch (e) {
      // Error
    }
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  const handleOnNext = () => {
    if (store.currentStep <= store.steps - 1) {
      store.currentStep += 1;
    } else {
      store.currentStep = 0;
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

  const steppers = [
    { label: t('welcome.label'), status: 'OK' },
    { label: t('organization.label'), status: 'OK' },
    { label: t('mails.label'), status: 'OK' },
    { label: t('languages.label'), status: 'OK' },
    { label: t('centers.label'), status: 'OK' },
    { label: t('profiles.label'), status: 'OK' },
    { label: t('admins.label'), status: 'OK' },
  ];

  const steppersDom = [
    <Start key="s1" onNext={handleOnNext} onNextLabel={t('common.labels.nextButton')} />,
    <Organization
      key="s2"
      onNext={handleOnNext}
      onNextLabel={t('common.labels.saveAndNextButton')}
    />,
    <MailProviders
      key="s3"
      onNext={handleOnNext}
      onNextLabel={t('common.labels.saveAndNextButton')}
    />,
    <Locales
      key="s4"
      configured={store.configured}
      onNext={handleOnNext}
      onNextLabel={t('common.labels.saveAndNextButton')}
    />,
    <Centers key="s5" onNext={handleOnNext} onNextLabel={t('common.labels.saveAndNextButton')} />,
    <Profiles key="s6" onNext={handleOnNext} onNextLabel={t('common.labels.saveAndNextButton')} />,
    <Admins key="s7" onNext={handleOnNext} onNextLabel={t('common.labels.saveAndNextButton')} />,
  ];

  const stepperProps = {};

  if (!store.configured) {
    steppers.push({ label: t('finish.label'), status: 'OK' });
    steppersDom.push(<Finish key="s8" />);
  } else {
    stepperProps.completedSteps = [...Array(store.steps + 1).keys()];
    stepperProps.visitedSteps = [...Array(store.steps + 1).keys()];
  }

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
            {...stepperProps}
            currentStep={store.currentStep}
            stickyAt={store.headerHeight}
            data={steppers}
            onChangeActiveIndex={(e) => {
              store.currentStep = e;
              render();
            }}
          >
            {steppersDom[store.currentStep]}
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
