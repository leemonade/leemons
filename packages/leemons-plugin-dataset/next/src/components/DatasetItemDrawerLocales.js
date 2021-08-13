import * as _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { Button, FormControl, ImageLoader, Input, Tab, TabList, TabPanel, Tabs } from 'leemons-ui';
import { ExclamationIcon } from '@heroicons/react/outline';
import update from 'immutability-helper';
import DatasetItemDrawerContext from './DatasetItemDrawerContext';
import { useAsync } from '@common/useAsync';
import { getDatasetSchemaFieldLocaleRequest } from '../request';
import datasetDataTypes from '../helpers/datasetDataTypes';

const LocaleTab = ({ required, locale, load, defaultLocale }) => {
  const { t, tCommon, form } = useContext(DatasetItemDrawerContext);
  const type = form.watch('frontConfig.type');

  useEffect(() => {
    load();
  }, []);

  const addNewOption = () => {
    let checkboxs = form.getValues(`frontConfig.checkboxValues`);
    if (!_.isArray(checkboxs)) checkboxs = [];
    const newKey = new Date().getTime();
    checkboxs.push({ key: newKey, value: `val${newKey}` });
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
    const value = form.getValues(`locales.${locale}.schema.frontConfig.checkboxLabels[${index}]`);
    value.label = event.target.value;
    form.setValue(`locales.${locale}.schema.frontConfig.checkboxLabels[${index}]`, value);
  };

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

      {/* Checkbox options */}
      {type === datasetDataTypes.multioption.type ? (
        <div className="flex flex-row py-6">
          <div className="w-4/12">
            <div className="text-sm text-secondary">{t('options_title')}</div>
            <div className="text-sm text-neutral-content">{t('options_description')}</div>
          </div>
          <div className="w-8/12 pl-4">
            {form.watch(`frontConfig.checkboxValues`)
              ? form.watch(`frontConfig.checkboxValues`).map(({ key }) => {
                  let index = _.findIndex(
                    form.getValues(`locales.${locale}.schema.frontConfig.checkboxLabels`),
                    ({ key: _key }) => key === _key
                  );

                  if (index < 0) {
                    let values = form.getValues(
                      `locales.${locale}.schema.frontConfig.checkboxLabels`
                    );
                    if (!_.isArray(values)) values = [];
                    values.push({ key, label: '' });
                    form.setValue(`locales.${locale}.schema.frontConfig.checkboxLabels`, values);
                    index = values.length - 1;
                  }

                  return (
                    <div key={key} className="pb-4">
                      <FormControl
                        className="w-full relative"
                        formError={_.get(
                          form.errors,
                          `locales.${locale}.schema.frontConfig.checkboxLabels[${index}].label`
                        )}
                      >
                        <Input
                          className="w-full"
                          outlined={true}
                          value={form.watch(
                            `locales.${locale}.schema.frontConfig.checkboxLabels[${index}].label`
                          )}
                          onChange={(e) => inputCheckboxChange(e, index)}
                        />
                        {locale === defaultLocale ? (
                          <div
                            onClick={() => removeOption(key)}
                            className="absolute right-3 text-neutral-content hover:text-error cursor-pointer"
                            style={{ width: '12px', height: '12px', top: '14px' }}
                          >
                            <ImageLoader
                              className="stroke-current fill-current"
                              src={'/assets/svgs/remove.svg'}
                            />
                          </div>
                        ) : null}
                      </FormControl>
                    </div>
                  );
                })
              : null}
            {locale === defaultLocale ? (
              <Button type="button" color="secondary" onClick={addNewOption}>
                {t('add_option')}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const DatasetItemDrawerLocales = () => {
  const [loading, setLoading] = useState(true);
  const [profileError, setError, ErrorAlert] = useRequestErrorMessage();
  const [defaultLocale, setDefaultLocale] = useState();
  const [locales, setLocales] = useState([]);
  const [loadedLocales, setLoadedLocales] = useState([]);
  const { form, setState, locationName, pluginName, item } = useContext(DatasetItemDrawerContext);

  const loadLocale = async (locale) => {
    setState({ currentLocale: locale });
    if (loadedLocales.indexOf(locale) < 0) {
      if (locationName && pluginName && item && item.id) {
        try {
          const { schema, ui } = await getDatasetSchemaFieldLocaleRequest(
            locationName,
            pluginName,
            locale,
            item.id
          );

          console.log(schema);

          form.setValue(`locales.${locale}.schema.title`, _.get(schema, 'title', ''));
          form.setValue(`locales.${locale}.schema.description`, _.get(schema, 'description', ''));
          form.setValue(
            `locales.${locale}.schema.frontConfig.checkboxLabels`,
            _.get(schema, 'frontConfig.checkboxLabels', [])
          );

          form.setValue(`locales.${locale}.ui['ui:help']}`, _.get(ui, 'ui:help', ''));
        } catch (e) {
          if (e.code !== 4002) setError(e);
        }
      }
      setLoadedLocales(update(loadedLocales, { $push: [locale] }));
    }
  };

  const load = useMemo(
    () => async () => {
      const { locale } = await getDefaultPlatformLocaleRequest();
      const { locales: _locales } = await getPlatformLocalesRequest();
      return { locale, locales: _locales };
    },
    []
  );

  const onSuccess = useMemo(
    () => ({ locale, locales: _locales }) => {
      const localeIndex = _.findIndex(_locales, { locale: locale });
      if (localeIndex >= 0) {
        const locale = _locales[localeIndex];
        _locales.splice(localeIndex, 1);
        _locales.unshift(locale);
      }
      setDefaultLocale(locale);
      setLocales(_locales);
      setLoading(false);
    },
    []
  );

  const onError = useMemo(
    () => (e) => {
      setError(e);
    },
    []
  );

  useAsync(load, onSuccess, onError);

  return (
    <>
      <ErrorAlert />
      {!loading && !profileError ? (
        <div>
          <Tabs>
            <TabList>
              {locales.map(({ name, code }) => (
                <Tab key={code} id={`id-${code}`} panelId={`panel-${code}`}>
                  {code === defaultLocale &&
                  !form.watch(`locales.${defaultLocale}.schema.title`) ? (
                    <ExclamationIcon
                      className={`w-4 h-4 mr-2 ${
                        _.get(form.errors, `locales.${defaultLocale}`)
                          ? 'text-error-focus'
                          : 'text-warning-focus'
                      }`}
                    />
                  ) : null}
                  {name}
                </Tab>
              ))}
            </TabList>

            {locales.map(({ code }) => (
              <TabPanel key={code} id={`panel-${code}`} tabId={`id-${code}`}>
                <LocaleTab
                  locale={code}
                  defaultLocale={defaultLocale}
                  required={code === defaultLocale}
                  load={() => loadLocale(code)}
                />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      ) : null}
    </>
  );
};
