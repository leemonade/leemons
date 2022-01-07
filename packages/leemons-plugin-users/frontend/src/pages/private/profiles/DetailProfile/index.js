import React, { useEffect, useMemo, useState } from 'react';
import { forIn } from 'lodash';
import useTranslate from '@multilanguage/useTranslate';
import { addProfileRequest, getProfileRequest, updateProfileRequest } from '@users/request';
import { goDetailProfilePage, goListProfilesPage } from '@users/navigate';
import {
  AdminPageHeader,
  PageContainer,
  ContextContainer,
  Divider,
  Stack,
  Box,
  Paper,
  Tabs,
  Tab,
} from '@bubbles-ui/components';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@users/helpers/prefixPN';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import PlatformLocales from '@multilanguage/components/PlatformLocales';
import PlatformLocalesModal from '@multilanguage/components/PlatformLocalesModal';
import hooks from 'leemons-hooks';
// import MainMenuDropItem from '@menu-builder/components/mainMenu/mainMenuDropItem';
import { useParams, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DatasetTab } from './DatasetTab';
import { PermissionsTab } from './PermissionsTab';
import { LocaleTab } from './LocaleTab';

function ProfileDetail() {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('detail_profile') });
  const t = tLoader(prefixPN('detail_profile'), translations);
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const { t: tCommonForm } = useCommonTranslate('forms');

  const history = useHistory();
  const { uri } = useParams();

  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const localesForm = useForm();

  useEffect(() => {
    if (!uri) {
      setIsEditMode(true);
    }
  }, []);

  async function saveProfile(data) {
    try {
      setSaveLoading(true);
      let response;

      if (profile && profile.id) {
        response = await updateProfileRequest({
          ...data,
          id: profile.id,
        });
        addSuccessAlert(t('update_done'));
      } else {
        response = await addProfileRequest(data);
        addSuccessAlert(t('save_done'));
      }
      await hooks.fireEvent('user:update:permissions', profile);
      setSaveLoading(false);
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
      setIsEditMode(false);
    } else {
      setLoading(false);
    }
  }, [uri]);

  const onSubmit = (data) => {
    saveProfile({ ...data, permissions });
  };

  const handleLocalesOnSave = (data) => {
    console.log('handleLocalesOnSave:', data);
  };

  const handleOnEdit = () => {
    setIsEditMode(true);
  };

  const handleOnCancel = () => {
    if (profile?.id) {
      setIsEditMode(false);
    } else {
      goListProfilesPage(history);
    }
  };

  const showDefaultLocaleWarning = useMemo(() => !profile?.name, [profile]);

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
      save: isEditMode ? tCommonHeader('save') : null,
      cancel: isEditMode ? tCommonHeader('cancel') : null,
      edit: !isEditMode ? tCommonHeader('edit') : null,
    }),
    [tCommonHeader]
  );

  return (
    <>
      {!error && !loading ? (
        <ContextContainer fullHeight>
          <AdminPageHeader
            values={headerValues}
            labels={headerLabels}
            placeholders={headerPlaceholders}
            buttons={headerButtons}
            editMode={isEditMode}
            onCancel={handleOnCancel}
            onEdit={handleOnEdit}
          />
          <PageContainer>
            <Divider />
          </PageContainer>
          <PageContainer>
            <PlatformLocalesModal
              hasError={localesForm.formState.errors && localesForm.formState.errors.length}
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
                  isEditMode={isEditMode}
                />
              </PlatformLocales>
            </PlatformLocalesModal>
          </PageContainer>
          <Box style={{ flex: 1 }}>
            <Tabs usePageLayout={true} panelColor="solid" fullHeight>
              <Tab label={t('permissions')}>
                <Paper padding={5} mt={20} mb={20}>
                  <PermissionsTab
                    t={t}
                    profile={profile}
                    onPermissionsChange={setPermissions}
                    isEditMode={isEditMode}
                  />
                </Paper>
              </Tab>
              <Tab label={t('dataset')}>
                <Paper padding={5} mt={20} mb={20}>
                  <DatasetTab t={t} profile={profile} isEditMode={isEditMode} />
                </Paper>
              </Tab>
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
