import prefixPN from '@admin/helpers/prefixPN';
import Admins from '@admin/pages/private/Setup/components/Admins';
import Centers from '@admin/pages/private/Setup/components/Centers';
import Finish from '@admin/pages/private/Setup/components/Finish';
import MailProviders from '@admin/pages/private/Setup/components/MailProviders';
import Organization from '@admin/pages/private/Setup/components/Organization';
import Profiles from '@admin/pages/private/Setup/components/Profiles';
import { getSettingsRequest } from '@admin/request/settings';
import { Box, LoadingOverlay, Stack, VerticalStepperContainer } from '@bubbles-ui/components';
import { PluginAssignmentsIcon } from '@bubbles-ui/icons/solid';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import loadable from '@loadable/component';
import { getLocalizations } from '@multilanguage/useTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getZoneRequest } from '@widgets';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { Locales } from './components/Locales';
import { Start } from './components/Start';

function dynamicImport(pluginName, component) {
  return loadable(() => import(`@leemons/plugins/${pluginName}/src/widgets/${component}.js`));
}

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
      const [{ zone }, { settings }] = await Promise.all([
        getZoneRequest('plugins.admin.admin-page'),
        getSettingsRequest(),
      ]);
      const keys = [];
      _.forEach(zone.widgetItems, (item) => {
        if (item.properties?.card?.title) {
          keys.push(item.properties.card.title);
        }
        if (item.properties?.card?.description) {
          keys.push(item.properties.card.description);
        }
      });
      const { items } = await getLocalizations({ keys });

      store.zoneTranslations = items;
      store.zone = zone;
      store.configured = settings.configured;
      if (store.configured) {
        store.steps = 6 + store.zone.widgetItems.length;
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

  const steppers = React.useMemo(() => {
    const steps = [
      { label: t('welcome.label'), status: 'OK' },
      { label: t('organization.label'), status: 'OK' },
      { label: t('mails.label'), status: 'OK' },
      { label: t('languages.label'), status: 'OK' },
      { label: t('centers.label'), status: 'OK' },
      { label: t('profiles.label'), status: 'OK' },
      { label: t('admins.label'), status: 'OK' },
    ];

    _.forEach(store.zone?.widgetItems, (item) => {
      steps.push({ label: store.zoneTranslations[item.properties?.card?.title], status: 'OK' });
    });

    if (!store.configured) {
      steps.push({ label: t('finish.label'), status: 'OK' });
    }
    return steps;
  }, [store.zone, store.configured]);

  const handleOnNext = () => {
    if (store.currentStep <= steppers.length - 1) {
      store.currentStep += 1;
    } else {
      store.currentStep = 0;
    }
    render();
  };

  const steppersDom = React.useMemo(() => {
    const stepsDom = [
      <Start
        key="s1"
        onNext={handleOnNext}
        zone={store.zone}
        zoneTranslations={store.zoneTranslations}
        onNextLabel={t('common.labels.nextButton')}
      />,
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
      <Profiles
        key="s6"
        onNext={handleOnNext}
        onNextLabel={t('common.labels.saveAndNextButton')}
      />,
      <Admins key="s7" onNext={handleOnNext} onNextLabel={t('common.labels.saveAndNextButton')} />,
    ];

    _.forEach(store.zone?.widgetItems, (item) => {
      const Component = dynamicImport(item.pluginName, item.url);
      stepsDom.push(
        <Component
          key={item.id}
          configured={store.configured}
          onNext={handleOnNext}
          onNextLabel={t('common.labels.saveAndNextButton')}
        />
      );
    });

    if (!store.configured) {
      stepsDom.push(<Finish key={`s${stepsDom.length}${1}`} />);
    }

    return stepsDom;
  }, [store.zone, store.configured]);

  const stepperProps = React.useMemo(() => {
    if (!store.configured) {
      return {};
    }

    return {
      completedSteps: [...Array(store.steps + 1).keys()],
      visitedSteps: [...Array(store.steps + 1).keys()],
    };
  }, [store.configured]);

  if (store.loading) {
    return <LoadingOverlay visible />;
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
