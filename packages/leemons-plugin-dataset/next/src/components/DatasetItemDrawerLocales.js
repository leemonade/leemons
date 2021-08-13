import * as _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import SimpleBar from 'simplebar-react';
import {
  Button,
  FormControl,
  Input,
  Modal,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  useModal,
} from 'leemons-ui';
import { ExclamationIcon } from '@heroicons/react/outline';
import update from 'immutability-helper';
import DatasetItemDrawerContext, {
  DatasetItemDrawerLocaleErrorContext,
} from './DatasetItemDrawerContext';
import { useAsync } from '@common/useAsync';
import { getDatasetSchemaFieldLocaleRequest } from '../request';
import datasetDataTypes from '../helpers/datasetDataTypes';

const LocaleTab = ({ required, locale, localeName, load }) => {
  const { t, tCommon, form } = useContext(DatasetItemDrawerContext);
  const { checkboxLabelsError, setState: setStateLocaleError } = useContext(
    DatasetItemDrawerLocaleErrorContext
  );
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

  useEffect(() => {
    load();
  }, []);

  const inputCheckboxChange = (event, index) => {
    const value = form.getValues(`locales.${locale}.schema.frontConfig.checkboxLabels`);
    value[index].label = event.target.value;
    form.setValue(`locales.${locale}.schema.frontConfig.checkboxLabels`, value);
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
  const [loading, setLoading] = useState(true);
  const [profileError, setError, ErrorAlert] = useRequestErrorMessage();
  const [defaultLocale, setDefaultLocale] = useState();
  const [locales, setLocales] = useState([]);
  const [loadedLocales, setLoadedLocales] = useState([]);
  const { form, setState, locationName, pluginName, item } = useContext(DatasetItemDrawerContext);
  const { checkboxLabelsError } = useContext(DatasetItemDrawerLocaleErrorContext);

  const showDefaultLocaleWarning = useMemo(() => {
    const title = form.getValues(`locales.${defaultLocale}.schema.title`);
    const type = form.getValues('frontConfig.type');
    if (type === datasetDataTypes.select.type || type === datasetDataTypes.multioption.type) {
      return !title || checkboxLabelsError;
    }

    return !title;
  }, [checkboxLabelsError, form.getValues()]);

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
            `locales.${locale}.schema.selectPlaceholder`,
            _.get(schema, 'selectPlaceholder', '')
          );
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
                  {code === defaultLocale && showDefaultLocaleWarning ? (
                    <ExclamationIcon
                      className={`w-4 h-4 mr-2 ${
                        form.isSubmitted ? 'text-error-focus' : 'text-warning-focus'
                      }`}
                    />
                  ) : null}
                  {name}
                </Tab>
              ))}
            </TabList>

            {locales.map(({ code, name }) => (
              <TabPanel key={code} id={`panel-${code}`} tabId={`id-${code}`}>
                <LocaleTab
                  locale={code}
                  localeName={name}
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
