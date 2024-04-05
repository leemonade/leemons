import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutFooterContainer,
  Button,
  Stack,
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
    useContext(LibraryContext);
  const [uploadingFileInfo, setUploadingFileInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [t] = useTranslateLoader(prefixPN('assetSetup'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const { openConfirmationModal } = useLayout();
  const history = useHistory();
  const params = useParams();
  const queryClient = useQueryClient();
  const scrollRef = useRef(null);

  // SET CATEGORY AND LOAD ASSET IF EDITING ------------------------------------------------------------------------

  useEffect(() => {
    if (params) {
      if (!isEmpty(params.category)) selectCategory(params.category);
      const query = {};
      if (params.category) query.key = params.category;
      else query.id = asset?.category;

      const item = find(categories, query);
      setCategory(item);
    }
  }, [params, asset, categories, category]);

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

  useEffect(() => {
    if (!isEmpty(params.id) && isEmpty(asset)) {
      loadAsset(params.id);
    }
  }, [params, asset]);

  // INIT FORM  --------------------------------------------------------------------

  const validationSchema = useMemo(() => {
    const zodSchema = {
      name: z
        .string({ required_error: t('basicData.errorMessages.name') })
        .min(1, t('basicData.errorMessages.name')),
    };
    if (category?.key === 'bookmarks') {
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
    return zodSchema;
  }, [category, t]);

  const form = useForm({
    resolver: zodResolver(z.object(validationSchema)),
  });
  const formValues = form.watch();

  useEffect(() => {
    let solvedProgram;
    if (asset?.subjects?.length) {
      solvedProgram = asset?.subjects[0].program;
    }
    form.setValue('file', asset?.file || null);
    form.setValue('name', asset?.name);
    form.setValue('description', asset?.description);
    form.setValue('color', asset?.color || null);
    form.setValue('cover', asset?.cover || null);
    form.setValue('program', asset?.program || solvedProgram || null);
    form.setValue('subjects', asset?.subjects?.map((subject) => subject.subject) || null);
    form.setValue('tags', asset?.tags);
    if (category?.key === 'bookmarks') {
      form.setValue('url', asset?.url);
    }
  }, [asset]);

  // HANDLERS & FUNCTIONS -------------------------------------------------------
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

  // HEADER & FOOTER --------------------------------------------------------
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

  return (
    <>
      <FormProvider {...form}>
        <TotalLayoutContainer
          scrollRef={scrollRef}
          Header={
            <TotalLayoutHeader
              title={getAssetInfoHeader().title}
              icon={getAssetInfoHeader().icon}
              formTitlePlaceholder={formValues.name || getAssetInfoHeader().placeHolder}
              onCancel={handleOnCancel}
              mainActionLabel={t('header.cancel')}
            />
          }
        >
          <Stack
            justifyContent="center"
            sx={{ backgroundColor: '#f8f9fb', overflow: 'auto' }}
            ref={scrollRef}
          >
            <BasicData
              key={t('basicData')}
              advancedConfig={{
                alwaysOpen: false,
                program: { show: true, required: false },
                subjects: { show: true, required: false, showLevel: true, maxOne: false },
              }}
              editing={params.id?.length}
              isLoading={loading}
              categoryKey={params.category || ''}
              Footer={
                <TotalLayoutFooterContainer
                  fixed
                  scrollRef={scrollRef}
                  rightZone={
                    <Button
                      onClick={async () => {
                        const test = await form.trigger();
                        if (test) {
                          handlePublish();
                        }
                      }}
                    >
                      {t('basicData.footer.finish')}
                    </Button>
                  }
                />
              }
            />
          </Stack>
        </TotalLayoutContainer>
      </FormProvider>
      <UploadingFileModal opened={uploadingFileInfo !== null} info={uploadingFileInfo} />
    </>
  );
};

export { AssetPage };
export default AssetPage;
