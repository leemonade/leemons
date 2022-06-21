import React from 'react';
import PropTypes from 'prop-types';
import { Box, LoadingOverlay, Stack, VerticalStepperContainer } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { PluginAssignmentsIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { useStore } from '@common';
import { Summary } from './components/Summary';
import { Locales } from './components/Locales';

// Pagina a la que solo tendra acceso el super admin
function Setup({ session }) {
  const [t] = useTranslateLoader(prefixPN('setup'));

  // ····················································
  // SETTINGS

  const [store, render] = useStore({
    loading: false,
    currentStep: 0,
    headerHeight: null,
    steps: [
      { label: 'Welcome', status: 'OK' },
      { label: 'Languages', status: 'OK' },
      { label: 'Step 2', status: 'OK' },
    ],
  });

  // ····················································
  // HANDLERS

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  const handleOnNext = () => {
    if (store.currentStep < store.steps.length - 1) {
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
            data={store.steps}
          >
            {
              [
                <Summary key="s1" onNext={handleOnNext} />,
                <Locales key="s2" onNext={handleOnNext} />,
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
