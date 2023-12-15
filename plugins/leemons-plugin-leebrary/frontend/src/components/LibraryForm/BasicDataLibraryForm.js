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
  Text,
  useResizeObserver,
  useViewportSize,
} from '@bubbles-ui/components';
import { CloudUploadIcon, CommonFileSearchIcon } from '@bubbles-ui/icons/outline';
import { TagsAutocomplete, useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import SelectSubjects from '@leebrary/components/SelectSubjects';
import _, { flatten, isEmpty, isFunction, isNil, isString, toLower } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { getFileUrl, prepareAsset } from '../../helpers/prepareAsset';
import { getUrlMetadataRequest } from '../../request';
import { AssetListDrawer } from '../AssetListDrawer';
import {
  LIBRARY_FORM_DEFAULT_PROPS,
  LIBRARY_FORM_PROP_TYPES,
  LIBRARY_FORM_TYPES,
} from './LibraryForm.constants';
import { LibraryCardSkeleton } from '../LibraryCardSkeleton';

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
  return Object.values(obj).every((value) => isNil(value));
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

const BasicDataLibraryForm = ({
  advancedConfigMode,
  labels,
  placeholders,
  errorMessages,
  useTags,
  pluginName,
  tagsType,
  asset,
  children,
  type,
  onlyImages,
  advancedConfig,
  hidePreview,
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

  // #region * FORM --------------------------------------------------------------
  const {
    control,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const formValues = watch();
  const coverFile = watch('cover');
  const assetFile = watch('file');
  const bookmarkUrl = watch('url');
  const program = watch('program');
  // #endregion

  // #region * PROGRAM AND SUBJECT SELECTOR -----------------------------------------
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
    loadAdvancedConfig();
  }, [JSON.stringify(advancedConfig)]);
  // #endregion

  // #region * EFFECTS -------------------------------------------------------------
  useEffect(() => {
    if (_.isObject(coverFile) || store.cover) {
      store.coverName = getCoverName(store.cover || coverFile);
      render();
    }
  }, [coverFile]);

  // When editing an existing asset, we need to prefill the form
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

  // Check for image files, set the corresponding flag and take the name if not set
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

  // If needed, only image files should be supported (cover for an audio file, i.e.)
  useEffect(() => {
    if (!isImage && !isNil(onlyImages)) {
      setIsImage(onlyImages);
    }
  }, [onlyImages, isImage]);
  // #endregion

  // #region * HANDLERS, VALIDATIONS & LOGIC -------------------------------------------
  const validateUrl = async () => trigger('url', { shouldFocus: true });
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

  // Asset drawer
  const handleOnSelectAsset = (item) => {
    store.cover = item.cover;
    const preparedAsset = prepareAsset(item);
    setCoverAsset(preparedAsset);
    setValue('cover', preparedAsset.cover);
    setShowAssetDrawer(false);
  };
  const drawerSize = useMemo(() => Math.max(Math.round(viewportWidth * 0.3), 720), [viewportWidth]);

  // Icon for Bookmarks
  const getAssetIcon = useCallback(() => {
    if (type === LIBRARY_FORM_TYPES.BOOKMARKS && !isEmpty(urlMetadata.logo)) {
      return {
        icon: <ImageLoader src={urlMetadata.logo} width={26} height={26} radius={'4px'} />,
      };
    }

    return {};
  }, [type, urlMetadata]);
  // #endregion

  // #region * STYLES TEMP -------------------------------------------------------------
  const titleTwoStyle = {
    fontFamily: 'Albert Sans',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0em',
    textAlign: 'left',
  };
  // #endregion

  return (
    <Stack ref={boxRef} id={'stack-here'} fullWidth justifyContent="space-between">
      <Box
        id={'form-box-here'}
        style={{ width: hidePreview ? '100%' : 640, marginRight: !hidePreview && 24 }}
      >
        <form autoComplete="off">
          <ContextContainer spacing={8}>
            {/* CONTENIDO */}
            <ContextContainer spacing={4}>
              <Text color="primary" style={titleTwoStyle}>
                {'Contenido HARCODED WITH NO MERCY' || labels.title}
              </Text>
              <>
                {type === LIBRARY_FORM_TYPES.MEDIA_FILES && (
                  <Controller
                    control={control}
                    name="file"
                    render={({ field: { value, ...field } }) => (
                      <FileUpload
                        {...field}
                        icon={<CloudUploadIcon height={32} width={32} />}
                        title={labels.browseFile}
                        subtitle={labels.dropFile}
                        errorMessage={{
                          title: 'Error',
                          message: errorMessages.file?.rejected || 'File was rejected',
                        }}
                        hideUploadButton
                        initialFiles={value ? flatten([value]) : []}
                        single
                        inputWrapperProps={{ error: errors.file }}
                        accept={onlyImages ? ['image/*'] : undefined}
                      />
                    )}
                  />
                )}
                {type === LIBRARY_FORM_TYPES.BOOKMARKS && (
                  <Controller
                    control={control}
                    name="url"
                    shouldUnregister
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
              </>
            </ContextContainer>
            {/* PRESENTACIÓN */}
            <ContextContainer spacing={3}>
              <Text color="primary" style={titleTwoStyle}>
                Presentación HARCODED WITH NO MERCY
              </Text>
              <ContextContainer spacing={6}>
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
                          <ContextContainer>
                            {!coverFile && <Text>{labels.featuredImage}</Text>}
                            <Stack direction="row" spacing={3}>
                              {!coverFile && (
                                <Button
                                  variant={'outline'}
                                  onClick={() => setShowAssetDrawer(true)}
                                >
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

                {!advancedConfigMode ? (
                  <>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <TextInput
                          label={labels.name}
                          placeholder={placeholders.name}
                          error={errors.name}
                          {...getAssetIcon()}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="description"
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
                  </>
                ) : null}
              </ContextContainer>
            </ContextContainer>

            {/*  ADVANCED CONFIG SECTION */}
            <ContextContainer spacing={4}>
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
                        <ContextContainer spacing={9}>
                          <ContextContainer spacing={4}>
                            <Text color="primary" style={titleTwoStyle}>
                              Programas y Asignatures HARCODED WITH NO MERCY
                            </Text>
                            <Stack>
                              <InputWrapper style={{ width: '25%' }}>
                                <Controller
                                  control={control}
                                  name="program"
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
                              </InputWrapper>
                              {program ? (
                                <InputWrapper style={{ width: '75%' }}>
                                  <Controller
                                    control={control}
                                    name="subjects"
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
                                </InputWrapper>
                              ) : null}
                            </Stack>
                          </ContextContainer>
                          <ContextContainer spacing={4}>
                            <Text color="primary" style={titleTwoStyle}>
                              Otros HARCODED WITH NO MERCY
                            </Text>
                            {useTags && (
                              <Controller
                                control={control}
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
                            {children || null}
                            <InputWrapper style={{ width: '25%' }}>
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
                            </InputWrapper>
                          </ContextContainer>
                        </ContextContainer>
                      ) : null}
                    </>
                  ) : null}
                </>
              ) : null}
            </ContextContainer>
          </ContextContainer>
        </form>
      </Box>
      {!hidePreview && (
        <Box style={{ maxWidth: 288, display: 'flex', justifyContent: 'center' }}>
          {/* Reemplazar por la card correspondiente... ¿? */}
          <LibraryCardSkeleton />
        </Box>
      )}

      <AssetListDrawer
        opened={showAssetDrawer}
        onClose={() => setShowAssetDrawer(false)}
        size={drawerSize}
        shadow={drawerSize <= 720}
        onSelect={handleOnSelectAsset}
        creatable
        onlyCreateImages
      />
    </Stack>
  );
};

BasicDataLibraryForm.defaultProps = LIBRARY_FORM_DEFAULT_PROPS;
BasicDataLibraryForm.propTypes = LIBRARY_FORM_PROP_TYPES;

export { BasicDataLibraryForm };
export default BasicDataLibraryForm;
