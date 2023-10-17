import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, TextInput, FileUpload } from '@bubbles-ui/components';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';

export default function FileUploader() {
  const defaultValues = {
    name: '',
    description: '',
    files: [],
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const data = new FormData();
        data.append('name', values.name);
        data.append('description', values.description);
        values.files.map((file) => data.append('files', file));

        leemons.api('leebrary/upload', {
          allAgents: true,
          method: 'POST',
          body: data,
          headers: {
            'content-type': 'none',
          },
        });
      })}
      autoComplete="off"
    >
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Required Field' }}
        render={({ field }) => (
          <TextInput
            label="Name"
            placeholder="Name for the asset"
            required
            error={errors.name}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        rules={{ required: 'Required Field' }}
        render={({ field }) => (
          <TextInput
            label="Description"
            placeholder="Description for the asset"
            required
            error={errors.description}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="files"
        rules={{ required: 'Required Field' }}
        render={({ field: { onChange, ...field } }) => (
          <FileUpload
            icon={<CloudUploadIcon height={32} />}
            title="Click to browse your file"
            subtitle="or drop here a file from your computer"
            multiple
            hideUploadButton
            error={errors.files}
            {...field}
          />
        )}
      />

      <Button variant="outline" type="submit">
        Upload
      </Button>
    </form>
  );
}
