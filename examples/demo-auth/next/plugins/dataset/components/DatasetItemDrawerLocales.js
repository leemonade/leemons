import * as _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { FormControl, Input, Tab, TabList, TabPanel, Tabs } from 'leemons-ui';
import { ExclamationIcon } from '@heroicons/react/outline';
import update from 'immutability-helper';
import DatasetItemDrawerContext from './DatasetItemDrawerContext';
import { useAsync } from '@common/useAsync';
import { getDatasetSchemaFieldLocaleRequest } from '../request';
import datasetFields from '../helpers/datasetFields';

const LocaleTab = ({ required, locale, load }) => {
  const { t, tCommon, form } = useContext(DatasetItemDrawerContext);

  useEffect(() => {
    load();
  }, []);

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

          _.forIn(schema, (value, key) => {
            if (datasetFields.schema.indexOf(key) >= 0) {
              form.setValue(`locales.${locale}.schema.${key}`, value);
            }
          });
          _.forIn(ui, (value, key) => {
            if (datasetFields.ui.indexOf(key) >= 0) {
              form.setValue(`locales.${locale}.ui.${key}`, value);
            }
          });
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
