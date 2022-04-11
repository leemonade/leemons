import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
// import { Button, FormControl, Input } from 'leemons--ui';
import { useForm } from 'react-hook-form';
import { useAsync } from '@common/useAsync';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import formWithTheme from '@common/formWithTheme';
import PropTypes from 'prop-types';
import { EmergencyNumbersService } from '../services';

function PhoneNumbersModal({ t, item, onSave = () => {} }) {
  const { t: tCommonForm } = useCommonTranslate('forms');
  const [loading, setLoading] = useState('');
  const [datasetConfig, setDatasetConfig] = useState(null);
  const [datasetData, setDatasetData] = useState(null);
  const [otherRelationValue, setOtherRelationValue] = useState('');
  const [error, setError, ErrorAlert] = useRequestErrorMessage();

  const {
    register,
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  useEffect(() => {
    if (item) {
      setValue('name', item.name);
      setValue('phone', item.phone);
      if (item.relation.startsWith('plugins.')) {
        setValue('relation', item.relation);
      } else {
        setValue('relation', 'other');
        setOtherRelationValue(item.relation);
      }
      if (item.dataset) {
        setDatasetData(item.dataset);
      }
    } else {
      setValue('relation', '...');
    }
  }, []);

  const load = useMemo(
    () => async () => {
      setLoading(true);
      const response = {};
      try {
        const { jsonSchema, jsonUI } = await EmergencyNumbersService.getDatasetForm();
        response.dataset = { jsonSchema, jsonUI };
      } catch (e) {}

      return response;
    },
    []
  );

  const onSuccess = useMemo(
    () =>
      ({ dataset }) => {
        if (dataset) setDatasetConfig(dataset);
      },
    []
  );

  const onError = useMemo(
    () => (e) => {
      // ES: 4001 codigo de que aun no existe schema, como es posible ignoramos el error
      if (e.code !== 4001) {
        setError(e);
      }
      setLoading(false);
    },
    []
  );

  useAsync(load, onSuccess, onError);

  const [form, formActions] = formWithTheme(
    datasetConfig?.jsonSchema,
    datasetConfig?.jsonUI,
    undefined,
    { formData: datasetData }
  );

  const relation = watch('relation');
  const relationError =
    _.get(errors, 'relation') || (isSubmitted && relation === '...')
      ? { message: tCommonForm('required') }
      : null;
  const otherRelationError =
    isSubmitted && !otherRelationValue ? { message: tCommonForm('required') } : null;

  const _onSubmit = (e) => {
    const callback = handleSubmit(onSubmit);
    if (formActions.isLoaded()) formActions.submit();
    callback(e);
  };
  const onSubmit = (e) => {
    if (e.relation === '...') return false;
    if (e.relation === 'other' && !otherRelationValue) return false;
    if (formActions.isLoaded() && formActions.getErrors().length) return false;
    if (e.relation === 'other') e.relation = otherRelationValue;
    if (formActions.isLoaded()) e.dataset = formActions.getValues();
    let data = {};
    if (item) data = { ...item };
    data = { ...data, ...e };
    onSave(data);
  };

  return 'Hay que migrar a bubbles-ui';

  /*
  return (
    <>
      <form id="form-numbers-modal" onSubmit={_onSubmit}>
        <FormControl label={t('name')} className="w-full" formError={_.get(errors, 'name')}>
          <Input
            className="w-full"
            outlined={true}
            {...register('name', { required: tCommonForm('required') })}
          />
        </FormControl>
        <FormControl label={t('phone')} className="w-full" formError={_.get(errors, 'phone')}>
          <Input
            className="w-full"
            outlined={true}
            {...register('phone', {
              required: tCommonForm('required'),
              pattern: {
                value: regex.phone,
                message: tCommonForm('phone'),
              },
            })}
          />
        </FormControl>
        <div className="flex flex-row gap-4">
          <FormControl label={t('relation')} formError={relationError}>
            <RelationSelect
              {...register('relation', {
                required: tCommonForm('required'),
              })}
              color={relationError ? 'error' : null}
              className="w-full max-w-xs"
            />
          </FormControl>
          {relation === 'other' ? (
            <FormControl label={t('specify_relation')} formError={otherRelationError}>
              <Input
                outlined={true}
                value={otherRelationValue}
                onChange={(e) => setOtherRelationValue(e.target.value)}
              />
            </FormControl>
          ) : null}
        </div>
      </form>
      {error ? <ErrorAlert /> : form}
      <div className="flex flex-row justify-end mt-4">
        <Button form="form-numbers-modal" color="primary">
          {t('save')}
        </Button>
      </div>
    </>
  );

   */
}

PhoneNumbersModal.propTypes = {
  t: PropTypes.func,
  item: PropTypes.any,
  onSave: PropTypes.func,
};

export default PhoneNumbersModal;
