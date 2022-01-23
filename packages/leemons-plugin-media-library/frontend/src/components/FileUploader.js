import React from 'react';
import { Button, TextInput, FileUpload } from '@bubbles-ui/components';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import { useForm } from '@mantine/hooks';

export default function FileUploader() {
  const { values, setFieldValue, onSubmit } = useForm({
    initialValues: {
      name: '',
      description: '',
      files: [],
    },
  });

  return (
    <form
      onSubmit={onSubmit(() => {
        const data = new FormData();
        data.append('name', values.name);
        data.append('description', values.description);
        values.files.map((file) => data.append('files', file));

        leemons.api('media-library/upload', {
          allAgents: true,
          method: 'POST',
          body: data,
          headers: {
            'content-type': 'none',
          },
        });
      })}
    >
      <TextInput
        label="Name"
        placeholder="Name for the asset"
        name="name"
        required
        value={values.name}
        onChange={(e) => {
          setFieldValue('name', e.currentTarget.value);
        }}
      />
      <TextInput
        label="Description"
        placeholder="Description for the asset"
        name="description"
        required
        value={values.description}
        onChange={(e) => {
          setFieldValue('description', e.currentTarget.value);
        }}
      />

      <FileUpload
        icon={<CloudUploadIcon height={32} />}
        title="Click to browse your file"
        subtitle="or drop here a file from your computer"
        multiple
        onDrop={(files) => {
          setFieldValue('files', files);
        }}
      />

      <Button variant="outline" type="submit">
        Upload
      </Button>
    </form>
  );
}
