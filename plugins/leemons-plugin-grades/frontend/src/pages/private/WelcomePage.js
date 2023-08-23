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
import { getSettingsRequest, updateSettingsRequest } from '@grades/request';
import { haveGradesRequest, havePromotionsRequest } from '../../request';
import { activeMenuItemPromotions } from '../../helpers/activeMenuItemPromotions';
import { activeMenuItemEvaluations } from '../../helpers/activeMenuItemEvaluations';
import { activeMenuItemDependencies } from '../../helpers/activeMenuItemDependencies';

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
    const [settingsResponse, haveGradesResponse, havePromotionsResponse] = await Promise.all([
      getSettingsRequest(),
      haveGradesRequest(),
      havePromotionsRequest(),
    ]);

    store.havePromotions = havePromotionsResponse.have;
    store.haveGrades = haveGradesResponse.have;
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
    await activeMenuItemEvaluations();
  }

  async function handleOnPromotions() {
    await activeMenuItemPromotions();
  }

  async function handleOnDependencies() {
    await activeMenuItemDependencies();
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
              disabled={!store.haveGrades}
            />
            <StepCard
              t={t}
              step="step_dependencies"
              to="/private/grades/dependencies"
              onClick={handleOnDependencies}
              disabled={!store.havePromotions}
            />
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
