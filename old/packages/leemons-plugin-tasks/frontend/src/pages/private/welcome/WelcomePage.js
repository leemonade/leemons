import React, { useEffect, useMemo } from 'react';
import {
  Paper,
  Divider,
  Checkbox,
  PageContainer,
  ContextContainer,
  Grid,
  Col,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useStore, useRequestErrorMessage } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import hooks from 'leemons-hooks';
import { prefixPN } from '../../../helpers';
import { getSettingsRequest, updateSettingsRequest, enableMenuItemRequest } from '../../../request';
import { WelcomeStepCard } from './components';

export default function WelcomePage() {
  const [t] = useTranslateLoader(prefixPN('welcome_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore({});

  // ·······························································
  // SETTINGS

  const updateSettings = async (data) => {
    try {
      store.settings = data;
      await updateSettingsRequest(data);
      addSuccessAlert(t('settings_updated'));
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const loadSettings = async () => {
    try {
      const response = await getSettingsRequest();
      store.settings = response.settings;
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  // ·······························································
  // INIT DATA LOAD

  useEffect(() => {
    loadSettings();
  }, []);

  // ·······························································
  // HANDLERS

  const handleOnHideHelp = () => {
    const newSettings = { ...store.settings, hideWelcome: !store.settings?.hideWelcome };
    updateSettings(newSettings);
  };

  const handleOnSelectProfiles = async () => {
    try {
      // EN: Enable the menu item
      // ES: Habilitar el item del menú
      await enableMenuItemRequest('profiles');
      await hooks.fireEvent('menu-build:user:updateItem', 'profiles');
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const handleOnCreateTask = async () => {
    try {
      // Let's enable Library menu item
      const itemKey = 'library';
      await enableMenuItemRequest(itemKey);
      await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  // ·······························································
  // STATIC LABELS

  const headerValues = useMemo(
    () => ({
      title: t('page_title'),
      description: t('page_description'),
    }),
    [t]
  );

  // ---------------------------------------------------------------
  // COMPONENT

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
          <ContextContainer padded="vertical">
            <Grid>
              <Col span={3}>
                <WelcomeStepCard
                  t={t}
                  step="step_profiles"
                  to="/private/tasks/profiles"
                  onClick={handleOnSelectProfiles}
                />
              </Col>
              <Col span={3}>
                <WelcomeStepCard
                  t={t}
                  step="step_library"
                  to="/private/tasks/library/create"
                  onClick={handleOnCreateTask}
                />
              </Col>
              <Col span={3}>
                <WelcomeStepCard t={t} step="step_ongoing" to="/private/tasks/ongoing" disabled />
              </Col>
              <Col span={3}>
                <WelcomeStepCard t={t} step="step_history" to="/private/tasks/history" disabled />
              </Col>
            </Grid>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
