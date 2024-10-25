import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

import { NumberInput, TableInput, TextInput, Stack, Box, Button } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { find, forEach, isNil } from 'lodash';
import PropTypes from 'prop-types';

import { EvaluationDetailStyles } from '../styles';

import prefixPN from '@grades/helpers/prefixPN';

const Scales = ({ selectData, form, onBeforeRemove, inUse }) => {
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));
  const { control, watch, getValues, setValue } = form;
  const [newScale, setNewScale] = useState({ letter: '', number: null, description: '' });
  const { classes } = EvaluationDetailStyles({});
  const addNewScale = () => {
    const scales = getValues('scales');
    const updatedScales = [...scales, newScale];
    setValue('scales', updatedScales);
    setNewScale({ letter: '', number: 0, description: '' });
  };
  const type = find(selectData.type, { value: watch('type') });
  const isPercentage = watch('isPercentage');

  const tableConfig = {
    numberHeader: '',
    numberStep: null,
    numberPrecision: null,
    addLetterColumn: false,
  };
  if (type) {
    if (type.value === 'numeric') {
      tableConfig.numberHeader = !isPercentage ? t('numberLabel') : t('percentageLabel');
      tableConfig.numberStep = isPercentage ? 0.05 : 0.005;
      tableConfig.numberPrecision = isPercentage ? 2 : 4;
    }
    if (type.value === 'letter') {
      tableConfig.numberHeader = t('scalesNumericalEquivalentLabel');
      tableConfig.numberStep = 0.0005;
      tableConfig.numberPrecision = 4;
      tableConfig.addLetterColumn = true;
    }
  }
  const tableInputConfig = {
    columns: [],
    labels: {
      add: t('tableAdd'),
      remove: t('tableRemove'),
      edit: t('tableEdit'),
      accept: t('tableAccept'),
      cancel: t('tableCancel'),
    },
  };

  if (tableConfig.addLetterColumn) {
    tableInputConfig.columns.push({
      Header: t('letterLabel'),
      accessor: 'letter',
      input: {
        node: <TextInput />,
        rules: { required: t('errorTypeRequired'), maxLength: 2 },
      },
      cellStyle: {
        width: '60px',
      },
      style: {
        width: '60px',
      },
    });
  }

  tableInputConfig.columns.push({
    Header: tableConfig.numberHeader,
    accessor: 'number',
    cellStyle: {
      width: '40px',
    },
    style: {
      width: '40px',
    },
    input: {
      node: (
        <NumberInput
          step={tableConfig.numberStep}
          precision={tableConfig.numberPrecision}
          customDesign
        />
      ),
      rules: { required: t('errorTypeRequired'), max: isPercentage ? 100 : undefined },
    },
  });

  tableInputConfig.columns.push({
    Header: t('scalesDescriptionLabel'),
    accessor: 'description',
    input: {
      node: <TextInput />,
      rules: { required: t('errorTypeRequired') },
    },
    cellStyle: {
      paddingLeft: getPaddingLeft(type.value, inUse, isPercentage),
    },
  });

  function _onBeforeRemove(e) {
    return onBeforeRemove(e, getValues());
  }

  function onChange(newData, event, field) {
    if (event.type === 'edit') {
      const oldN = event.oldItem.number;
      const newN = event.newItem.number;
      const minScaleToPromote = getValues('minScaleToPromote');
      const tags = getValues('tags');
      if (oldN?.toString() === minScaleToPromote?.toString()) setValue('minScaleToPromote', newN);
      if (tags) {
        forEach(tags, (tag) => {
          // eslint-disable-next-line no-param-reassign
          if (tag.scale.toString() === oldN.toString()) tag.scale = newN;
        });
        setValue('tags', tags);
      }
    }
    field.onChange(newData);
  }

  const tableButtonLetterDisabled =
    type.value === 'letter' &&
    (!newScale.letter || isNil(newScale.number) || !newScale.description);
  const tableButtonNumericDisabled =
    type.value === 'numeric' && (isNil(newScale.number) || !newScale.description);
  return (
    <Stack>
      <Stack direction="column" fullWidth>
        <Box className={classes.inputsTableHeader}>
          {type && type.value === 'letter' && (
            <TextInput
              label={t('letterLabel')}
              value={newScale.letter}
              onChange={(e) => setNewScale({ ...newScale, letter: e })}
              placeholder={t('letterLabel')}
              maxLength={2}
              disabled={inUse}
              required
            />
          )}
          <NumberInput
            label={isPercentage ? t('percentageLabel') : t('numberLabel')}
            value={newScale.number}
            onChange={(value) => setNewScale({ ...newScale, number: value })}
            placeholder={isPercentage ? t('percentageLabel') : t('numberLabel')}
            customDesign
            disabled={inUse}
            precision={3}
            step={1}
            min={0}
            max={isPercentage ? 100 : undefined}
            required
          />
          <Box className={classes.scalesDescription}>
            <TextInput
              label={t('scalesDescriptionLabel')}
              value={newScale.description}
              disabled={inUse}
              onChange={(e) => setNewScale({ ...newScale, description: e })}
              placeholder={t('scalesDescriptionLabel')}
              required
            />
          </Box>
          <Box className={classes.tableButton}>
            <Button
              variant="link"
              size="md"
              leftIcon={<AddCircleIcon />}
              onClick={addNewScale}
              disabled={tableButtonLetterDisabled || tableButtonNumericDisabled}
            >
              {t('addScoreButton')}
            </Button>
          </Box>
        </Box>
        <Controller
          name="scales"
          control={control}
          rules={{
            required: t('errorTypeRequired'),
          }}
          render={({ field }) => (
            <TableInput
              editable
              {...field}
              onChange={(e1, e2) => onChange(e1, e2, field)}
              data={field.value}
              showHeaders={false}
              disabled={inUse}
              onBeforeRemove={_onBeforeRemove}
              {...tableInputConfig}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};

function getPaddingLeft(typeValue, inUse, isPercentage) {
  if (typeValue === 'numeric') {
    if (isPercentage) {
      return inUse ? '24px' : '44px';
    } else {
      return inUse ? '64px' : '104px';
    }
  } else if (typeValue === 'letter') {
    return inUse ? '0px' : '60px';
  } else {
    return '64px';
  }
}

Scales.propTypes = {
  form: PropTypes.object.isRequired,
  selectData: PropTypes.object.isRequired,
  onBeforeRemove: PropTypes.func,
  inUse: PropTypes.bool,
};

export { Scales };
