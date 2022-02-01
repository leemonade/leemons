import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  ContextContainer,
  Divider,
  ImageLoader,
  PageContainer,
  Paper,
} from '@bubbles-ui/components';

import { useStore } from '@common';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';
import { enableMenuItemRequest, getSettingsRequest, updateSettingsRequest } from '@grades/request';
import hooks from 'leemons-hooks';

// eslint-disable-next-line react/prop-types
function StepCard({ t, step, disabled, to, onClick }) {
  return (
    <Paper>
      <ContextContainer>
        <ImageLoader src="" withPlaceholder height={100} noFlex />
        <ContextContainer title={t(`${step}.title`)} description={t(`${step}.description`)}>
          <Box noFlex>
            <Button as={Link} to={to} fullWidth onClick={onClick} disabled={disabled}>
              {t(`${step}.btn`)}
            </Button>
          </Box>
        </ContextContainer>
      </ContextContainer>
    </Paper>
  );
}

export default function WelcomePage() {
  const [t] = useTranslateLoader(prefixPN('welcome_page'));

  const [store, render] = useStore();

  // ----------------------------------------------------------------------
  // SETTINGS

  async function updateSettings(data) {
    store.settings = data;
    render();
    await updateSettingsRequest(data);
  }

  // ·····················································································
  // INIT DATA LOAD

  async function init() {
    const [settingsResponse] = await Promise.all([getSettingsRequest]);

    // haveGradesRequest
    store.settings = settingsResponse.settings;
    render();
  }

  useEffect(() => {
    init();
  }, []);

  // ----------------------------------------------------------------------
  // UI CONTROLS

  async function handleOnHideHelp() {
    const newSettings = { ...store.settings, hideWelcome: !store.settings?.hideWelcome };
    await updateSettings(newSettings);
  }

  async function handleOnEvaluations() {
    const itemKey = 'evaluations';
    await enableMenuItemRequest(itemKey);
    await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
  }

  async function handleOnPromotions() {
    const itemKey = 'promotions';
    await enableMenuItemRequest(itemKey);
    await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
  }

  // ----------------------------------------------------------------------
  // STATIC LABELS

  const headerValues = useMemo(
    () => ({
      title: t('page_title'),
      description: t('page_description'),
    }),
    [t]
  );

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={headerValues} />
      <PageContainer noFlex>
        <Divider />
      </PageContainer>
      <PageContainer noFlex>
        <Checkbox
          label={t('hide_info_label')}
          onChange={handleOnHideHelp}
          checked={store.settings?.hideWelcome === 1}
          value={store.settings?.hideWelcome === 1}
        />
      </PageContainer>

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer direction="row" fullWidth padded="vertical">
            <StepCard
              t={t}
              step="step_evaluations"
              to="/private/grades/evaluations"
              onClick={handleOnEvaluations}
            />
            <StepCard
              t={t}
              step="step_promotions"
              to="/private/grades/promotions"
              onClick={handleOnPromotions}
              disabled
            />
            <StepCard
              t={t}
              step="step_dependencies"
              to="/private/academic-portfolio/dependencies"
              disabled
            />
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
