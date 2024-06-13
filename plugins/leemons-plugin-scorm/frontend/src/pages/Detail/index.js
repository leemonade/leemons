import React, { useRef, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import JSZip from 'jszip';
import { isEmpty } from 'lodash';
import {
  LoadingOverlay,
  Stack,
  Box,
  DropdownButton,
  TotalLayoutHeader,
  TotalLayoutFooterContainer,
  TotalLayoutContainer,
  AssetScormIcon,
  Select,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { BasicData, UploadingFileModal } from '@leebrary/components';
import usePackage from '@scorm/request/hooks/queries/usePackage';
import { prefixPN } from '@scorm/helpers';
import { getSupportedVersionsRequest } from '@scorm/request';
import useMutatePackage from '@scorm/request/hooks/mutations/useMutatePackage';
import {
  xml2json,
  getVersionFromMetadata,
  getLaunchURL,
  getDefaultOrganization,
} from '@scorm/lib/utilities';

export default function Detail() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('scormSetup'));
  const scrollRef = useRef(null);
  const params = useParams();
  const history = useHistory();
  const [isNew, setIsNew] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [supportedVersions, setSupportedVersions] = useState([]);
  const [uploadingFileInfo, setUploadingFileInfo] = useState(null);
  const packageQuery = usePackage({ id: params.id, isNew: false });
  const mutation = useMutatePackage();
  const { openConfirmationModal } = useLayout();
  const form = useForm({});
  const formValues = form.watch();

  // ···································································
  // INITIAL DATA

  useEffect(() => {
    const getVersions = async () => {
      const response = await getSupportedVersionsRequest();
      setSupportedVersions(response.versions || []);
    };
    getVersions();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (params.id === 'new') {
      form.reset();
      setIsNew(true);
    } else {
      form.reset({
        ...packageQuery.data,
        cover: packageQuery.data?.cover,
      });

      setIsNew(false);
    }
    setIsLoading(false);
  }, [packageQuery.data, params.id]);

  // ··································································
  // HANDLERS
  const savePackage = async ({ publishing = true, assigning }) => {
    setIsLoading(true);

    const file = await uploadFileAsMultipart(formValues.file, {
      onProgress: (info) => {
        setUploadingFileInfo(info);
      },
      isFolder: true,
    });
    setUploadingFileInfo(null);

    const requestBody = {
      ...formValues,
      file,
      published: publishing,
    };
    mutation.mutate(
      { ...requestBody },
      {
        onSuccess: (data) => {
          addSuccessAlert(t('published'));
          setIsLoading(false);
          if (assigning) history.push(`/private/scorm/assign/${data.package?.id}`);
          else history.push('/private/leebrary/assignables.scorm/list');
        },
        onError: (error) => {
          addErrorAlert(error.message);
          setIsLoading(false);
        },
      }
    );
  };

  const handlePublish = async () => {
    const formIsValid = await form.trigger();
    if (formIsValid) await savePackage({ publishing: true });
  };

  const handlePublishAndAssign = async () => {
    const formIsValid = await form.trigger();
    if (formIsValid) await savePackage({ publishing: true, assigning: true });
  };

  const handleFileLoad = async (file) => {
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

          form.setValue('launchUrl', launchUrl);

          if (organization?.title && isEmpty(formValues.name)) {
            form.setValue('name', organization.title);
          }

          if (scormData.metadata) {
            const versionValue = getVersionFromMetadata(
              String(scormData.metadata.schemaversion),
              supportedVersions
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
  };

  const handleOnCancel = () => {
    const formHasBeenTouched = Object.keys(form.formState.touchedFields).length > 0;
    if (formHasBeenTouched) {
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

  // ···································································
  // EFFECTS
  useEffect(() => {
    setIsNew(Boolean(params.id));
  }, [params.id]);

  useEffect(() => {
    if (formValues.file) {
      handleFileLoad(formValues.file);
    }
  }, [formValues.file]);

  // ----------------------------------------------------------------------------
  // FOOTER ACTIONS
  const footerFinalActionsAndLabels = [
    {
      label: t('publish'),
      onClick: handlePublish,
    },
    {
      label: t('publishAndAssign'),
      onClick: handlePublishAndAssign,
    },
  ];

  return (
    <FormProvider {...form}>
      <LoadingOverlay visible={tLoading || isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={isNew ? t('titleNew') : t('titleEdit')}
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
        <Stack key="step-1" ref={scrollRef} justifyContent="center" style={{ overflowY: 'auto' }}>
          <BasicData
            advancedConfig={{
              alwaysOpen: false,
              program: { show: true, required: false },
              subjects: { show: true, required: false, showLevel: true, maxOne: false },
            }}
            editing={isNew}
            categoryKey={'assignables.scorm'}
            isLoading={isLoading}
            Footer={
              <TotalLayoutFooterContainer
                fixed
                scrollRef={scrollRef}
                rightZone={
                  <DropdownButton
                    chevronUp
                    width="auto"
                    data={footerFinalActionsAndLabels}
                    loading={isLoading}
                    disabled={isLoading}
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
                      data={supportedVersions}
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
