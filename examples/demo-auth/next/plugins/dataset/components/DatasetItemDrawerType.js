import React, { useContext } from 'react';
import * as _ from 'lodash';
import { Checkbox, FormControl, Input, Select } from 'leemons-ui';
import DatasetItemDrawerContext from './DatasetItemDrawerContext';
import datasetDataTypes from '../helpers/datasetDataTypes';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

export const DatasetItemDrawerType = () => {
  const { t, tCommon, item, form } = useContext(DatasetItemDrawerContext);
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const type = form.watch('frontConfig.type');

  const dataTypes = _.values(datasetDataTypes);
  return (
    <>
      {/* Tipo de campo / Required / Masked */}
      <div className="flex flex-row">
        {/* Tipo de campo */}
        <div className="flex flex-row justify-between items-center w-7/12">
          <div className="text-sm text-secondary font-medium mr-6">{t('field_type')}</div>
          <div className="w-6/12">
            <FormControl formError={_.get(form.errors, 'frontConfig.type')}>
              <Select
                outlined={true}
                className="w-full max-w-xs"
                {...form.register('frontConfig.type', {
                  required: tCommon('required'),
                })}
              >
                {dataTypes.map(({ type: _type }, index) => (
                  <option key={index} value={_type}>
                    {tCommonTypes(_type)}
                  </option>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="flex flex-row">
          {/* Required */}
          <div className="ml-6">
            <FormControl
              label={t('required')}
              labelPosition="right"
              formError={_.get(form.errors, 'frontConfig.required')}
            >
              <Checkbox
                color="primary"
                {...form.register('frontConfig.required')}
                checked={form.watch('frontConfig.required')}
                onChange={(event) => form.setValue('frontConfig.required', event.target.checked)}
              />
            </FormControl>
          </div>
          {/* Masked */}
          {type === datasetDataTypes.textField.type ? (
            <div className="ml-6">
              <FormControl
                label={t('masked')}
                labelPosition="right"
                formError={_.get(form.errors, 'frontConfig.masked')}
              >
                <Checkbox
                  color="primary"
                  {...form.register('frontConfig.masked')}
                  checked={form.watch('frontConfig.masked')}
                  onChange={(event) => form.setValue('frontConfig.masked', event.target.checked)}
                />
              </FormControl>
            </div>
          ) : null}
        </div>
      </div>

      {/* --------------------------------------------------------------------------------- */}

      {/* Field length */}
      {type === datasetDataTypes.textField.type || type === datasetDataTypes.richText.type ? (
        <div className="flex flex-row mt-6">
          <div className="flex flex-row justify-between items-center w-7/12">
            <div className="text-sm text-secondary font-medium mr-6">{t('field_length')}</div>
            <div className="w-6/12 flex flex-row">
              <div className="flex-1 pr-2 flex flex-row items-center">
                <span className="mr-2">{t('min')}</span>
                <FormControl
                  className="w-full"
                  formError={_.get(form.errors, 'frontConfig.minLength')}
                >
                  <Input
                    className="w-full"
                    type="number"
                    outlined={true}
                    {...form.register('frontConfig.minLength')}
                  />
                </FormControl>
              </div>
              <div className="flex-1 pl-2 flex flex-row items-center">
                <span className="mr-2">{t('max')}</span>
                <FormControl
                  className="w-full"
                  formError={_.get(form.errors, 'frontConfig.maxLength')}
                >
                  <Input
                    className="w-full"
                    type="number"
                    outlined={true}
                    {...form.register('frontConfig.maxLength')}
                  />
                </FormControl>
              </div>
            </div>
          </div>
          {type === datasetDataTypes.textField.type ? (
            <div>
              <div className="ml-6">
                <FormControl
                  label={t('only_numbers')}
                  labelPosition="right"
                  formError={_.get(form.errors, 'frontConfig.onlyNumbers')}
                >
                  <Checkbox
                    color="primary"
                    {...form.register('frontConfig.onlyNumbers')}
                    checked={form.watch('frontConfig.onlyNumbers')}
                    onChange={(event) =>
                      form.setValue('frontConfig.onlyNumbers', event.target.checked)
                    }
                  />
                </FormControl>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Field length */}
      {type === datasetDataTypes.multioption.type ? (
        <div className="flex flex-row mt-6">
          <div className="flex flex-row justify-between items-center w-7/12">
            <div className="text-sm text-secondary font-medium mr-6">{t('number_of_options')}</div>
            <div className="w-6/12 flex flex-row">
              <div className="flex-1 pr-2 flex flex-row items-center">
                <span className="mr-2">{t('min')}</span>
                <FormControl
                  className="w-full"
                  formError={_.get(form.errors, 'frontConfig.minItems')}
                >
                  <Input
                    className="w-full"
                    type="number"
                    outlined={true}
                    {...form.register('frontConfig.minItems')}
                  />
                </FormControl>
              </div>
              <div className="flex-1 pl-2 flex flex-row items-center">
                <span className="mr-2">{t('max')}</span>
                <FormControl
                  className="w-full"
                  formError={_.get(form.errors, 'frontConfig.maxItems')}
                >
                  <Input
                    className="w-full"
                    type="number"
                    outlined={true}
                    {...form.register('frontConfig.maxItems')}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Date from/to */}
      {type === datasetDataTypes.date.type ? (
        <div className="flex flex-row mt-6">
          <div className="flex flex-col">
            <div className="text-sm text-secondary font-medium mb-6">{t('limited_to')}</div>
            <div className="w-6/12 flex flex-row">
              <div className="flex-1 pr-2 flex flex-row items-center">
                <span className="mr-2 text-sm">{t('from')}</span>
                <FormControl
                  className="w-full"
                  formError={_.get(form.errors, 'frontConfig.minDate')}
                >
                  <Input
                    className="w-full"
                    type="date"
                    outlined={true}
                    {...form.register('frontConfig.minDate')}
                  />
                </FormControl>
              </div>
              <div className="flex-1 pl-2 flex flex-row items-center">
                <span className="mr-2 text-sm">{t('to')}</span>
                <FormControl
                  className="w-full"
                  formError={_.get(form.errors, 'frontConfig.maxDate')}
                >
                  <Input
                    className="w-full"
                    type="date"
                    outlined={true}
                    {...form.register('frontConfig.maxDate')}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
