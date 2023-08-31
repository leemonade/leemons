import {
  Alert,
  Box,
  ContextContainer,
  Divider,
  PageContainer,
  Paper,
  TabPanel,
  Tabs,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import PlatformLocales from '@multilanguage/components/PlatformLocales';
import PlatformLocalesModal from '@multilanguage/components/PlatformLocalesModal';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@users/helpers/prefixPN';
import { goDetailProfilePage, goListProfilesPage } from '@users/navigate';
import { addProfileRequest, getProfileRequest, updateProfileRequest } from '@users/request';
import hooks from 'leemons-hooks';
import { forIn } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

// import MainMenuDropItem from '@menu-builder/components/mainMenu/mainMenuDropItem';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { DatasetTab } from './DatasetTab';
import { LocaleTab } from './LocaleTab';
import { PermissionsTab } from './PermissionsTab';

function ProfileDetail() {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('detail_profile') });
  const t = tLoader(prefixPN('detail_profile'), translations);
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const { t: tCommonForm } = useCommonTranslate('forms');

  const history = useHistory();
  const { uri } = useParams();

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const localesForm = useForm();

  useEffect(() => {
    if (!uri) {
      setEditMode(true);
    }
  }, []);

  async function saveProfile({ name, description }) {
    try {
      setSaveLoading(true);
      let response;

      if (profile && profile.id) {
        const body = {
          name,
          description,
          id: profile.id,
          translations: profile.translations,
          permissions,
        };
        response = await updateProfileRequest(body);
        addSuccessAlert(t('update_done'));
      } else {
        response = await addProfileRequest({ ...profile, name, description, permissions });
        addSuccessAlert(t('save_done'));
      }
      await hooks.fireEvent('user:update:permissions', profile);
      setSaveLoading(false);
      setEditMode(false);
      goDetailProfilePage(history, response.profile.uri);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      setSaveLoading(false);
    }
  }

  async function getProfile(_uri) {
    try {
      setLoading(true);
      const response = await getProfileRequest(_uri);
      const perms = [];
      forIn(response.profile.permissions, (actionNames, permissionName) => {
        perms.push({ actionNames, permissionName });
      });

      setPermissions(perms);
      setProfile(response.profile);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (uri) {
      getProfile(uri);
      setEditMode(false);
    } else {
      setLoading(false);
    }
  }, [uri]);

  // ····················································································
  // HANDLERS

  const handleOnSave = (data) => {
    saveProfile({ name: data.title, description: data.description });
  };

  const handleLocalesOnSave = (data) => {
    setProfile({
      ...profile,
      name: data.name,
      description: data.description,
      translations: data.translations,
    });
  };

  const handleOnEdit = () => {
    setEditMode(true);
  };

  const handleOnCancel = () => {
    if (profile?.id) {
      setEditMode(false);
    } else {
      goListProfilesPage(history);
    }
  };

  /*
  const Name = () => (
    <MainMenuDropItem item={{ key: `profile.${profile?.id}` }}>
      {({ isDragging, canDrag }) => (
        <div className={`relative ${canDrag ? 'pl-5 hover:text-primary cursor-move' : ''}`}>
          {canDrag ? (
            <div
              className={`absolute left-0 top-2/4 transform -translate-y-1/2 ${
                isDragging ? 'text-primary' : ''
              }`}
              style={{ width: '14px', height: '8px' }}
            >
              <ImageLoader className="stroke-current" src={'/public/assets/svgs/re-order.svg'} />
            </div>
          ) : null}
          <span className="text-secondary">{watch('name')}</span>
        </div>
      )}
    </MainMenuDropItem>
  );
  */

  // ····················································································
  // LITERALS

  const headerValues = useMemo(
    () => ({
      title: profile?.name || '',
      description: profile?.description || '',
    }),
    [profile]
  );

  const headerPlaceholders = useMemo(
    () => ({
      title: t('profile_name'),
      description: t('description'),
    }),
    [t]
  );

  const headerLabels = useMemo(
    () => ({
      title: t('profile_name'),
      description: t('description'),
    }),
    [t]
  );

  const headerButtons = useMemo(
    () => ({
      save: editMode ? tCommonHeader('save') : null,
      cancel: editMode ? tCommonHeader('cancel') : null,
      edit: !editMode ? tCommonHeader('edit') : null,
    }),
    [tCommonHeader]
  );

  const showDefaultLocaleWarning = useMemo(() => !profile?.name, [profile]);

  return (
    <>
      {!error && !loading ? (
        <ContextContainer fullHeight>
          <AdminPageHeader
            values={headerValues}
            labels={headerLabels}
            placeholders={headerPlaceholders}
            buttons={headerButtons}
            editMode={editMode}
            onCancel={handleOnCancel}
            onEdit={handleOnEdit}
            onSave={handleOnSave}
            loading={saveLoading && 'save'}
          />

          <PageContainer noFlex>
            <Divider />
          </PageContainer>

          <PageContainer noFlex>
            <PlatformLocalesModal
              editMode={editMode}
              error={localesForm.formState.errors && localesForm.formState.errors.length}
              warning={showDefaultLocaleWarning}
              alert={
                localesForm.formState.isDirty ? (
                  <Alert severity="warning" closeable={false}>
                    {t('translations_warning')}
                  </Alert>
                ) : null
              }
              onBeforeSave={localesForm.trigger}
              onSave={() => localesForm.handleSubmit(handleLocalesOnSave)()}
              closeOnSave
            >
              <PlatformLocales
                showWarning={showDefaultLocaleWarning}
                warningIsError={localesForm.formState.isSubmitted}
              >
                <LocaleTab
                  t={t}
                  form={localesForm}
                  tCommonForm={tCommonForm}
                  profile={profile}
                  isEditMode={editMode}
                />
              </PlatformLocales>
            </PlatformLocalesModal>
          </PageContainer>
          <Box style={{ flex: 1 }}>
            <Tabs usePageLayout={true} panelColor="solid" fullHeight>
              <TabPanel label={t('permissions')}>
                <Paper padding={2} mt={20} mb={20} fullWidth>
                  <PermissionsTab
                    t={t}
                    profile={profile}
                    onPermissionsChange={setPermissions}
                    isEditMode={editMode}
                  />
                </Paper>
              </TabPanel>
              <TabPanel disabled label={t('dataset')}>
                <Paper padding={2} mt={20} mb={20} fullWidth>
                  <DatasetTab t={t} profile={profile} isEditMode={editMode} />
                </Paper>
              </TabPanel>
            </Tabs>
          </Box>
        </ContextContainer>
      ) : (
        <ErrorAlert />
      )}
    </>
  );
}

export default ProfileDetail;
