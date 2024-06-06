import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Select, TableInput, TextInput, Box, Button, Stack } from '@bubbles-ui/components';
import { map } from 'lodash';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';
import { EvaluationDetailStyles } from '../styles';

const OtherTags = ({ onBeforeRemove, form, inUse }) => {
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));
  const { classes } = EvaluationDetailStyles({});
  const { control, watch, setValue, getValues } = form;
  const [newTag, setNewTag] = useState({ letter: '', description: '', scale: '' });
  const addNewTag = () => {
    const tags = getValues('tags') || [];
    const updatedTags = [...tags, newTag];
    setValue('tags', updatedTags);
    setNewTag({ letter: '', description: '', scale: '' }); // Resetear el estado local después de agregar
  };
  const scales = watch('scales');
  let data = [];
  if (scales) {
    data = map(scales, ({ number }) => ({
      label: number,
      value: number,
    }));
  }

  const tableInputConfig = {
    columns: [
      {
        Header: t('letterLabel'),
        accessor: 'letter',
        input: {
          node: <TextInput />,
          rules: { required: t('errorTypeRequired'), maxLength: 4 },
        },
      },
      {
        Header: t('scalesDescriptionLabel'),
        accessor: 'description',
        input: {
          node: <TextInput />,
          rules: { required: t('errorTypeRequired') },
        },
        cellStyle: {
          maxWidth: '50px',
        },
        style: {
          maxWidth: '50px',
        },
      },
      {
        Header: t('otherTagsRelationScaleLabel'),
        accessor: 'scale',
        input: {
          node: <Select data={data} />,
          rules: { required: t('errorTypeRequired') },
        },
      },
    ],
    labels: {
      add: t('tableAdd'),
      remove: t('tableRemove'),
      edit: t('tableEdit'),
      accept: t('tableAccept'),
      cancel: t('tableCancel'),
    },
  };

  return (
    <Stack direction="column">
      <Box className={classes.inputsTableHeader}>
        <Box className={classes.containerTwentyPercent}>
          <TextInput
            label={t('letterLabel')}
            value={newTag.letter}
            disabled={inUse}
            onChange={(valueLetter) => setNewTag({ ...newTag, letter: valueLetter })}
            placeholder={t('addLetterPlaceholder')}
          />
        </Box>
        <TextInput
          label={t('scalesDescriptionLabel')}
          value={newTag.description}
          disabled={inUse}
          onChange={(valueDescription) => setNewTag({ ...newTag, description: valueDescription })}
          placeholder={t('addTextPlaceholder')}
        />
        <Select
          label={t('otherTagsRelationScaleLabel')}
          data={data}
          value={newTag.scale}
          disabled={inUse}
          onChange={(value) => setNewTag({ ...newTag, scale: value })}
          placeholder={t('addCorelationPlaceholder')}
        />
        <Box className={classes.tableButton}>
          <Button onClick={addNewTag} variant="link" leftIcon={<AddCircleIcon />} disabled={inUse}>
            {t('tableAdd')}
          </Button>
        </Box>
      </Box>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TableInput
            editable
            {...field}
            data={field.value}
            showHeaders={false}
            disabled={inUse}
            {...tableInputConfig}
            onBeforeRemove={onBeforeRemove}
          />
        )}
      />
    </Stack>
  );
};

OtherTags.propTypes = {
  form: PropTypes.object.isRequired,
  onBeforeRemove: PropTypes.func,
  inUse: PropTypes.bool,
};

export { OtherTags };
