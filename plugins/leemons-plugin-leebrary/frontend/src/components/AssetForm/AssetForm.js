import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _, { flatten, isEmpty, isFunction, isNil, noop, toLower } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { getUserProgramsRequest } from '@academic-portfolio/request';
import {
  Box,
  Button,
  ColorInput,
  ContextContainer,
  FileUpload,
  ImageLoader,
  Stack,
  Switch,
  Textarea,
  TextInput,
  TotalLayoutFooterContainer,
  useResizeObserver,
} from '@bubbles-ui/components';
import { CloudUploadIcon, CommonFileSearchIcon } from '@bubbles-ui/icons/outline';
import { TagsAutocomplete, useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import { SubjectPicker } from '@academic-portfolio/components/SubjectPicker';
import { isImageFile, isNullish, isValidURL } from '../../helpers/prepareAsset';
import { getUrlMetadataRequest } from '../../request';
import {
  LIBRARY_FORM_DEFAULT_PROPS,
  LIBRARY_FORM_PROP_TYPES,
  LIBRARY_FORM_TYPES,
} from '../LibraryForm/LibraryForm.constants';
import { ImagePicker } from '../ImagePicker';

const REQUIRED_FIELD = 'Field required';

const FooterContainer = ({ children, scrollRef, drawerLayout }) => {
  if (!drawerLayout) return React.Fragment;
  return (
    <Box sx={(theme) => ({ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 })}>
      <TotalLayoutFooterContainer scrollRef={scrollRef}>{children}</TotalLayoutFooterContainer>
    </Box>
  );
};

FooterContainer.propTypes = {
  children: PropTypes.node,
  scrollRef: PropTypes.any,
  drawerLayout: PropTypes.bool,
};

const AssetForm = ({
  // advancedConfigMode,
  labels,
  placeholders,
  // helps,
  // descriptions,
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
  hideCover,
  advancedConfig,
  hideSubmit,
  onChange = noop,
  ContentExtraFields = null,
  editing,
  drawerLayout,
  acceptedFileTypes,
  categories,
}) => {
  const [store, render] = useStore({
    programs: null,
    showAdvancedConfig: !!asset?.program,
  });
  const [isImage, setIsImage] = useState(
    onlyImages || (categories?.length && categories[0] === 'media-files')
  );
  const [checking, setChecking] = useState(false);
  const [urlMetadata, setUrlMetadata] = useState({});
  const [coverAsset, setCoverAsset] = useState(null);
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [boxRef, rect] = useResizeObserver();

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

  const formForAsset = useForm({ defaultValues });

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = form || formForAsset;

  const formValues = watch();
  const coverFile = watch('cover');
  const assetFile = watch('file');
  const bookmarkUrl = watch('url');
  const program = watch('program');

  async function loadAdvancedConfig() {
    store.programs = null;
    store.alwaysOpen = false;
    store.programRequired = undefined;
    store.subjectRequired = undefined;
    if (advancedConfig?.program?.show) {
      if (advancedConfig.program.required) {
        store.programRequired = { required: errorMessages.program?.required ?? REQUIRED_FIELD };
      }
      if (advancedConfig.alwaysOpen) {
        store.alwaysOpen = advancedConfig.alwaysOpen;
      }
      if (advancedConfig.subjects?.show) {
        store.showSubjects = true;
        store.showLevel = advancedConfig.subjects.showLevel;
        store.maxOneSubject = advancedConfig.subjects.maxOne;
        if (advancedConfig.subjects.required) {
          store.subjectRequired = { required: errorMessages.subject?.required ?? REQUIRED_FIELD };
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
      if (isImageType) {
        // setValue('cover', null);
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

          if (!isEmpty(metadata.video)) {
            setValue('mediaType', 'video');
          } else if (!isEmpty(metadata.audio)) {
            setValue('mediaType', 'audio');
          } else if (
            toLower(metadata.publisher) === 'youtube' ||
            metadata.url?.startsWidth('https://www.youtube')
          ) {
            setValue('mediaType', 'video');
          }
        }
        setChecking(false);
      } catch (err) {
        setChecking(false);
        addErrorAlert(getErrorMessage(err));
      }
    }
  };

  const handleOnSelectAsset = (assetId) => {
    setValue('cover', assetId);
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

  if (store.alwaysOpen) store.showAdvancedConfig = true;

  return (
    <Box ref={boxRef}>
      <form autoComplete="off">
        <ContextContainer>
          <ContextContainer>
            {[
              LIBRARY_FORM_TYPES.MEDIA_FILES,
              LIBRARY_FORM_TYPES.BOOKMARKS,
              'assignables.scorm',
            ].includes(type) && (
              <ContextContainer title={!hideTitle ? labels.title : undefined}>
                {type === LIBRARY_FORM_TYPES.MEDIA_FILES && (
                  <Controller
                    control={control}
                    name="file"
                    shouldUnregister
                    rules={{ required: errorMessages.file?.required ?? REQUIRED_FIELD }}
                    render={({ field: { ref, value, ...field } }) => (
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
                        single
                        initialFiles={value ? flatten([value]) : []}
                        inputWrapperProps={{ error: errors.file }}
                        accept={onlyImages ? ['image/*'] : acceptedFileTypes}
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
                      required: errorMessages.url?.required ?? REQUIRED_FIELD,
                      validate: isValidURL,
                    }}
                    render={({ field }) => (
                      <Stack fullWidth alignItems="end" spacing={4}>
                        <Box style={{ flex: 1 }}>
                          <TextInput
                            {...field}
                            label={labels.url}
                            placeholder={placeholders.url}
                            error={errors.url}
                            required
                            onBlur={validateUrl}
                            disabled={editing}
                          />
                        </Box>
                        <Box skipFlex style={{ marginBottom: errors.url ? 18 : 0 }}>
                          <Button
                            variant="outline"
                            leftIcon={<CommonFileSearchIcon />}
                            onClick={handleCheckUrl}
                            loading={checking}
                            disabled={editing}
                          >
                            {labels.checkUrl}
                          </Button>
                        </Box>
                      </Stack>
                    )}
                  />
                )}

                {type === 'assignables.scorm' && (
                  <>
                    <Controller
                      control={form.control}
                      name="file"
                      shouldUnregister
                      rules={{
                        required: errorMessages.file?.required ?? REQUIRED_FIELD,
                      }}
                      render={({ field: { ref, value, ...field } }) => (
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
                          single
                          initialFiles={value ? flatten([value]) : []}
                          inputWrapperProps={{ error: errors.file }}
                          accept={[
                            'application/octet-stream',
                            'application/zip',
                            'application/x-zip',
                            'application/x-zip-compressed',
                          ]}
                        />
                      )}
                    />
                    {ContentExtraFields}
                  </>
                )}
              </ContextContainer>
            )}
            <ContextContainer title={labels.presentation}>
              {!isImage && !hideCover && (
                <ImagePicker
                  labels={labels}
                  value={coverFile?.id ? coverFile?.id : coverFile}
                  onChange={handleOnSelectAsset}
                />
              )}
              <Controller
                control={control}
                name="name"
                rules={{ required: errorMessages.name?.required ?? REQUIRED_FIELD }}
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
            </ContextContainer>

            {store.programs && !store.alwaysOpen ? (
              <Switch
                onChange={(e) => {
                  store.showAdvancedConfig = e;
                  render();
                }}
                disabled={store.alwaysOpen}
                checked={store.alwaysOpen ? true : store.showAdvancedConfig}
                label={labels.advancedConfig}
              />
            ) : null}

            {store.showAdvancedConfig ? (
              <Controller
                name="subjects"
                control={control}
                rules={store.subjectRequired}
                render={({ field, fieldState: { error } }) => (
                  <SubjectPicker
                    {...field}
                    value={_.map(field.value || [], (subject) =>
                      _.isString(subject) ? subject : subject?.subject
                    )}
                    onChangeRaw={(e) => {
                      if (e.length > 0) {
                        if (!program) setValue('program', e[0].programId);
                      } else if (program) setValue('program', null);
                    }}
                    error={error}
                    assignable={{}}
                    localizations={{
                      title: labels?.programAndSubjects,
                      program: labels?.program,
                      subject: labels?.subjectSelects?.labels?.subject,
                      add: labels?.subjectSelects?.placeholders?.addSubject,
                      course: labels?.course,
                      placeholder: labels?.selectPlaceholder,
                    }}
                    hideSectionHeaders={false}
                    onlyOneSubject={store.maxOneSubject}
                  />
                )}
              />
            ) : null}

            {store.showAdvancedConfig ? (
              <ContextContainer title="Otros">
                {children || null}
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

                <Box style={{ width: 160 }}>
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
                </Box>
              </ContextContainer>
            ) : null}
          </ContextContainer>

          {!hideSubmit && (
            <FooterContainer drawerLayout={drawerLayout}>
              <Stack justifyContent={'end'} fullWidth>
                <Button onClick={() => handleSubmit(handleOnSubmit)()} loading={loading}>
                  {labels.submitForm}
                </Button>
              </Stack>
            </FooterContainer>
          )}
        </ContextContainer>
      </form>
    </Box>
  );
};

AssetForm.defaultProps = LIBRARY_FORM_DEFAULT_PROPS;
AssetForm.propTypes = LIBRARY_FORM_PROP_TYPES;

export { AssetForm };
export default AssetForm;
