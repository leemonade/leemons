import React from 'react';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  createStyles,
  Drawer,
  InputWrapper,
  Loader,
  Paper,
  Stack,
  TabPanel,
  Tabs,
  Textarea,
  TextInput,
} from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import usersPrefixPN from '@users/helpers/prefixPN';
import { useStore } from '@common';
import { Controller, useForm } from 'react-hook-form';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { PermissionsTab } from '@users/pages/private/profiles/DetailProfile/PermissionsTab';
import { addProfileRequest, getProfileRequest, updateProfileRequest } from '@users/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import PlatformLocalesModal from '@multilanguage/components/PlatformLocalesModal';
import PlatformLocales from '@multilanguage/components/PlatformLocales';
import { LocaleTab } from '@users/pages/private/profiles/DetailProfile/LocaleTab';
import { DatasetTab } from '@users/pages/private/profiles/DetailProfile/DatasetTab';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

const Styles = createStyles((theme) => ({
  inputContent: {
    '>div': {
      '&:first-child': {
        width: '35%',
      },
      '&:last-child': {
        width: '65%',
      },
    },
  },
}));

const AddProfileDrawer = ({ opened, onClose, onSave, profile: _profile = {} }) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('addProfileDrawer'));
  const [tU] = useTranslateLoader(usersPrefixPN('detail_profile'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const { t: tCommonForm } = useCommonTranslate('forms');
  const { classes: styles } = Styles();
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const localesForm = useForm();
  const [store, render] = useStore({
    editMode: true,
  });

  const profile = watch();

  async function load() {
    try {
      store.loading = true;
      render();
      const response = await getProfileRequest(_profile.uri);
      store.profile = response.profile;
      reset(response.profile);
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  function handleLocalesOnSave(data) {
    setValue('name', data.name);
    setValue('description', data.description);
    setValue('translations', data.translations);
  }

  function r(n) {
    return { required: t(n) };
  }

  function saveProfile() {
    handleSubmit(async (data) => {
      try {
        store.saving = true;
        render();
        let response;

        const body = {
          name: data.name,
          description: data.description,
          translations: data.translations,
          permissions: data.permissions,
        };

        if (store.profile?.id) {
          response = await updateProfileRequest({ ...body, id: store.profile.id });
          addSuccessAlert(t('update_done'));
        } else {
          response = await addProfileRequest(body);
          addSuccessAlert(t('save_done'));
        }
        onSave(response);
      } catch (e) {
        addErrorAlert(getErrorMessage(e));
      }
      store.saving = false;
      render();
    })();
  }

  React.useEffect(() => {
    reset({});
    localesForm.reset({});
    // console.log('reseteamos', _profile);
    store.profile = null;
    if (_profile?.id) load();
  }, [JSON.stringify(_profile)]);

  const showDefaultLocaleWarning = !profile?.name;

  return (
    <Drawer size={715} opened={opened} onClose={onClose}>
      {store.loading ? (
        <Loader />
      ) : (
        <ContextContainer title={store.profile?.id ? t('editProfile') : t('newProfile')}>
          {/* -- Name -- */}
          <Stack fullWidth className={styles.inputContent} alignItems="center">
            <InputWrapper label={`${t('name')}*`} />
            <Controller
              name="name"
              control={control}
              rules={r('nameRequired')}
              render={({ field }) => <TextInput error={errors.name} {...field} />}
            />
          </Stack>
          {/* -- Description -- */}
          <Stack fullWidth className={styles.inputContent}>
            <InputWrapper label={`${t('description')}*`} />
            <Controller
              name="description"
              control={control}
              rules={r('descriptionRequired')}
              render={({ field }) => <Textarea error={errors.description} {...field} />}
            />
          </Stack>

          <PlatformLocalesModal
            editMode={store.editMode}
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
                isEditMode={store.editMode}
              />
            </PlatformLocales>
          </PlatformLocalesModal>
          <Box style={{ flex: 1 }}>
            <Tabs usePageLayout={false} panelColor="solid" fullHeight>
              <TabPanel label={t('permissions')}>
                <Paper ml={12} mr={12} mt={20} mb={20} fullWidth>
                  <PermissionsTab
                    t={tU}
                    profile={store.profile}
                    onPermissionsChange={(data) => {
                      setValue('permissions', data);
                    }}
                    embedded={true}
                    isEditMode={store.editMode}
                  />
                </Paper>
              </TabPanel>
              <TabPanel disabled={!store.profile?.id} label={t('dataset')}>
                <Paper ml={12} mr={12} mt={20} mb={20} fullWidth>
                  <DatasetTab t={tU} profile={store.profile} isEditMode={store.editMode} />
                </Paper>
              </TabPanel>
            </Tabs>
          </Box>
          <Stack justifyContent="end">
            <Button onClick={saveProfile} loading={store.saving}>
              {t('save')}
            </Button>
          </Stack>
        </ContextContainer>
      )}
    </Drawer>
  );
};

AddProfileDrawer.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  profile: PropTypes.any,
  onSave: PropTypes.func,
};

export { AddProfileDrawer };
export default AddProfileDrawer;
