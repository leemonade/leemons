import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { isEmpty, find, isString } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { getAssetRequest, newAssetRequest, updateAssetRequest } from '@leebrary/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import { useQueryClient } from '@tanstack/react-query';
import { allAssetsKey } from '@leebrary/request/hooks/keys/assets';
import {
  TotalLayout,
  TotalLayoutHeader,
  useTotalLayout,
  AssetMediaIcon,
  AssetBookmarkIcon,
} from '@bubbles-ui/components';
import { useRequestErrorMessage } from '@common';

import prefixPN from '../../../helpers/prefixPN';
import LibraryContext from '../../../context/LibraryContext';
import { prepareAsset } from '../../../helpers/prepareAsset';
import { BasicData } from '../../../components/AssetSetup';
import { UploadingFileModal } from '../../../components/UploadingFileModal';

const AssetPage = () => {
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
  const queryClient = useQueryClient();

  // Set Category for Library context
  React.useEffect(() => {
    if (params) {
      if (!isEmpty(params.category)) selectCategory(params.category);
      const query = {};
      if (params.category) query.key = params.category;
      else query.id = asset?.category;

      const item = find(categories, query);
      setCategory(item);
    }
  }, [params, asset, categories, category]);

  // #region * INITIAL STEP VALUES -------------------------------------------
  const getInitialValues = () => ({
    file: asset?.file || null,
    name: asset?.name || '',
    description: asset?.description || '',
    color: asset?.color || '',
    cover: asset?.cover || null,
    url: asset?.url || null,
    program: asset?.program || null,
    subjects: asset?.subjects || null,
    tags: asset?.tags || [],
  });

  const getValidationSchema = (assetType) => {
    const zodSchema = {
      name: z
        .string({ required_error: t('basicData.errorMessages.name') })
        .min(1, t('basicData.errorMessages.name')),
    };
    if (assetType === 'bookmarks') {
      zodSchema.url = z
        .string({ required_error: t('basicData.errorMessages.url') })
        .min(1, t('basicData.errorMessages.url'));
    } else {
      zodSchema.file = z.instanceof(File).or(
        z.object({
          name: z.string(),
          type: z.string(),
        })
      );
    }
    return z.object(zodSchema);
  };

  const loadAsset = async (id) => {
    try {
      const response = await getAssetRequest(id);
      if (!isEmpty(response?.asset)) {
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
    if (!isEmpty(params.id) && isEmpty(asset)) {
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
        validationSchema: getValidationSchema(category?.key),
        initialValues: getInitialValues(),
        stepComponent: (
          <BasicData
            key={t('basicData')}
            advancedConfig={{
              alwaysOpen: false,
              program: { show: true, required: false },
              subjects: { show: true, required: false, showLevel: true, maxOne: false },
            }}
            onSave={setAsset}
            editing={params.id?.length}
            isLoading={loading}
            categoryKey={params.category || ''}
          />
        ),
      },
    ],
    [category, asset, params]
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

  // #region * HANDLERS -------------------------------------------------------
  const handleOnCancel = () => {
    const formHasBeenTouched = Object.keys(form.formState.touchedFields).length > 0;
    if (formHasBeenTouched) {
      openConfirmationModal({
        title: t('cancelModal.title'),
        description: t('cancelModal.description'),
        labels: { confim: t('cancelModal.confirm'), cancel: t('cancelModal.cancel') },
        onConfirm: () => history.goBack(),
      })();
    } else {
      history.goBack();
    }
  };

  const handlePublish = async () => {
    const editing = params.id?.length > 0;
    const { cover } = formValues;
    const requestMethod = editing ? updateAssetRequest : newAssetRequest;
    let file;
    const isImage = formValues.file?.type.indexOf('image') === 0;
    setLoading(true);

    try {
      if (category?.key !== 'bookmarks') {
        file = await uploadFileAsMultipart(formValues.file, {
          onProgress: (info) => {
            setUploadingFileInfo(info);
          },
        });
        setUploadingFileInfo(null);
      }

      try {
        const assetData = { ...formValues, cover, file };
        const needsOldCover = isImage
          ? form.formState.dirtyFields.file
          : form.formState.dirtyFields.cover;

        // If Cover doesn't change, set it to the original value
        if (isString(cover) && cover.indexOf('http') === 0 && asset && needsOldCover) {
          assetData.cover = asset.original?.cover?.id;
        }

        if (editing) assetData.id = params.id;

        const { asset: newAsset } = await requestMethod(assetData, category?.id, category?.key);
        const response = await getAssetRequest(newAsset.id);
        setAsset(prepareAsset(response.asset));
        setLoading(false);
        addSuccessAlert(
          editing ? t('basicData.labels.updatedSuccess') : t('basicData.labels.createdSuccess')
        );
        queryClient.invalidateQueries(allAssetsKey);

        // Redirects to the correspnding category page
        if (response.asset?.fileType === 'bookmark')
          history.push('/private/leebrary/bookmarks/list');
        else history.push('/private/leebrary/media-files/list');
      } catch (err) {
        setLoading(false);
        addErrorAlert(getErrorMessage(err));
      }
    } catch (e) {
      setUploadingFileInfo(null);
    }
  };

  const handlePlublishAndAssign = async () => {
    await handlePublish();
  };
  // #endregion

  // #region * HEADER --------------------------------------------------------
  const getAssetHeaderData = () => {
    const editing = params.id?.length;
    if (category?.key === 'bookmarks')
      return {
        title: editing ? t('basicData.bookmark.titleEdit') : t('basicData.bookmark.titleNew'),
        subTitle: t('basicData.bookmark.subTitle'),
        icon: <AssetBookmarkIcon width={24} height={24} color={'#878D96'} />,
      };
    return {
      title: editing ? t('basicData.header.titleEdit') : t('basicData.header.titleNew'),
      subTitle: t('basicData.header.subTitle'),
      icon: <AssetMediaIcon width={24} height={24} color={'#878D96'} />,
    };
  };

  const buildHeader = () => (
    <TotalLayoutHeader
      title={getAssetHeaderData().title}
      icon={getAssetHeaderData().icon}
      formTitlePlaceholder={formValues.name || getAssetHeaderData().subTitle}
      onSave={form.handleSubmit(handlePlublishAndAssign)}
      onCancel={handleOnCancel}
    />
  );
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
    { label: 'Publicar y asignar', action: handlePlublishAndAssign },
  ];
  // #endregion

  return (
    <>
      <FormProvider {...form}>
        <TotalLayout
          {...totalLayoutProps}
          Header={buildHeader}
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

export { AssetPage };
export default AssetPage;
