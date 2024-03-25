import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { find, isEmpty, isString } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { getAssetRequest, newAssetRequest, updateAssetRequest } from '@leebrary/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import { useQueryClient } from '@tanstack/react-query';
import { allGetSimpleAssetListKey } from '@leebrary/request/hooks/keys/simpleAssetList';
import { allGetAssetsKey } from '@leebrary/request/hooks/keys/assets';
import {
  AssetBookmarkIcon,
  AssetMediaIcon,
  TotalLayout,
  TotalLayoutHeader,
  useTotalLayout,
} from '@bubbles-ui/components';
import { useRequestErrorMessage } from '@common';

import imageUrlToFile from '@leebrary/helpers/imageUrlToFile';
import compressImage from '@leebrary/helpers/compressImage';
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

  // INITIAL STEP VALUES -------------------------------------------
  const getInitialValues = () => ({
    file: asset?.file || null,
    name: asset?.name || '',
    description: asset?.description || '',
    color: asset?.color || '',
    cover: asset?.cover || null,
    url: asset?.url || null,
    program: asset?.program || null,
    subjects: asset?.subjects?.map((subject) => subject?.subject) || null,
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

  // INIT FORM ----------------------------------------------------
  const form = useForm({
    defaultValues: initialStepsInfo[totalLayoutProps.activeStep]?.initialValues,
    resolver: zodResolver(initialStepsInfo[totalLayoutProps.activeStep]?.validationSchema),
  });
  const formValues = form.watch();

  // Edit: If an asset is passed, the form resets to load initial values
  React.useEffect(() => {
    form.reset(initialStepsInfo[totalLayoutProps.activeStep]?.initialValues);
  }, [asset]);

  // HELPER FUNCTIONS --------------------------------------------------------

  async function resolveAssetCover({ categoryName, isEditing, isImageResource }) {
    const coverIsAUrl = isString(formValues.cover) && formValues.cover?.startsWith('http');

    const isBookmarkWithValidCover = coverIsAUrl && categoryName === 'bookmarks';
    if (isBookmarkWithValidCover && !isEditing) {
      setUploadingFileInfo({ state: 'processingImage' });
      const coverFile = await imageUrlToFile(formValues.cover);
      const finalImage = await compressImage({ file: coverFile });
      formValues.cover = finalImage;
      return;
    }

    const needsNewCover = !formValues.file?.id;
    const couldNeedCompression =
      isImageResource &&
      formValues.file.type.indexOf('/gif') < 0 &&
      formValues.file.type.indexOf('/svg') < 0;
    if (isImageResource && needsNewCover) {
      formValues.cover = null;

      if (couldNeedCompression) {
        const finalImage = await compressImage({ file: formValues.file });
        formValues.file = finalImage;
      }
      return;
    }

    // If any other field but the cover is updated we'll need the original cover value for any media-file or bookmark.
    if (coverIsAUrl) {
      formValues.cover = asset?.original?.cover?.id;
    }
  }

  // HANDLERS -------------------------------------------------------
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
    const requestMethod = editing ? updateAssetRequest : newAssetRequest;
    const isImageResource = formValues.file?.type.indexOf('image') === 0;
    let file;
    let cover;

    setLoading(true);
    await resolveAssetCover({ categoryName: category?.key, isEditing: editing, isImageResource });

    // DEFINE/UPLOAD FINAL FILE & COVER FILES
    try {
      const needsToUploadNewFile = !formValues.file?.id;
      if (category?.key !== 'bookmarks' && needsToUploadNewFile) {
        file = await uploadFileAsMultipart(formValues.file, {
          onProgress: (info) => {
            setUploadingFileInfo(info);
          },
        });
        setUploadingFileInfo(null);
      } else {
        file = formValues.file;
      }

      const bookmarkOldCover = asset?.original?.cover || null;
      const bookmarkNeedsNewCover = bookmarkOldCover
        ? bookmarkOldCover?.id !== formValues.cover
        : !isEmpty(formValues.cover);

      if (category?.key === 'bookmarks' && bookmarkNeedsNewCover) {
        cover = await uploadFileAsMultipart(formValues.cover, {
          onProgress: (info) => {
            setUploadingFileInfo(info);
          },
        });
        setUploadingFileInfo(null);
      } else {
        cover = formValues.cover?.id ?? formValues.cover;
      }

      // REQUEST
      try {
        const assetData = { ...formValues, cover, file };
        if (editing) assetData.id = params.id;

        const { asset: newAsset } = await requestMethod(assetData, category?.id, category?.key, {
          onProgress: (info) => {
            setUploadingFileInfo(info);
          },
        });
        const response = await getAssetRequest(newAsset.id);
        setAsset(prepareAsset(response.asset));
        setLoading(false);
        queryClient.invalidateQueries(allGetSimpleAssetListKey);
        queryClient.invalidateQueries(allGetAssetsKey);
        addSuccessAlert(
          editing ? t('basicData.labels.updatedSuccess') : t('basicData.labels.createdSuccess')
        );

        history.push(
          `/private/leebrary/${
            response.asset?.fileType === 'bookmark' ? 'bookmarks' : 'media-files'
          }/list`
        );
      } catch (err) {
        setLoading(false);
        setUploadingFileInfo(null);
        addErrorAlert(getErrorMessage(err));
      }
    } catch (e) {
      setLoading(false);
      setUploadingFileInfo(null);
    }
  };

  const handlePlublishAndAssign = async () => {
    await handlePublish();
  };

  // HEADER --------------------------------------------------------
  const getAssetInfoHeader = () => {
    const editing = params.id?.length;
    if (category?.key === 'bookmarks')
      return {
        title: editing ? t('basicData.bookmark.titleEdit') : t('basicData.bookmark.titleNew'),
        subTitle: t('basicData.bookmark.subTitle'),
        icon: <AssetBookmarkIcon width={24} height={24} color={'#878D96'} />,
        placeHolder: t('basicData.placeholders.bookmarkName'),
      };
    return {
      title: editing ? t('basicData.header.titleEdit') : t('basicData.header.titleNew'),
      subTitle: t('basicData.header.subTitle'),
      icon: <AssetMediaIcon width={24} height={24} color={'#878D96'} />,
      placeHolder: t('basicData.placeholders.name'),
    };
  };

  const buildHeader = () => (
    <TotalLayoutHeader
      title={getAssetInfoHeader().title}
      icon={getAssetInfoHeader().icon}
      formTitlePlaceholder={formValues.name || getAssetInfoHeader().placeHolder}
      onSave={form.handleSubmit(handlePlublishAndAssign)}
      onCancel={handleOnCancel}
      mainActionLabel={t('header.cancel')}
    />
  );

  // FOOTER ACTIONS ------------------------------------------------
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
