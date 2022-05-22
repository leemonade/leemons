import React, { useCallback, useRef, useMemo } from 'react';
import _, { find } from 'lodash';
import PropTypes from 'prop-types';
import { ContextContainer, Alert, Button, Stack, Text, FileUpload } from '@bubbles-ui/components';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import { deleteAssetRequest, newAssetRequest, listCategoriesRequest } from '@leebrary/request';
import { useApi } from '@common';
import handleDeliverySubmission from './handleDeliverySubmission';

function TaggedText({ tag, text }) {
  return (
    <Stack>
      <Text strong>{tag}:&nbsp;</Text>
      <Text>{text}</Text>
    </Stack>
  );
}

TaggedText.propTypes = {
  tag: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default function File({ assignation, onLoading, onSubmit, onError, value }) {
  const [categories] = useApi(listCategoriesRequest);
  const category = (categories || [])?.find(({ key }) => key === 'media-files')?.id;

  const savedFiles = useRef(value);
  const files = useRef();
  const saveSubmission = useMemo(
    () => handleDeliverySubmission(assignation.instance.id, assignation.user),
    [assignation.instance.id, assignation.user]
  );
  const handleSubmit = useCallback(async () => {
    onLoading();

    // 1. Remove the assets saved
    // 2. Save the new assets

    const filesToSave = [files.current].flat().filter((file) => !file.id);
    const filesToRemove = _.difference(savedFiles.current, files.current);
    const filesToKeep = _.difference(savedFiles.current, filesToRemove);

    try {
      if (filesToRemove?.length) {
        await Promise.all(filesToRemove.map((file) => deleteAssetRequest(file.id)));
      }

      let filesSaved = [];

      if (filesToSave?.length) {
        filesSaved = await Promise.all(
          filesToSave.map((file) =>
            newAssetRequest({ file, name: file.name, indexable: false }, category, 'media-files')
          )
        );

        filesSaved = _.map(filesSaved, 'asset');

        // await Promise.all(filesToSave.map((file) => newAsset(file)));
      }
      await saveSubmission([...filesToKeep, ...filesSaved]);
      savedFiles.current = [...filesToKeep, ...filesSaved];

      onSubmit();
    } catch (e) {
      onError(e.message);
    }
  }, [onSubmit, onError, onLoading, category]);
  return (
    <>
      <FileUpload
        icon={<CloudUploadIcon height={32} width={32} />}
        title="Click to browse your file"
        subtitle="or drop here a file from your computer"
        errorMessage={{ title: 'Error', message: 'File was rejected' }}
        hideUploadButton
        multipleUpload
        initialFiles={savedFiles.current || []}
        onChange={(newFiles) => {
          files.current = newFiles;
        }}
        // inputWrapperProps={{ error: errors.file }}
        // accept={onlyImages ? ['image/*'] : undefined}
        // {...field}
      />
      <Stack>
        <Button onClick={handleSubmit}>Upload</Button>
      </Stack>
    </>
  );
  // return (
  //   <>
  //     <TaggedText
  //       tag="Tipo de archivo"
  //       text={`${
  //         submission.data?.multipleFiles ? 'Multiple files of: ' : 'One file of: '
  //       }${submission.data?.extensions?.join(', ')} con un peso máximo de ${
  //         submission.data?.maxSize
  //       }Kb`}
  //     />
  //     <TaggedText tag="Evaluable" text="CONFIG DE EVALUACION" />
  //     <Alert title="Recuerda" severity="info" closeable={false}>
  //       una vez entregado el archivo podrás sustituirlo tantas veces como necesites hasta la fecha
  //       de expiración de la prueba pero solo se guardará la última versión
  //     </Alert>
  //     <Paper color="solid">
  //       <ContextContainer title="Your deliver">DELIVERIES</ContextContainer>
  //     </Paper>
  //     <FileUpload
  //       icon={<CloudUploadIcon height={32} width={32} />}
  //       title="Click to browse your file"
  //       subtitle="or drop here a file from your computer"
  //       errorMessage={{ title: 'Error', message: 'File was rejected' }}
  //       hideUploadButton
  //       single
  //       // initialFiles={value ? [value] : []}
  //       // inputWrapperProps={{ error: errors.file }}
  //       // accept={onlyImages ? ['image/*'] : undefined}
  //       // {...field}
  //     />
  //   </>
  // );
}

File.propTypes = {
  submission: PropTypes.shape({
    data: PropTypes.shape({
      multipleFiles: PropTypes.bool,
      extensions: PropTypes.arrayOf(PropTypes.string),
      maxSize: PropTypes.number,
    }),
  }).isRequired,
};
