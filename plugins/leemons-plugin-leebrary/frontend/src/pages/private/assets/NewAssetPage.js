import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { getAssetRequest, newAssetRequest } from '@leebrary/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import {
  createStyles,
  TotalLayout,
  TotalLayoutHeader,
  useTotalLayout,
} from '@bubbles-ui/components';
import { useRequestErrorMessage } from '@common';

import prefixPN from '../../../helpers/prefixPN';
import LibraryContext from '../../../context/LibraryContext';
import { prepareAsset } from '../../../helpers/prepareAsset';
import { BasicData, BookmarkBasicData } from '../../../components/AssetSetup';
import { UploadingFileModal } from '../../../components/UploadingFileModal';

const NewAssetPage = () => {
  const { category, categories, selectCategory, setCategory, setAsset, asset } =
    React.useContext(LibraryContext);
  const totalLayoutProps = useTotalLayout();
  const [uploadingFileInfo, setUploadingFileInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [t] = useTranslateLoader(prefixPN('assetSetup'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const history = useHistory();
  const params = useParams();

  // Set Category for Library context
  React.useEffect(() => {
    if (!_.isEmpty(params.category)) selectCategory(params.category);
    const item = _.find(categories, { id: asset?.category });
    setCategory(item);
  }, [params, asset, categories, category]);

  // #region * INITIAL STEP VALUES -------------------------------------------
  const getInitialValues = () => {
    if (category?.key === 'bookmarks') return {};
    return {
      file: asset?.file || null,
      name: asset?.name || '',
      description: asset?.description || '',
      color: asset?.color || '',
      cover: asset?.cover || null,
      url: asset?.url || null,
      program: asset?.program || null,
      subjects: asset?.subjects || null,
    };
  };

  const loadAsset = async (id) => {
    try {
      const response = await getAssetRequest(id);
      if (!_.isEmpty(response?.asset)) {
        const loadedAsset = await prepareAsset(response.asset);
        setAsset(loadedAsset);
      } else {
        setAsset(null);
      }
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  };
  React.useEffect(() => {
    if (!_.isEmpty(params.id) && _.isEmpty(asset)) {
      loadAsset(params.id);
    }
    console.log('asset', asset);
  }, [params, asset]);

  const initialStepsInfo = React.useMemo(
    () => [
      {
        label: '',
        badge: null,
        status: null,
        showStep: true,
        validationSchema: z.object({
          name: z
            .string({ required_error: 'Title error HARDCODED WITH NO MERCY' })
            .min(1, 'Title error HARDCODED WITH NO MERCY'),
          file: z.instanceof(File).or(
            z.object({
              name: z.string(),
              type: z.string(),
            })
          ),
        }),
        initialValues: getInitialValues(),
        stepComponent: (
          <BasicData
            key={'basic-data'}
            advancedConfig={{
              alwaysOpen: false,
              program: { show: true, required: false },
              subjects: { show: true, required: false, showLevel: true, maxOne: false },
            }}
            categoryId={category?.id}
            onSave={setAsset}
            type={asset?.fileType}
            asset={asset}
            file={asset?.file}
            editing={params.id?.length}
          />
        ),
      },
    ],
    [category, asset]
  );
  // #endregion

  // #region * INITI FORM ----------------------------------------------------
  const form = useForm({
    defaultValues: initialStepsInfo[totalLayoutProps.activeStep]?.initialValues,
    resolver: zodResolver(initialStepsInfo[totalLayoutProps.activeStep]?.validationSchema),
  });
  const formValues = form.watch();

  // Edit: If an asset is passed the form resets
  React.useEffect(() => {
    form.reset(initialStepsInfo[totalLayoutProps.activeStep]?.initialValues);
  }, [asset]);

  React.useEffect(() => {
    console.log('formValues', formValues);
  }, [formValues]);
  // #endregion

  // #region * INIT HEADER & handleOnCancel ------------------------------------------
  const handleOnCancel = () => {
    if (totalLayoutProps.formIsDirty) {
      // Usar openConfirmationModal del plugin Layout(leemons)
      return;
    }
    console.log('totalLayoutProps', totalLayoutProps);
    history.goBack();
  };

  const gerAssetTitleAndIcon = () => {
    if (category?.key === 'bookmark') return { title: 'NUEVO MARCADOR', icon: null };
    // TODO es scorm??? return 'NUEVO SCORM'
    return { title: 'NUEVO RECURSO', icon: null };
  };

  const buildHeader = () => (
    <TotalLayoutHeader
      title={gerAssetTitleAndIcon().title}
      icon={gerAssetTitleAndIcon().icon}
      formTitlePlaceholder={formValues.name || 'Título del Recurso'}
      onCancel={handleOnCancel}
    />
  );
  // #endregion

  // #region * HANDLERS -------------------------------------------------------
  const publishAndAssign = () => {
    console.log('handling publish and assign');
  };

  const handlePublish = async () => {
    if (category.key === 'bookmarks') {
      // handle publish bookmark()
      return;
    }

    try {
      formValues.file = await uploadFileAsMultipart(formValues.file, {
        onProgress: (info) => {
          setUploadingFileInfo(info);
        },
      });
      setUploadingFileInfo(null);
      const { cover } = formValues;
      const requestMethod = newAssetRequest;
      setLoading(true);

      try {
        const { asset: newAsset } = await requestMethod(
          { ...formValues, cover, tags: formValues.tags || [] },
          category.id,
          'media-files'
        );
        const response = await getAssetRequest(newAsset.id);
        setAsset(prepareAsset(response.asset));
        setLoading(false);
        addSuccessAlert(t('basicData.labels.createdSuccess'));
        history.goBack();
      } catch (err) {
        console.log('err', err);
        setLoading(false);
        addErrorAlert(getErrorMessage(err));
      }
    } catch (e) {
      setUploadingFileInfo(null);
    }
  };
  // #endregion

  // #region * FOOTER ACTIONS ------------------------------------------------
  const footerActionsLabels = {
    back: 'Anterior',
    save: 'Guardar borrador',
    next: 'Siguiente',
    dropdownLabel: 'Finalizar',
  };

  const footerFinalActionsAndLabels = [
    { label: 'Publicar', action: handlePublish },
    { label: 'Publicar y asignar', action: publishAndAssign },
  ];
  // #endregion

  // React.useEffect(() => console.log(formValues), [formValues]);

  return (
    <>
      <FormProvider {...form}>
        <TotalLayout
          {...totalLayoutProps}
          Header={() => buildHeader()}
          footerActionsLabels={footerActionsLabels}
          footerFinalActions={footerFinalActionsAndLabels}
          initialStepsInfo={initialStepsInfo}
          onCancel={handleOnCancel}
          isLoading={loading}
        />
      </FormProvider>
      <UploadingFileModal opened={uploadingFileInfo !== null} info={uploadingFileInfo} />
    </>
  );
};

export { NewAssetPage };
export default NewAssetPage;
