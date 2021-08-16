import React, { useContext } from 'react';
import * as _ from 'lodash';
import { Button, Checkbox, FormControl, ImageLoader, Input, Select } from 'leemons-ui';
import DatasetItemDrawerContext from './DatasetItemDrawerContext';
import datasetDataTypes from '../helpers/datasetDataTypes';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

export const DatasetItemDrawerType = () => {
  const { t, tCommon, item, form } = useContext(DatasetItemDrawerContext);
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const type = form.watch('frontConfig.type');
  const checkboxValues = form.watch('frontConfig.checkboxValues');

  const dataTypes = _.values(datasetDataTypes);

  const addNewOption = () => {
    let checkboxs = form.getValues(`frontConfig.checkboxValues`);
    if (!_.isArray(checkboxs)) checkboxs = [];
    const newKey = new Date().getTime();
    checkboxs.push({ key: newKey, value: '' });
    form.setValue(`frontConfig.checkboxValues`, checkboxs);
  };

  const removeOption = (key) => {
    const checkboxs = form.getValues(`frontConfig.checkboxValues`);
    const index = _.findIndex(checkboxs, { key });
    if (index >= 0) {
      checkboxs.splice(index, 1);
      form.setValue(`frontConfig.checkboxValues`, checkboxs);
    }
  };

  const inputCheckboxChange = (event, index) => {
    const value = form.getValues(`frontConfig.checkboxValues`);
    value[index].value = event.target.value;
    form.setValue(`frontConfig.checkboxValues`, value);
  };

  const { onChange: onChangeTypeProperty, ...restRegisterTypeProperties } = form.register(
    'frontConfig.type',
    {
      required: tCommon('required'),
    }
  );

  const onChangeType = (event) => {
    form.unregister('frontConfig.uiType');
    onChangeTypeProperty(event);
  };

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
                {...restRegisterTypeProperties}
                onChange={onChangeType}
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
                <span className="mr-2 text-sm">{t('min')}</span>
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
                <span className="mr-2 text-sm">{t('max')}</span>
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

      {/* Boolean */}
      {type === datasetDataTypes.boolean.type ? (
        <>
          {/* Boolean ui type */}
          <div className="flex flex-row mt-6">
            <div className="flex flex-row justify-between items-center w-7/12">
              <div className="w-6/12">
                <div className="text-sm text-secondary font-medium mr-6">{t('show_as')}</div>
                <div className="text-sm text-neutral-content">{t('show_as_description')}</div>
              </div>
              <div className="w-6/12">
                <FormControl formError={_.get(form.errors, 'frontConfig.type')}>
                  <Select
                    outlined={true}
                    className="w-full max-w-xs"
                    {...form.register('frontConfig.uiType', {
                      required: tCommon('required'),
                    })}
                  >
                    <option value="checkbox">{tCommonTypes('boolean_types.checkbox')}</option>
                    <option value="radio">{tCommonTypes('boolean_types.radio')}</option>
                    <option value="switcher">{tCommonTypes('boolean_types.switcher')}</option>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Boolean initial status */}
          <div className="flex flex-row mt-6">
            <div className="flex flex-row justify-between items-center w-7/12">
              <div className="w-6/12">
                <div className="text-sm text-secondary font-medium mr-6">{t('initial_status')}</div>
              </div>
              <div className="w-6/12">
                <FormControl formError={_.get(form.errors, 'frontConfig.initialStatus')}>
                  <Select
                    outlined={true}
                    className="w-full max-w-xs"
                    {...form.register('frontConfig.initialStatus')}
                  >
                    {form.watch('frontConfig.uiType') === 'radio' ? (
                      <option value="-">{tCommonTypes('boolean_initial_status.nothing')}</option>
                    ) : null}
                    <option value="no">{tCommonTypes('boolean_initial_status.no')}</option>
                    <option value="yes">{tCommonTypes('boolean_initial_status.yes')}</option>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Field length */}
      {type === datasetDataTypes.multioption.type ? (
        <>
          {/* Multioption ui type */}
          <div className="flex flex-row mt-6">
            <div className="flex flex-row justify-between items-center w-7/12">
              <div className="w-6/12">
                <div className="text-sm text-secondary font-medium mr-6">{t('show_as')}</div>
                <div className="text-sm text-neutral-content">{t('show_as_description')}</div>
              </div>
              <div className="w-6/12">
                <FormControl formError={_.get(form.errors, 'frontConfig.type')}>
                  <Select
                    outlined={true}
                    className="w-full max-w-xs"
                    {...form.register('frontConfig.uiType', {
                      required: tCommon('required'),
                    })}
                  >
                    <option value="dropdown">{tCommonTypes('multioption_types.dropdown')}</option>
                    <option value="checkboxs">{tCommonTypes('multioption_types.checkboxs')}</option>
                    <option value="radio">{tCommonTypes('multioption_types.radio')}</option>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Multioption min/max */}
          {form.watch('frontConfig.uiType') !== 'radio' ? (
            <div className="flex flex-row mt-6">
              <div className="flex flex-row justify-between items-center w-7/12">
                <div className="text-sm text-secondary font-medium mr-6">
                  {t('number_of_options')}
                </div>
                <div className="w-6/12 flex flex-row">
                  <div className="flex-1 pr-2 flex flex-row items-center">
                    <span className="mr-2 text-sm">{t('min')}</span>
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
                    <span className="mr-2 text-sm">{t('max')}</span>
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
        </>
      ) : null}

      {/* Multioption values */}
      {type === datasetDataTypes.multioption.type || type === datasetDataTypes.select.type ? (
        <div className="pt-6 w-7/12">
          <div className="mb-4">
            <div className="text-sm text-secondary font-medium">{t('options_title')}</div>
            <div className="text-sm text-neutral-content">{t('options_description')}</div>
          </div>
          <div>
            {checkboxValues
              ? checkboxValues.map((value, index) => {
                  return (
                    <div key={value.key} className="pb-4">
                      <FormControl
                        className="w-full relative"
                        formError={_.get(form.errors, `frontConfig.checkboxValues[${index}].value`)}
                      >
                        <Input
                          className="w-full"
                          outlined={true}
                          value={_.get(checkboxValues, `[${index}].value`)}
                          onChange={(e) => inputCheckboxChange(e, index)}
                        />
                        <div
                          onClick={() => removeOption(value.key)}
                          className="absolute right-3 text-neutral-content hover:text-error cursor-pointer"
                          style={{ width: '12px', height: '12px', top: '14px' }}
                        >
                          <ImageLoader
                            className="stroke-current fill-current"
                            src={'/assets/svgs/remove.svg'}
                          />
                        </div>
                      </FormControl>
                    </div>
                  );
                })
              : null}
            <Button type="button" color="secondary" onClick={addNewOption}>
              {t('add_option')}
            </Button>
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
