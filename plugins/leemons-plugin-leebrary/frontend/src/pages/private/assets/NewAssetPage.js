import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { getAssetRequest, newAssetRequest, updateAssetRequest } from '@leebrary/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
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
  const { openConfirmationModal } = useLayout();
  const history = useHistory();
  const params = useParams();

  // Set Category for Library context
  React.useEffect(() => {
    if (params) {
      if (!_.isEmpty(params.category)) selectCategory(params.category);
      const query = {};
      if (params.category) query.key = params.category;
      else query.id = asset?.category;

      const item = _.find(categories, query);
      setCategory(item);
    }
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
            editing={params.id?.length}
            isLoading={loading}
          />
        ),
      },
    ],
    [category, asset]
  );
  // #endregion

  // #region * INIT FORM ----------------------------------------------------
  const form = useForm({
    defaultValues: initialStepsInfo[totalLayoutProps.activeStep]?.initialValues,
    resolver: zodResolver(initialStepsInfo[totalLayoutProps.activeStep]?.validationSchema),
  });
  const formValues = form.watch();

  // Edit: If an asset is passed the form resets to load initial values
  React.useEffect(() => {
    form.reset(initialStepsInfo[totalLayoutProps.activeStep]?.initialValues);
  }, [asset]);
  // #endregion

  // #region * INIT HEADER & handleOnCancel ------------------------------------------
  const handleOnCancel = () => {
    const formHasBeenTouched = Object.keys(form.formState.touchedFields).length > 0;
    const formIsNotEmpty = !_.isEmpty(formValues);
    if (formHasBeenTouched || formIsNotEmpty) {
      openConfirmationModal({
        title: '¿Cancelar formulario?',
        description: '¿Deseas cancelar el formulario?',
        labels: { confim: 'Cancelar', cancel: 'Cancelar' },
        onConfirm: () => history.goBack(),
      })();
    } else {
      history.goBack();
    }
  };

  const gerAssetTitleAndIcon = () => {
    if (category?.key === 'bookmark')
      return { title: `${params.id?.length ? 'EDITAR' : 'NUEVO'} MARCADOR`, icon: null };
    return { title: `${params.id?.length ? 'EDITAR' : 'NUEVO'} RECURSO`, icon: null };
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
    if (category?.key === 'bookmarks') {
      // handle publish bookmark()
      return;
    }
    const editing = params.id?.length > 0;

    try {
      formValues.file = await uploadFileAsMultipart(formValues.file, {
        onProgress: (info) => {
          setUploadingFileInfo(info);
        },
      });
      setUploadingFileInfo(null);
      const { cover } = formValues;
      const requestMethod = editing ? updateAssetRequest : newAssetRequest;
      setLoading(true);

      try {
        const requestBody = { ...formValues, cover, tags: formValues.tags || [] };
        if (editing) requestBody.id = params.id;

        const { asset: newAsset } = await requestMethod(requestBody, category.id, 'media-files');
        const response = await getAssetRequest(newAsset.id);
        setAsset(prepareAsset(response.asset));
        setLoading(false);
        addSuccessAlert(t('basicData.labels.createdSuccess'));
        history.goBack();
      } catch (err) {
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
