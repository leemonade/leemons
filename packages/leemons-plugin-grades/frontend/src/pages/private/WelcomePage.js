import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper,
  Divider,
  Box,
  ImageLoader,
  Button,
  Checkbox,
  PageContainer,
  ContextContainer,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';
import { useAsync } from '@common/useAsync';
import { getSettingsRequest, updateSettingsRequest, enableMenuItemRequest } from '@grades/request';
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

  // ----------------------------------------------------------------------
  // SETTINGS

  const [settings, setSettings] = useState({});

  const updateSettings = async (data) => {
    setSettings(data);
    await updateSettingsRequest(data);
  };

  // ·····················································································
  // INIT DATA LOAD

  const initDataLoad = useCallback(async () => {
    const settingsResponse = await getSettingsRequest();

    return {
      settings: settingsResponse.settings,
    };
  }, []);

  const onDataLoadSuccess = useCallback(({ settings: _settings }) => {
    setSettings(_settings);
  }, []);
  const onDataLoadError = useCallback(() => {}, []);

  useAsync(initDataLoad, onDataLoadSuccess, onDataLoadError);

  // ----------------------------------------------------------------------
  // UI CONTROLS

  const handleOnHideHelp = () => {
    const newSettings = { ...settings, hideWelcome: !settings?.hideWelcome };
    updateSettings(newSettings);
  };

  const handleOnEvaluations = async () => {
    // Let's enable Programs menu item
    const itemKey = 'evaluations';
    await enableMenuItemRequest(itemKey);
    await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
  };

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
          checked={settings?.hideWelcome === 1}
          value={settings?.hideWelcome === 1}
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
              to="/private/academic-portfolio/promotions"
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
