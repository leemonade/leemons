import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Drawer, Button, Tabs, TabPanel, Text, Box } from '@bubbles-ui/components';
import { PassportIcon } from '@bubbles-ui/icons/solid';
import { useLocale } from '@common/LocaleDate';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import LanguageTabContent from './LanguageTabContent';

import { useGetLocales } from '@multilanguage/helpers/getLocales';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

const AddCustomTranslationDrawer = ({
  size = 'md',
  keys = {},
  buttonVariant = 'link',
  ButtonIcon,
  hideButtonIcon,
  buttonLabel,
  disabled,
  onSave,
  data, // Each plugin is responsible for providing the data to be edited
  loading,
}) => {
  const { t } = useCommonTranslate('customTranslationsDrawer');

  const [open, setOpen] = useState(false);
  const form = useForm();

  const userLocale = useLocale();
  const { data: allLocalesData } = useGetLocales();

  const languages = useMemo(() => {
    if (!allLocalesData) return [];
    return allLocalesData
      ?.filter((locale) => locale.code !== userLocale)
      ?.map((locale) => ({
        key: locale.code,
        name: locale.name,
        id: locale.id,
      }));
  }, [allLocalesData, userLocale]);

  const sortedLanguages = useMemo(
    () => languages.sort((a, b) => a.name.localeCompare(b.name)),
    [languages]
  );

  useEffect(() => {
    form.reset();
  }, [JSON.stringify(keys)]);

  useEffect(() => {
    if (!isEmpty(data)) {
      languages.forEach((language) => {
        Object.entries(data?.[language.key] ?? {}).forEach(([copyKey, value]) => {
          form.setValue(`${language.key}.${copyKey}`, value);
        });
      });
    }
  }, [data, languages, form]);

  // HANDLERS ------------------------------------------------------------------------- ||

  const onSubmit = (formData) => {
    const filteredData = Object.entries(formData).reduce((acc, [lang, translations]) => {
      const filteredTranslations = Object.fromEntries(
        Object.entries(translations).filter(([_, value]) => value !== undefined)
      );
      if (Object.keys(filteredTranslations).length > 0) {
        acc[lang] = filteredTranslations;
      }
      return acc;
    }, {});

    const dataWithUserLocale = {
      ...filteredData,
      [userLocale]: { ...keys },
    };

    onSave(dataWithUserLocale);
    onCancel();
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <>
      <Box style={{ textAlign: 'left' }}>
        <Button
          variant={buttonVariant}
          onClick={() => setOpen(true)}
          leftIcon={
            hideButtonIcon ? null : ButtonIcon ? (
              <ButtonIcon />
            ) : (
              <PassportIcon height={20} width={20} />
            )
          }
          disabled={disabled || isEmpty(keys)}
        >
          {buttonLabel || t('title')}
        </Button>
      </Box>

      <Drawer size={size} opened={open} onClose={onCancel}>
        <Drawer.Header title={t('title')} />
        <Drawer.Content>
          {languages?.length ? (
            <Tabs>
              {sortedLanguages.map((language) => (
                <TabPanel key={language.key} label={language.name}>
                  <LanguageTabContent t={t} form={form} language={language} copies={keys} />
                </TabPanel>
              ))}
            </Tabs>
          ) : (
            <Text>{t('noLanguages')}</Text>
          )}
        </Drawer.Content>
        <Drawer.Footer>
          <Drawer.Footer.LeftActions>
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {t('cancel')}
            </Button>
          </Drawer.Footer.LeftActions>
          <Drawer.Footer.RightActions>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={!languages?.length || loading}>
              {t('save')}
            </Button>
          </Drawer.Footer.RightActions>
        </Drawer.Footer>
      </Drawer>
    </>
  );
};

AddCustomTranslationDrawer.propTypes = {
  size: PropTypes.string,
  keys: PropTypes.shape({
    value: PropTypes.string,
    key: PropTypes.string,
  }),
  buttonVariant: PropTypes.string,
  ButtonIcon: PropTypes.func,
  hideButtonIcon: PropTypes.bool,
  buttonLabel: PropTypes.string,
  disabled: PropTypes.bool,
  onSave: PropTypes.func,
  data: PropTypes.object,
  loading: PropTypes.bool,
};

export default AddCustomTranslationDrawer;
