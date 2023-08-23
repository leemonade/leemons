import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import {
  Box,
  PageHeader,
  LoadingOverlay,
  Stack,
  useDebouncedCallback,
  ContextContainer,
  FileUpload,
  Paragraph,
  Select,
  Switch,
  NumberInput,
  DropdownButton,
} from '@bubbles-ui/components';
import JSZip from 'jszip';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore, unflatten } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { AssetFormInput, UploadingFileModal } from '@leebrary/components';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { prefixPN } from '@scorm/helpers';
import { savePackageRequest, getPackageRequest, getSupportedVersionsRequest } from '@scorm/request';
import {
  xml2json,
  getVersionFromMetadata,
  getLaunchURL,
  getDefaultOrganization,
} from '@scorm/lib/utilities';
import { DocumentIcon } from '@scorm/components/icons';
import { PageContent } from './components/PageContent/PageContent';

export default function Detail() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('scormSetup'));
  const [, translations] = useTranslateLoader('plugins.leebrary.assetSetup');

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

  // ························································
  // LABELS & STATICS

  const formLabels = React.useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.assetSetup.basicData;
      return data;
    }
    return null;
  }, [translations]);

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
  // METHODS

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

  async function saveAsPublish() {
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
    await saveAsPublish();
    history.push('/private/leebrary/assignables.scorm/list?activeTab=published');
  }

  async function publishAndAssign() {
    await saveAsPublish();
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
            /*
          const currentTags = isArray(formValues.tags) ? formValues.tags : [];
          form.setValue('tags', [
            ...currentTags,
            scormData.metadata.schema,
            `Version ${scormData.metadata.schemaversion}`,
          ]);
          */
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
  // COMPONENT

  if (store.loading || tLoading) return <LoadingOverlay visible />;

  const advancedConfig = {
    alwaysOpen: false,
    fileToRight: true,
    colorToRight: true,
    program: { show: true, required: false },
    subjects: { show: true, required: false, showLevel: true, maxOne: false },
  };

  return (
    <Box style={{ height: '100vh' }}>
      <ContextContainer divided>
        <Stack direction="column" fullHeight>
          <PageHeader
            values={{
              title: t('title'),
            }}
            isEditMode={true}
            icon={<DocumentIcon />}
            fullWidth
          />

          <PageContent title={t('pageTitle')}>
            <ContextContainer divided>
              <Box>
                <Paragraph dangerouslySetInnerHTML={{ __html: t('description') }} />
              </Box>
              <ContextContainer>
                <Box>
                  <Controller
                    control={form.control}
                    name="file"
                    shouldUnregister
                    rules={{
                      required: formLabels?.errorMessages.file?.required || 'Field required',
                    }}
                    render={({ field: { ref, value, ...field } }) => (
                      <FileUpload
                        icon={<CloudUploadIcon height={32} width={32} />}
                        title={t('addFile')}
                        subtitle={t('dropFile')}
                        errorMessage={{
                          title: 'Error',
                          message: formLabels?.errorMessages.file?.rejected || 'File was rejected',
                        }}
                        hideUploadButton
                        single
                        initialFiles={value ? [value] : []}
                        inputWrapperProps={{ error: form.formState.errors.file }}
                        accept={[
                          'application/octet-stream',
                          'application/zip',
                          'application/x-zip',
                          'application/x-zip-compressed',
                        ]}
                        {...field}
                      />
                    )}
                  />
                </Box>
                <AssetFormInput
                  preview
                  form={form}
                  category="assignables.scorm"
                  previewVariant="document"
                  advancedConfig={advancedConfig}
                  showAdvancedConfig
                  tagsPluginName="scorm"
                >
                  <ContextContainer>
                    <Box>
                      <Paragraph dangerouslySetInnerHTML={{ __html: t('configHelp') }} />
                    </Box>
                    <Box style={{ maxWidth: 288 }}>
                      <Controller
                        control={form.control}
                        name="version"
                        shouldUnregister
                        render={({ field }) => (
                          <Select
                            {...field}
                            label={t('schemaVersion')}
                            data={store.supportedVersions}
                          />
                        )}
                      />
                    </Box>
                    <Box>
                      {/* <Controller
                        control={form.control}
                        name="gradable"
                        shouldUnregister
                        render={({ field }) => (
                          <>
                            <Switch {...field} checked={field.value} label={t('gradable')} />
                            {!!field.value && (
                              <Box sx={{ paddingLeft: 20 }}>
                                <Controller
                                  control={form.control}
                                  name="metadata.multipleAttempts"
                                  shouldUnregister
                                  render={({ field: multipleAttemptsField }) => (
                                    <>
                                      <Switch
                                        {...multipleAttemptsField}
                                        checked={multipleAttemptsField.value}
                                        label={t('multipleAttempts')}
                                      />
                                      {!!multipleAttemptsField.value && (
                                        <Controller
                                          control={form.control}
                                          name="metadata.numberOfAttempts"
                                          shouldUnregister
                                          render={({ field: numberOfAttemptsField }) => (
                                            <Box sx={{ paddingLeft: 10 }}>
                                              <NumberInput
                                                {...numberOfAttemptsField}
                                                label={t('numberOfAttempts')}
                                              />
                                            </Box>
                                          )}
                                        />
                                      )}
                                    </>
                                  )}
                                />
                              </Box>
                            )}
                          </>
                        )}
                      /> */}
                    </Box>
                  </ContextContainer>
                </AssetFormInput>
              </ContextContainer>
              <Stack justifyContent="flex-end">
                <DropdownButton
                  disabled={!form.formState.isValid}
                  loading={store.saving}
                  data={[
                    { label: t('onlyPublish'), onClick: () => onlyPublish() },
                    // { label: t('publishAndShare'), onClick: () => publishAndShare() },
                    { label: t('publishAndAssign'), onClick: () => publishAndAssign() },
                  ]}
                >
                  {t('publishOptions')}
                </DropdownButton>
              </Stack>
            </ContextContainer>
          </PageContent>
        </Stack>
      </ContextContainer>

      <UploadingFileModal opened={uploadingFileInfo !== null} info={uploadingFileInfo} />
    </Box>
  );
}
