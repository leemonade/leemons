import { useIsTeacher } from '@academic-portfolio/hooks';
import { getUserProgramsRequest } from '@academic-portfolio/request';
import {
  ActionButton,
  Box,
  Button,
  ColorInput,
  ContextContainer,
  FileUpload,
  ImageLoader,
  ImagePreviewInput,
  InputWrapper,
  Select,
  Stack,
  Switch,
  TextInput,
  Textarea,
  useResizeObserver,
  useViewportSize,
} from '@bubbles-ui/components';
import { CloudUploadIcon, CommonFileSearchIcon } from '@bubbles-ui/icons/outline';
import { TagsAutocomplete, useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import SelectSubjects from '@leebrary/components/SelectSubjects';
import _, { isEmpty, isFunction, isNil, isString, toLower } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getFileUrl, prepareAsset } from '../../helpers/prepareAsset';
import { getUrlMetadataRequest } from '../../request';
import { AssetListDrawer } from '../AssetListDrawer';
import {
  LIBRARY_FORM_DEFAULT_PROPS,
  LIBRARY_FORM_PROP_TYPES,
  LIBRARY_FORM_TYPES,
} from './LibraryForm.constants';

// -----------------------------------------------------------------------------
// HELPERS

function isValidURL(url) {
  const urlPattern =
    /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi;
  return urlPattern.test(url) ? true : 'Invalid URL';
}

function isImageFile(file) {
  if (file?.type && file?.type.indexOf('image') === 0) {
    return true;
  }

  const name = file?.path || file?.name;

  if (!isEmpty(name)) {
    const ext = toLower(name.split('.').at(-1));
    return ['png', 'jpeg', 'jpg', 'webp', 'gif', 'bmp'].includes(ext);
  }

  return false;
}

function isNullish(obj) {
  return Object.values(obj).every((value) => {
    if (isNil(value)) {
      return true;
    }

    return false;
  });
}

function getCoverUrl(cover) {
  if (cover?.id) {
    return getFileUrl(cover.id);
  }

  if (cover instanceof File) {
    return URL.createObjectURL(cover);
  }

  if (isString(cover) && isValidURL(cover)) {
    return cover;
  }

  return null;
}

function getCoverName(cover) {
  if (cover) {
    return `${cover.name}.${cover.extension}`;
  }
  return null;
}

// -----------------------------------------------------------------------------
// COMPONENT

