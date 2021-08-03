import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { FormControl, Input, Tab, TabList, TabPanel, Tabs } from 'leemons-ui';
import { ExclamationIcon } from '@heroicons/react/outline';
import update from 'immutability-helper';

const LocaleTab = ({
  t,
  tCommon,
  item,
  required,
  locale,
  onChange,
  register,
  errors,
  setValue,
  getValues,
  load,
}) => {
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
          <FormControl className="w-full" formError={_.get(errors, `locales.${locale}.title`)}>
            <Input
              className="w-full"
              outlined={true}
              {...register(`locales.${locale}.title`, {
                required: required ? tCommon('required') : false,
              })}
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
            formError={_.get(errors, `locales.${locale}.description`)}
          >
            <Input
              className="w-full"
              outlined={true}
              {...register(`locales.${locale}.description`)}
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

export const DatasetItemDrawerLocales = ({
  t,
  tCommon,
  item,
  register,
  errors,
  setValue,
  getValues,
  onChange = () => {},
}) => {
  const [loading, setLoading] = useState(true);
  const [profileError, setError, ErrorAlert] = useRequestErrorMessage();
  const [defaultLocale, setDefaultLocale] = useState();
  const [locales, setLocales] = useState([]);
  const [loadedLocales, setLoadedLocales] = useState([]);

  const loadLocale = async (locale) => {
    if (loadedLocales.indexOf(locale) < 0) {
      // TODO: Cargamos del backend si es que tenemos item
      setLoadedLocales(update(loadedLocales, { $push: [locale] }));
    }
  };

  const getDefaultLocale = async () => {
    const { locale } = await getDefaultPlatformLocaleRequest();
    setDefaultLocale(locale);
    return locale;
  };

  const getLocales = async (_defaultLocale) => {
    const { locales: _locales } = await getPlatformLocalesRequest();
    const localeIndex = _.findIndex(_locales, { locale: _defaultLocale });
    if (localeIndex >= 0) {
      const locale = _locales[localeIndex];
      _locales.splice(localeIndex, 1);
      _locales.unshift(locale);
    }
    setLocales(_locales);
  };

  const init = async () => {
    try {
      setLoading(true);
      const _defaultLocale = await getDefaultLocale();
      await getLocales(_defaultLocale);
      setLoading(false);
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <ErrorAlert />
      {!loading && !profileError ? (
        <div>
          <Tabs>
            <TabList>
              {locales.map(({ name, code }) => (
                <Tab key={code} id={`id-${code}`} panelId={`panel-${code}`}>
                  {_.get(errors, `locales.${defaultLocale}`) && code === defaultLocale ? (
                    <ExclamationIcon className="w-4 h-4 mr-2 text-error-focus" />
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
                  t={t}
                  item={item}
                  register={register}
                  errors={errors}
                  tCommon={tCommon}
                  setValue={setValue}
                  getValues={getValues}
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
