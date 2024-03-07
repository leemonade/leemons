import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import {
  LoadingOverlay,
  Stack,
  Box,
  useDebouncedCallback,
  DropdownButton,
  TotalLayoutHeader,
  TotalLayoutFooterContainer,
  TotalLayoutContainer,
  AssetScormIcon,
  Select,
} from '@bubbles-ui/components';
import { BasicData, UploadingFileModal } from '@leebrary/components';
import JSZip from 'jszip';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { prefixPN } from '@scorm/helpers';
import { savePackageRequest, getPackageRequest, getSupportedVersionsRequest } from '@scorm/request';
import {
  xml2json,
  getVersionFromMetadata,
  getLaunchURL,
  getDefaultOrganization,
} from '@scorm/lib/utilities';
import { useLayout } from '@layout/context';

export default function Detail() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('scormSetup'));
  const { openConfirmationModal } = useLayout();
  const scrollRef = React.useRef(null);

  // ----------------------------------------------------------------------
  // SETTINGS

  const debounce = useDebouncedCallback(1000);
  const [uploadingFileInfo, setUploadingFileInfo] = useState(null);
  const [store, render] = useStore({
    loading: true,
    isNew: false,
    package: {},
    supportedVersions: [],
    preparedAsset: {},
    openShareDrawer: false,
  });

  const history = useHistory();
  const params = useParams();

  const form = useForm();
  const formValues = form.watch();

  // ----------------------------------------------------------------------------
  // INIT DATA LOADING

  async function init() {
    try {
      store.loading = true;
      store.isNew = params.id === 'new';
      render();
      if (!store.isNew) {
        const { scorm } = await getPackageRequest(params.id);
        store.titleValue = scorm.name;
        store.package = scorm;

        form.reset({
          ...scorm,
          file: { id: scorm.file?.id, name: scorm.file?.name, type: scorm.file?.type },
        });
      }

      const { versions: supportedVersions } = await getSupportedVersionsRequest();
      store.supportedVersions = supportedVersions;
      store.idLoaded = params.id;
      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  useEffect(() => {
    if (params?.id && store.idLoaded !== params?.id) init();
  }, [params]);

  // ----------------------------------------------------------------------------
  // HANDLERS

  async function savePackage(published) {
    const file = await uploadFileAsMultipart(formValues.file, {
      onProgress: (info) => {
        setUploadingFileInfo(info);
      },
    });
    const fileId = file?.id ? file.id : file;
    setUploadingFileInfo(null);

    const dataToSave = {
      ...formValues,
      id: store.isNew ? null : store.idLoaded,
      file: fileId,
      launchUrl: store.package.launchUrl,
      packageAsset: store.package.packageAsset,
      published,
    };

    const {
      package: { id },
    } = await savePackageRequest(dataToSave);

    store.package.id = id;
    store.idLoaded = id;
    store.isNew = false;

    if (file !== formValues.file.id) {
      form.setValue('file', {
        id: file,
        name: formValues.file.name,
        type: formValues.file.type,
      });
    }
  }

  async function saveAndPublish() {
    try {
      store.saving = 'edit';
      render();
      await savePackage(true);
      addSuccessAlert(t('published'));
    } catch (error) {
      addErrorAlert(error);
    } finally {
      store.saving = null;
      render();
    }
  }

  async function onlyPublish() {
    await saveAndPublish();
    history.push('/private/leebrary/assignables.scorm/list?activeTab=published');
  }

  async function publishAndAssign() {
    await saveAndPublish();
    history.push(`/private/scorm/assign/${store.package.id}`);
  }

  async function loadFiles(file) {
    if (file instanceof File) {
      try {
        const zip = new JSZip();
        const files = (await zip.loadAsync(file)).folder('');

        if (files?.files) {
          let manifestFile = null;

          files.forEach(async (relativePath, zipFile) => {
            if (relativePath === 'imsmanifest.xml') {
              manifestFile = zipFile;
            }
          });

          if (!manifestFile) {
            throw new Error(null);
          }

          const manifest = await manifestFile.async('string');
          const manifestObj = xml2json(manifest);
          const scormData = manifestObj?.manifest;

          if (!scormData) {
            throw new Error(null);
          }

          const organization = getDefaultOrganization(scormData);
          const launchUrl = getLaunchURL(scormData);

          store.package = { ...store.package, launchUrl };

          if (organization?.title && isEmpty(formValues.name)) {
            form.setValue('name', organization.title);
          }

          if (scormData.metadata) {
            const versionValue = getVersionFromMetadata(
              String(scormData.metadata.schemaversion),
              store.supportedVersions
            );
            if (versionValue) {
              form.setValue('version', versionValue.value);
            }
          }
        }
      } catch (e) {
        form.setValue('file', null);
        addErrorAlert({
          message: t('fileFormatError'),
        });
      }
    }
  }

  const handleOnCancel = () => {
    const formHasBeenTouched = Object.keys(form.formState.touchedFields).length > 0;
    const formIsNotEmpty = !isEmpty(formValues);
    if (formHasBeenTouched || formIsNotEmpty) {
      openConfirmationModal({
        title: t('cancelModalTitle'),
        description: t('cancelModalDescription'),
        labels: { confim: t('cancelModalConfirm'), cancel: t('cancelModalCancel') },
        onConfirm: () => history.goBack(),
      })();
    } else {
      history.goBack();
    }
  };

  // ----------------------------------------------------------------------------
  // EFFECTS

  useEffect(() => {
    const subscription = form.watch(() => {
      debounce(async () => {
        store.isValid = await form.trigger();
        render();
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (formValues.file) {
      loadFiles(formValues.file);
    }
  }, [formValues.file]);

  // ----------------------------------------------------------------------------
  // FOOTER ACTIONS
  const footerFinalActionsAndLabels = [
    {
      label: t('publish'),
      onClick: () => onlyPublish(),
    },
    {
      label: t('publishAndAssign'),
      onClick: () => publishAndAssign(),
    },
  ];

  // ----------------------------------------------------------------------------
  // RENDER

  return (
    <FormProvider {...form}>
      <LoadingOverlay visible={tLoading || store.loading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={store.isNew ? t('titleNew') : t('titleEdit')}
            icon={
              <Stack justifyContent="center" alignItems="center">
                <AssetScormIcon />
              </Stack>
            }
            formTitlePlaceholder={formValues.name || t('scormTitlePlaceholder')}
            onCancel={handleOnCancel}
            mainActionLabel={t('cancel')}
          />
        }
      >
        <Stack key="step-1" justifyContent="center">
          <BasicData
            advancedConfig={{
              alwaysOpen: false,
              program: { show: true, required: false },
              subjects: { show: true, required: false, showLevel: true, maxOne: false },
            }}
            editing={!store.isNew}
            categoryKey={'assignables.scorm'}
            isLoading={store.loading}
            Footer={
              <TotalLayoutFooterContainer
                fixed
                scrollRef={scrollRef}
                rightZone={
                  <DropdownButton
                    chevronUp
                    width="auto"
                    data={footerFinalActionsAndLabels}
                    loading={store.loading}
                    disabled={store.loading}
                  >
                    {t('finish')}
                  </DropdownButton>
                }
              />
            }
            ContentExtraFields={
              <Box style={{ maxWidth: 288 }}>
                <Controller
                  control={form.control}
                  name="version"
                  rules={{ required: 'Version Error' }}
                  shouldUnregister
                  render={({ field }) => (
                    <Select
                      {...field}
                      label={t('schemaVersion')}
                      data={store.supportedVersions}
                      placeholder={t('schemaVersionPlaceholder')}
                    />
                  )}
                />
              </Box>
            }
          />
        </Stack>
      </TotalLayoutContainer>
      <UploadingFileModal opened={uploadingFileInfo !== null} info={uploadingFileInfo} />
    </FormProvider>
  );
}
