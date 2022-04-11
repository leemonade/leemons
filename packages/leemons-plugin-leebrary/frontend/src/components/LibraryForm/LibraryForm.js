import React, { useCallback, useEffect, useState } from 'react';
import { isFunction, isEmpty, toLower } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  ContextContainer,
  FileUpload,
  ImagePreviewInput,
  TextInput,
  Textarea,
  ColorInput,
  Stack,
  Button,
  ImageLoader,
} from '@bubbles-ui/components';
import { CloudUploadIcon, CommonFileSearchIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useRequestErrorMessage } from '@common';
import {
  LIBRARY_FORM_DEFAULT_PROPS,
  LIBRARY_FORM_PROP_TYPES,
  LIBRARY_FORM_TYPES,
} from './LibraryForm.constants';
import { getUrlMetadataRequest } from '../../request';

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

// -----------------------------------------------------------------------------
// COMPONENT

const LibraryForm = ({
  labels,
  placeholders,
  helps,
  descriptions,
  errorMessages,
  asset,
  onSubmit,
  children,
  loading,
  type,
}) => {
  const [isImage, setIsImage] = useState(false);
  const [checking, setChecking] = useState(false);
  const [urlMetadata, setUrlMetadata] = useState({});
  const [, , , getErrorMessage] = useRequestErrorMessage();

  // ························································
  // FORM SETUP

  const defaultValues = {
    file: asset.file || null,
    name: asset.name || '',
    description: asset.description || '',
    color: asset.color || '',
    coverFile: asset.cover || null,
  };

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const watchCoverFile = watch('coverFile');
  const assetFile = watch('file');
  const bookmarkUrl = watch('url');

  useEffect(() => {
    if (!isEmpty(assetFile)) {
      setIsImage(isImageFile(assetFile));
    }
  }, [assetFile]);

  // ························································
  // HANDLERS

  const handleOnSubmit = (e) => {
    if (!isEmpty(e.file) && e.file.length === 1) [e.file] = e.file;
    if (asset.id) e.id = asset.id;
    if (urlMetadata?.logo) e.icon = urlMetadata.logo;
    if (isFunction(onSubmit)) onSubmit(e);
  };

  const validateUrl = async () => {
    const isValid = await trigger('url', { shouldFocus: true });
    console.log('isValid:', isValid);
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
            setValue('coverFile', metadata.image);
          }
        }
        setChecking(false);
      } catch (err) {
        setChecking(false);
        addErrorAlert(getErrorMessage(err));
      }
    }
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

  return (
    <Box>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <ContextContainer title={labels.title} divided>
          <ContextContainer>
            {type === LIBRARY_FORM_TYPES.MEDIA_FILES && (
              <Controller
                control={control}
                name="file"
                shouldUnregister
                rules={{ required: errorMessages.file || 'Field required' }}
                render={({ field: { ref, value, ...field } }) => (
                  <FileUpload
                    icon={<CloudUploadIcon height={32} width={32} />}
                    title="Click to browse your file"
                    subtitle="or drop here a file from your computer"
                    errorMessage={{ title: 'Error', message: 'File was rejected' }}
                    hideUploadButton
                    single
                    initialFiles={value ? [value] : []}
                    inputWrapperProps={{ error: errors.file }}
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
                  required: errorMessages.url || 'Field required',
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
                        size="sm"
                        color="tertiary"
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
              rules={{ required: errorMessages.name || 'Field required' }}
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
              render={({ field }) => (
                <Textarea
                  label={labels.description}
                  placeholder={placeholders.description}
                  {...field}
                />
              )}
            />
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
          </ContextContainer>
          {!isImage && (
            <ContextContainer
              subtitle={labels.featuredImage}
              description={type === LIBRARY_FORM_TYPES.BOOKMARKS && descriptions?.featuredImage}
            >
              <Stack direction="row" spacing={3}>
                {!watchCoverFile && <Button variant={'outline'}>Search from library</Button>}
                <Controller
                  control={control}
                  name="coverFile"
                  render={({ field: { ref, value, ...field } }) => (
                    <ImagePreviewInput
                      labels={{
                        changeImage: labels.changeImage,
                        uploadButton: labels.uploadButton,
                      }}
                      previewURL={value}
                      {...field}
                    />
                  )}
                />
              </Stack>
            </ContextContainer>
          )}
          {children}
          <Stack justifyContent={'end'} fullWidth>
            <Button type="submit" loading={loading}>
              {labels.submitForm}
            </Button>
          </Stack>
        </ContextContainer>
      </form>
    </Box>
  );
};

LibraryForm.defaultProps = LIBRARY_FORM_DEFAULT_PROPS;
LibraryForm.propTypes = LIBRARY_FORM_PROP_TYPES;

export { LibraryForm };
export default LibraryForm;
