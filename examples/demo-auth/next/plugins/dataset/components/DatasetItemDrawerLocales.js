import * as _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import SimpleBar from 'simplebar-react';
import { Button, FormControl, Input, Modal, useModal } from 'leemons-ui';
import update from 'immutability-helper';
import DatasetItemDrawerContext, {
  DatasetItemDrawerLocaleErrorContext,
} from './DatasetItemDrawerContext';
import { getDatasetSchemaFieldLocaleRequest } from '../request';
import datasetDataTypes from '../helpers/datasetDataTypes';
import PlatformLocales from '@multilanguage/components/PlatformLocales';
import { useAsync } from '@common/useAsync';

const LocaleTab = ({ localeConfig, loadedLocales, onLocaleLoaded = () => {} }) => {
  const required = localeConfig.currentLocaleIsDefaultLocale;
  const locale = localeConfig.currentLocale.code;
  const localeName = localeConfig.currentLocale.name;

  const { t, tCommon, form, locationName, pluginName, item } = useContext(DatasetItemDrawerContext);
  const { checkboxLabelsError, setState: setStateLocaleError } = useContext(
    DatasetItemDrawerLocaleErrorContext
  );
  const [error, setError, ErrorAlert] = useRequestErrorMessage();
  const [allCheckboxsHaveLabels, setAllCheckboxsHaveLabels] = useState(false);
  const type = form.watch('frontConfig.type');
  const checkboxValues = form.watch('frontConfig.checkboxValues');
  const checkboxLabels = form.watch(`locales.${locale}.schema.frontConfig.checkboxLabels`);
  const uiType = form.watch('frontConfig.uiType');

  const [modal, toggleModal] = useModal({
    animated: true,
    title: t('options_modal.title'),
    cancelLabel: t('options_modal.cancel'),
    actionLabel: t('options_modal.accept'),
  });

  useEffect(() => {
    if (_.isArray(checkboxValues)) {
      const checkLabels = [];
      _.forEach(checkboxValues, ({ key }, i) => {
        let index = _.findIndex(checkboxLabels, ({ key: _key }) => key === _key);
        if (index < 0) {
          checkLabels.push({ key, label: '' });
        } else {
          checkLabels.push(checkboxLabels[index]);
        }
      });
      if (!_.isEqual(checkLabels, checkboxLabels)) {
        form.setValue(`locales.${locale}.schema.frontConfig.checkboxLabels`, checkLabels);
      }

      if (checkLabels) {
        let allHaveValues = true;
        _.forEach(checkLabels, ({ label }) => {
          if (!label) {
            allHaveValues = false;
            return false;
          }
        });
        setAllCheckboxsHaveLabels(allHaveValues);
        if (required && checkboxLabelsError !== !allHaveValues) {
          setStateLocaleError({ checkboxLabelsError: !allHaveValues });
        }
      }
    }
  }, [form.getValues()]);

  const load = useMemo(
    () => async () => {
      if (loadedLocales.indexOf(locale) < 0 && locationName && pluginName && item && item.id) {
        return await getDatasetSchemaFieldLocaleRequest(locationName, pluginName, locale, item.id);
      }
    },
    []
  );

  const onSuccess = useMemo(
    () => (data) => {
      if (data) {
        const schema = data.schema;
        const ui = data.ui;
        form.setValue(`locales.${locale}.schema.title`, _.get(schema, 'title', ''));
        form.setValue(`locales.${locale}.schema.description`, _.get(schema, 'description', ''));
        form.setValue(
          `locales.${locale}.schema.selectPlaceholder`,
          _.get(schema, 'selectPlaceholder', '')
        );
        form.setValue(`locales.${locale}.schema.optionLabel`, _.get(schema, 'optionLabel', ''));
        form.setValue(
          `locales.${locale}.schema.yesOptionLabel`,
          _.get(schema, 'yesOptionLabel', '')
        );
        form.setValue(`locales.${locale}.schema.noOptionLabel`, _.get(schema, 'noOptionLabel', ''));
        form.setValue(
          `locales.${locale}.schema.frontConfig.checkboxLabels`,
          _.get(schema, 'frontConfig.checkboxLabels', [])
        );

        form.setValue(`locales.${locale}.ui.ui:help`, _.get(ui, 'ui:help', ''));
        onLocaleLoaded(locale);
      }
    },
    []
  );

  const onError = useMemo(
    () => (e) => {
      if (e.code !== 4002) setError(e);
    },
    []
  );

  useAsync(load, onSuccess, onError);

  const inputCheckboxChange = (event, index) => {
    const value = form.getValues(`locales.${locale}.schema.frontConfig.checkboxLabels`);
    value[index].label = event.target.value;
    form.setValue(`locales.${locale}.schema.frontConfig.checkboxLabels`, value);
  };

  if (error) return <ErrorAlert />;

  return (
    <div>
      {/* Label */}
      <div className="flex flex-row py-6">
        <div className="w-4/12">
          <div className="text-sm text-secondary">{t('label_title')}</div>
          <div className="text-sm text-neutral-content">{t('label_description')}</div>
        </div>
        <div className="w-8/12 pl-4">
          <FormControl
            className="w-full"
            formError={_.get(form.errors, `locales.${locale}.schema.title`)}
          >
            <Input
              className="w-full"
              outlined={true}
              {...form.register(`locales.${locale}.schema.title`, {
                required: required ? tCommon('required') : false,
              })}
            />
          </FormControl>
        </div>
      </div>

      {/* Description text */}
      <div className="flex flex-row py-6">
        <div className="w-4/12">
          <div className="text-sm text-secondary">{t('description_text_title')}</div>
          <div className="text-sm text-neutral-content">{t('description_text_description')}</div>
        </div>
        <div className="w-8/12 pl-4">
          <FormControl
            className="w-full"
            formError={_.get(form.errors, `locales.${locale}.schema.description`)}
          >
            <Input
              className="w-full"
              outlined={true}
              {...form.register(`locales.${locale}.schema.description`)}
            />
          </FormControl>
        </div>
      </div>

      {/* Help text */}
      <div className="flex flex-row py-6">
        <div className="w-4/12">
          <div className="text-sm text-secondary">{t('help_text_title')}</div>
          <div className="text-sm text-neutral-content">{t('help_text_description')}</div>
        </div>
        <div className="w-8/12 pl-4">
          <FormControl
            className="w-full"
            formError={_.get(form.errors, `locales.${locale}.ui.ui:help`)}
          >
            <Input
              className="w-full"
              outlined={true}
              {...form.register(`locales.${locale}.ui.ui:help`)}
            />
          </FormControl>
        </div>
      </div>

      {/* Human error
      <div className="flex flex-row py-6">
        <div className="w-4/12">
          <div className="text-sm text-secondary">{t('human_error_title')}</div>
          <div className="text-sm text-neutral-content">{t('human_error_description')}</div>
        </div>
        <div className="w-8/12 pl-4">
          <Input className="w-full" outlined={true} />
        </div>
      </div>
      */}

      {/* First option text */}
      {(type === datasetDataTypes.multioption.type && uiType === 'dropdown') ||
      type === datasetDataTypes.select.type ? (
        <div className="flex flex-row py-6">
          <div className="w-4/12">
            <div className="text-sm text-secondary">{t('first_option_not_eligible')}</div>
          </div>
          <div className="w-8/12 pl-4">
            <FormControl
              className="w-full"
              formError={_.get(form.errors, `locales.${locale}.schema.selectPlaceholder`)}
            >
              <Input
                className="w-full"
                outlined={true}
                {...form.register(`locales.${locale}.schema.selectPlaceholder`)}
              />
            </FormControl>
          </div>
        </div>
      ) : null}

      {/* First option text */}
      {type === datasetDataTypes.boolean.type ? (
        <>
          {uiType === 'checkbox' || uiType === 'switcher' ? (
            <div className="flex flex-row py-6">
              <div className="w-4/12">
                <div className="text-sm text-secondary">{t('option_label')}</div>
                <div className="text-sm text-neutral-content">{t('option_label_description')}</div>
              </div>
              <div className="w-8/12 pl-4">
                <FormControl
                  className="w-full"
                  formError={_.get(form.errors, `locales.${locale}.schema.optionLabel`)}
                >
                  <Input
                    className="w-full"
                    outlined={true}
                    {...form.register(`locales.${locale}.schema.optionLabel`)}
                  />
                </FormControl>
              </div>
            </div>
          ) : null}

          {uiType === 'radio' ? (
            <>
              <div className="flex flex-row py-6">
                <div className="w-4/12">
                  <div className="text-sm text-secondary">{t('yes_label')}</div>
                </div>
                <div className="w-8/12 pl-4">
                  <FormControl
                    className="w-full"
                    formError={_.get(form.errors, `locales.${locale}.schema.yesOptionLabel`)}
                  >
                    <Input
                      className="w-full"
                      outlined={true}
                      {...form.register(`locales.${locale}.schema.yesOptionLabel`)}
                    />
                  </FormControl>
                </div>
              </div>
              <div className="flex flex-row py-6">
                <div className="w-4/12">
                  <div className="text-sm text-secondary">{t('no_label')}</div>
                </div>
                <div className="w-8/12 pl-4">
                  <FormControl
                    className="w-full"
                    formError={_.get(form.errors, `locales.${locale}.schema.noOptionLabel`)}
                  >
                    <Input
                      className="w-full"
                      outlined={true}
                      {...form.register(`locales.${locale}.schema.noOptionLabel`)}
                    />
                  </FormControl>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : null}

      {/* Checkbox options */}
      {type === datasetDataTypes.multioption.type || type === datasetDataTypes.select.type ? (
        <>
          <div className="flex flex-row py-6">
            <div className="w-4/12">
              <div className="text-sm text-secondary">{t('options_title')}</div>
              <div className="text-sm text-neutral-content">{t('options_description2')}</div>
            </div>
            <div className="w-8/12 pl-4">
              <Button type="button" color="primary" text onClick={toggleModal}>
                {t('options_modal.title')}
                {required && !allCheckboxsHaveLabels ? (
                  <span
                    className={`${
                      form.isSubmitted ? 'bg-error' : 'bg-warning'
                    } w-2 h-2 rounded-full  mt-2 ml-2 self-start`}
                  />
                ) : null}
              </Button>
            </div>
          </div>

          <Modal {...modal} className="max-w-xl">
            <div className="text-sm text-secondary">
              {t('options_modal.description', { locale: localeName })}
            </div>

            <div className="flex flex-row pt-6 mb-4">
              <div className="w-4/12 text-sm font-bold">{t('options_modal.value')}</div>
              <div className="w-8/12 text-sm font-bold">
                {t('options_modal.translate_to', { locale: localeName })}
              </div>
            </div>

            <SimpleBar style={{ maxHeight: 'calc(100vh - 300px)' }} className="-mr-4 pr-4 py-1">
              {checkboxValues
                ? checkboxValues.map(({ key, value }) => {
                    let index = _.findIndex(checkboxLabels, ({ key: _key }) => key === _key);

                    if (index < 0) return null;

                    const labelValue = form.getValues(
                      `locales.${locale}.schema.frontConfig.checkboxLabels[${index}].label`
                    );

                    return (
                      <div className="flex flex-row items-center pb-4" key={key}>
                        <div className="w-4/12 text-sm">{value}</div>
                        <div className="w-8/12">
                          <FormControl
                            className="w-full relative"
                            formError={
                              required && form.isSubmitted && !labelValue
                                ? { message: tCommon('required') }
                                : undefined
                            }
                          >
                            <Input
                              className="w-full"
                              outlined={true}
                              value={labelValue}
                              onChange={(e) => inputCheckboxChange(e, index)}
                            />
                          </FormControl>
                        </div>
                      </div>
                    );
                  })
                : null}
            </SimpleBar>
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export const DatasetItemDrawerLocales = () => {
  const [defaultLocale, setDefaultLocale] = useState();
  const [loadedLocales, setLoadedLocales] = useState([]);
  const { form, setState, currentLocale } = useContext(DatasetItemDrawerContext);
  const { checkboxLabelsError } = useContext(DatasetItemDrawerLocaleErrorContext);

  const showDefaultLocaleWarning = useMemo(() => {
    const title = form.getValues(`locales.${defaultLocale}.schema.title`);
    const type = form.getValues('frontConfig.type');
    if (type === datasetDataTypes.select.type || type === datasetDataTypes.multioption.type) {
      return !title || checkboxLabelsError;
    }

    return !title;
  }, [checkboxLabelsError, form.getValues()]);

  const loadLocale = async (e) => {
    if (defaultLocale !== e.defaultLocale) setDefaultLocale(e.defaultLocale);
    if (currentLocale !== e.currentLocale.code) setState({ currentLocale: e.currentLocale.code });
  };

  const onLocaleLoaded = (locale) => {
    setLoadedLocales(update(loadedLocales, { $push: [locale] }));
  };

  return (
    <>
      <PlatformLocales
        showWarning={showDefaultLocaleWarning}
        warningIsError={form.isSubmitted}
        onLocaleChange={loadLocale}
      >
        <LocaleTab loadedLocales={loadedLocales} onLocaleLoaded={onLocaleLoaded} />
      </PlatformLocales>
    </>
  );
};