const LibraryForm = ({
  advancedConfigMode,
  labels,
  placeholders,
  helps,
  descriptions,
  errorMessages,
  useTags,
  pluginName,
  tagsType,
  asset,
  onSubmit,
  children,
  loading,
  type,
  form,
  onlyImages,
  hideTitle,
  advancedConfig,
  hideSubmit,
  onChange = () => { },
}) => {
  const [store, render] = useStore({
    programs: null,
    showAdvancedConfig: !!asset?.program,
  });
  const [isImage, setIsImage] = useState(onlyImages);
  const [checking, setChecking] = useState(false);
  const [urlMetadata, setUrlMetadata] = useState({});
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [coverAsset, setCoverAsset] = useState(null);
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [boxRef, rect] = useResizeObserver();
  const { width: viewportWidth } = useViewportSize();
  const isTeacher = useIsTeacher();

  // ························································
  // FORM SETUP

  const defaultValues = {
    file: asset?.file || null,
    name: asset?.name || '',
    tagline: asset?.tagline || '',
    description: asset?.description || '',
    color: asset?.color || '',
    cover: asset?.cover || null,
    url: asset?.url || null,
    program: asset?.program || null,
    subjects: asset?.subjects || null,
  };

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = form || useForm({ defaultValues });

  const formValues = watch();
  const coverFile = watch('cover');
  const assetFile = watch('file');
  const bookmarkUrl = watch('url');
  const program = watch('program');

  useEffect(() => {
    if (_.isObject(coverFile) || store.cover) {
      store.coverName = getCoverName(store.cover || coverFile);
      render();
    }
  }, [coverFile]);

  async function loadAdvancedConfig() {
    store.programs = null;
    store.alwaysOpen = false;
    store.programRequired = undefined;
    store.subjectRequired = undefined;
    if (advancedConfig?.program?.show) {
      if (advancedConfig.program.required) {
        store.programRequired = { required: errorMessages.program?.required || 'Field required' };
      }
      if (advancedConfig.alwaysOpen) {
        store.alwaysOpen = advancedConfig.alwaysOpen;
      }
      if (advancedConfig.subjects?.show) {
        store.showSubjects = true;
        store.showLevel = advancedConfig.subjects.showLevel;
        store.maxOneSubject = advancedConfig.subjects.maxOne;
        if (advancedConfig.subjects.required) {
          store.subjectRequired = { required: errorMessages.subject?.required || 'Field required' };
        }
      }
      const { programs } = await getUserProgramsRequest();
      store.programs = _.map(programs, (item) => ({ label: item.name, value: item.id }));
    }
    render();
  }

  useEffect(() => {
    if (!isNullish(asset) && isEmpty(asset?.id)) {
      const valueNames = [
        'file',
        'name',
        'tagline',
        'description',
        'color',
        'cover',
        'program',
        'subjects',
      ];
      const values = getValues(valueNames);
      valueNames.forEach((valueName, index) => {
        setValue(valueName, asset[valueName] || values[index]);
      });
    }
  }, [asset]);

  useEffect(() => {
    loadAdvancedConfig();
  }, [JSON.stringify(advancedConfig)]);

  useEffect(() => {
    if (!isEmpty(assetFile)) {
      const isImageType = isImageFile(assetFile);
      setIsImage(isImageType);
      if (isEmpty(formValues.name)) {
        setValue('name', assetFile.name.match(/(.+?)(\.[^.]+$|$)/)[1]);
      }
    }
  }, [assetFile]);

  useEffect(() => {
    if (isEmpty(coverFile)) {
      setCoverAsset(null);
    }
  }, [coverFile]);

  useEffect(() => {
    // ES: El caso de uso es que el usuario cambie de soportar archivos, a solo imágenes
    // EN: The use case is that the user changes from supporting files to only images
    if (!isImage && !isNil(onlyImages)) {
      setIsImage(onlyImages);
    }
  }, [onlyImages, isImage]);

  useEffect(() => {
    onChange(formValues);
  }, [formValues]);

  // ························································
  // HANDLERS

  const handleOnSubmit = (e) => {
    if (assetFile) e.file = assetFile;
    if (coverFile) e.cover = coverFile;
    if (asset.id) e.id = asset.id;
    if (urlMetadata?.logo) e.icon = urlMetadata.logo;
    if (coverAsset) e.cover = coverAsset.file.id;

    if (isFunction(onSubmit)) onSubmit(e);
  };

  const validateUrl = async () => {
    const isValid = await trigger('url', { shouldFocus: true });
    return isValid;
  };

  const handleCheckUrl = async () => {
    if (await validateUrl()) {
      try {
        setChecking(true);
        const url = bookmarkUrl;
        const result = await getUrlMetadataRequest(url);
        const metadata = result.metas;

        if (!isEmpty(metadata)) {
          setUrlMetadata(metadata);
          setValue('name', metadata.title);
          setValue('description', metadata.description);

          if (!isEmpty(metadata.image)) {
            setValue('cover', metadata.image);
          }
        }
        setChecking(false);
      } catch (err) {
        setChecking(false);
        addErrorAlert(getErrorMessage(err));
      }
    }
  };

  const handleOnCloseAssetDrawer = () => {
    setShowAssetDrawer(false);
  };

  const handleOnSelectAsset = (item) => {
    store.cover = item.cover;
    const preparedAsset = prepareAsset(item);
    setCoverAsset(preparedAsset);
    setValue('cover', preparedAsset.cover);
    setShowAssetDrawer(false);
  };

  // ························································
  // RENDER

  const getAssetIcon = useCallback(() => {
    if (type === LIBRARY_FORM_TYPES.BOOKMARKS && !isEmpty(urlMetadata.logo)) {
      return {
        icon: <ImageLoader src={urlMetadata.logo} width={26} height={26} radius={'4px'} />,
      };
    }

    return {};
  }, [type, urlMetadata]);

  const drawerSize = useMemo(() => Math.max(Math.round(viewportWidth * 0.3), 720), [viewportWidth]);

  if (store.alwaysOpen) store.showAdvancedConfig = true;

  return (
    <Box ref={boxRef}>
      <form autoComplete="off">
        <ContextContainer
          title={!hideTitle ? labels.title : undefined}
          divided={!advancedConfigMode}
          sx={(theme) => ({ marginTop: advancedConfigMode ? theme.spacing[4] : 0 })}
        >
          <ContextContainer>
            {!advancedConfigMode ? (
              <>
                {type === LIBRARY_FORM_TYPES.MEDIA_FILES && (
                  <Controller
                    control={control}
                    name="file"
                    shouldUnregister
                    rules={{ required: errorMessages.file?.required || 'Field required' }}
                    render={({ field: { ref, value, ...field } }) => (
                      <FileUpload
                        icon={<CloudUploadIcon height={32} width={32} />}
                        title={labels.browseFile}
                        subtitle={labels.dropFile}
                        errorMessage={{
                          title: 'Error',
                          message: errorMessages.file?.rejected || 'File was rejected',
                        }}
                        hideUploadButton
                        single
                        initialFiles={value ? [value] : []}
                        inputWrapperProps={{ error: errors.file }}
                        accept={onlyImages ? ['image/*'] : undefined}
                        {...field}
                      />
                    )}
                  />
                )}
                {type === LIBRARY_FORM_TYPES.BOOKMARKS && (
                  <Controller
                    control={control}
                    name="url"
                    shouldUnregister
                    rules={{
                      required: errorMessages.url?.required || 'Field required',
                      validate: isValidURL,
                    }}
                    render={({ field }) => (
                      <Stack fullWidth alignItems="end" spacing={4}>
                        <Box style={{ flex: 1 }}>
                          <TextInput
                            label={labels.url}
                            placeholder={placeholders.url}
                            error={errors.url}
                            required
                            {...field}
                            onBlur={validateUrl}
                          />
                        </Box>
                        <Box skipFlex style={{ marginBottom: errors.url ? 18 : 0 }}>
                          <Button
                            color="secondary"
                            leftIcon={<CommonFileSearchIcon />}
                            onClick={handleCheckUrl}
                            loading={checking}
                          >
                            {labels.checkUrl}
                          </Button>
                        </Box>
                      </Stack>
                    )}
                  />
                )}
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: errorMessages.name?.required || 'Field required' }}
                  render={({ field }) => (
                    <TextInput
                      label={labels.name}
                      placeholder={placeholders.name}
                      error={errors.name}
                      required
                      {...getAssetIcon()}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="tagline"
                  rules={
                    !isNil(errorMessages?.tagline?.required) && {
                      required: errorMessages.tagline.required,
                    }
                  }
                  render={({ field }) => (
                    <TextInput
                      label={labels.tagline}
                      placeholder={placeholders.tagline}
                      error={errors.tagline}
                      required={!isNil(errorMessages?.tagline?.required)}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  rules={
                    !isNil(errorMessages?.description?.required) && {
                      required: errorMessages.description.required,
                    }
                  }
                  render={({ field }) => (
                    <Textarea
                      label={labels.description}
                      placeholder={placeholders.description}
                      required={!isNil(errorMessages?.description?.required)}
                      error={errors.description}
                      counter="word"
                      counterLabels={{
                        single: labels?.wordCounter?.single,
                        plural: labels?.wordCounter?.plural,
                      }}
                      showCounter
                      {...field}
                    />
                  )}
                />
                {useTags && (
                  <Controller
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <TagsAutocomplete
                        pluginName={pluginName}
                        type={tagsType}
                        label={labels.tags}
                        labels={{ addButton: labels.addTag }}
                        placeholder={placeholders.tags}
                        {...field}
                      />
                    )}
                  />
                )}
              </>
            ) : null}

            {(!advancedConfigMode && !advancedConfig?.colorToRight) ||
              (advancedConfigMode && advancedConfig?.colorToRight) ? (
              <Controller
                control={control}
                name="color"
                render={({ field }) => (
                  <ColorInput
                    label={labels.color}
                    placeholder={placeholders.color}
                    useHsl
                    compact={false}
                    manual={false}
                    {...field}
                  />
                )}
              />
            ) : null}
          </ContextContainer>
          {(!advancedConfigMode && !advancedConfig?.fileToRight) ||
            (advancedConfigMode && advancedConfig?.fileToRight) ? (
            <>
              {!isImage && (
                <>
                  {advancedConfigMode ? (
                    <InputWrapper label={labels.featuredImage}>
                      <Box sx={(theme) => ({ display: 'flex', gap: theme.spacing[2] })}>
                        <TextInput
                          style={{ width: '100%' }}
                          value={store.coverName}
                          readonly
                          onClick={() => setShowAssetDrawer(true)}
                        />
                        <ActionButton
                          color="primary"
                          size="md"
                          icon={<CloudUploadIcon />}
                          onClick={() => setShowAssetDrawer(true)}
                        />
                      </Box>
                    </InputWrapper>
                  ) : (
                    <ContextContainer
                      subtitle={labels.featuredImage}
                      description={
                        type === LIBRARY_FORM_TYPES.BOOKMARKS && descriptions?.featuredImage
                      }
                    >
                      <Stack direction="row" spacing={3}>
                        {!coverFile && (
                          <Button variant={'outline'} onClick={() => setShowAssetDrawer(true)}>
                            {labels.search}
                          </Button>
                        )}
                        <Controller
                          control={control}
                          name="cover"
                          render={({ field: { ref, value, ...field } }) => (
                            <ImagePreviewInput
                              labels={{
                                changeImage: labels.changeImage,
                                uploadButton: labels.uploadButton,
                              }}
                              previewURL={getCoverUrl(value)}
                              // previewURL={value}
                              value={''}
                              {...field}
                            />
                          )}
                        />
                      </Stack>
                    </ContextContainer>
                  )}
                </>
              )}
            </>
          ) : null}

          {children || null}

          {!advancedConfigMode ? (
            <>
              {isTeacher ? (
                <>
                  {store.programs && !store.alwaysOpen ? (
                    <Switch
                      onChange={(e) => {
                        setValue('program', null);
                        setValue('subjects', null);
                        store.showAdvancedConfig = e;
                        render();
                      }}
                      disabled={store.alwaysOpen}
                      checked={store.alwaysOpen ? true : store.showAdvancedConfig}
                      label={labels.advancedConfig}
                    />
                  ) : null}

                  {store.showAdvancedConfig ? (
                    <ContextContainer subtitle={labels.advancedConfig}>
                      <Controller
                        control={control}
                        name="program"
                        rules={store.programRequired}
                        render={({ field }) => (
                          <Select
                            {...field}
                            error={errors.program}
                            required={!!store.programRequired}
                            label={labels.program}
                            data={store.programs}
                          />
                        )}
                      />
                    </ContextContainer>
                  ) : null}

                  {program ? (
                    <ContextContainer>
                      <Controller
                        control={control}
                        name="subjects"
                        rules={store.subjectRequired}
                        render={({ field }) => (
                          <SelectSubjects
                            {...field}
                            {...labels.subjectSelects}
                            errors={errors}
                            required={!!store.subjectRequired}
                            showLevel={store.showLevel}
                            maxOne={store.maxOneSubject}
                            programId={program}
                          />
                        )}
                      />
                    </ContextContainer>
                  ) : null}
                </>
              ) : null}

              {!hideSubmit && (
                <Stack justifyContent={'end'} fullWidth>
                  <Button onClick={handleSubmit(handleOnSubmit)} loading={loading}>
                    {labels.submitForm}
                  </Button>
                </Stack>
              )}
            </>
          ) : null}
        </ContextContainer>
      </form>
      <AssetListDrawer
        opened={showAssetDrawer}
        onClose={handleOnCloseAssetDrawer}
        size={drawerSize}
        shadow={drawerSize <= 720}
        onSelect={handleOnSelectAsset}
        creatable
        onlyCreateImages
      />
    </Box>
  );
};

LibraryForm.defaultProps = LIBRARY_FORM_DEFAULT_PROPS;
LibraryForm.propTypes = LIBRARY_FORM_PROP_TYPES;

export { LibraryForm };
export default LibraryForm;
