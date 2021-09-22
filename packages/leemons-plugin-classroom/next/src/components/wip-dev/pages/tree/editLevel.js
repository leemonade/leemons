import React, { useEffect, useState } from 'react';
import { Button, FormControl, Tabs, Tab, TabList, TabPanel, Input, Checkbox } from 'leemons-ui';
import { InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useAlerts, Alerts } from '@classroom/components/alerts';
import addLevelSchema from '../../../../services/levelSchemas/addLevelSchema';
import updateLevelSchema from '../../../../services/levelSchemas/updateLevelSchema';

import { useTranslationsDrawer } from '../../../multilanguage/translationsDrawer';
import Translations from './translations';

export default function EditLevel({
  entity = null,
  setEntity = () => {},
  parent,
  onUpdate = () => {},
  locale,
}) {
  const [translations] = useTranslate({ keysStartsWith: 'plugins.classroom.editor' });
  const t = tLoader('plugins.classroom.editor', translations);
  // Translations drawer
  const drawer = useTranslationsDrawer({ warningDefault: true });
  const { toggleDrawer, warnings, defaultLocale } = drawer;

  // Default locale values
  const [values, setValues] = useState({ name: '' });
  // All the localized values
  const [localizations, setLocalizations] = useState({});
  const { register, handleSubmit, setValue } = useForm();

  // Handle alerts (for showing alers)
  const { addAlert, ...alerts } = useAlerts({ icon: ExclamationCircleIcon });

  const setTreeEntity = (entityValues) => {
    if (entity) {
      setEntity({ entity: { ...entity, ...entityValues } });
    } else if (parent) {
      setEntity({ newEntity: entityValues, parent });
    }
  };

  // Update form values if the selected entity changes
  useEffect(() => {
    setValue('isClass', entity ? !!entity.isClass : false);
  }, [entity?.id]);

  useEffect(() => {
    if (locale === defaultLocale) {
      setTreeEntity({ name: values.name });
    }
  }, [values]);
  // On form Submit, create/update entity
  const onSubmit = async (data) => {
    const isNewEntity = !entity;

    // don't save if the default locale is not
    if (!values.name.length) {
      addAlert({ label: 'The level name is required' });
      return;
    }

    // Only save written values
    const localizatedValues = Object.entries(localizations).reduce(
      (obj, [locale, lValues]) =>
        Object.entries(lValues).reduce((obj2, [key, value]) => {
          // When creating entity, ignore empty names
          if (isNewEntity && !value) {
            return obj2;
          }
          return {
            ...obj,
            [key]: { ...obj2[key], [locale]: value },
          };
        }, obj),
      {}
    );

    const levelSchema = {
      names: {
        ...localizatedValues.name,
        [defaultLocale]: values.name,
      },
      isClass: data.isClass,
      parent,
    };

    try {
      if (isNewEntity) {
        const { id, parent: _parent } = await addLevelSchema(levelSchema);
        if (id) {
          setEntity({ ...entity, entity: { ...entity, id, parent: _parent } });
        }
      } else {
        await updateLevelSchema({ ...levelSchema, id: entity.id });
      }
      addAlert({ label: 'Saved successfuly', level: 'success', icon: InformationCircleIcon });
      onUpdate();
    } catch (e) {
      addAlert({ label: 'Unable to save the level' });
    }
  };
  return (
    <>
      <div className="flex-1 my-2 mb-2 bg-primary-content py-6 pl-12 pr-6">
        <Alerts {...alerts} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <div className="flex space-x-2 mb-4">
              <Input
                value={values.name}
                onChange={(e) => {
                  setValues({ ...values, name: e.target.value });
                }}
                outlined
                className="input w-full"
                placeholder={t('form.name.placeholder')}
              />
              <Button color="primary">{t('form.save')}</Button>
            </div>
          </FormControl>
          <FormControl
            className="mb-12 px-4"
            label={
              <>
                {t('form.isClass.label')}{' '}
                <span className="fc_legend">
                  <InformationCircleIcon className={`w-5 h-5 inline mx-2 text-gray-30`} />
                  {t('form.isClass.tooltip')}
                </span>
              </>
            }
            labelPosition="right"
          >
            <Checkbox color="primary" {...register('isClass')} />
          </FormControl>
        </form>
        <div>
          <Button color="primary" link className="pr-1" onClick={toggleDrawer}>
            {t('translations.label')}
          </Button>
          {Object.values(warnings).some((value) => value) && (
            <span className="fc_legend">
              <ExclamationCircleIcon className={`w-3 h-3 inline mr-2 text-error`} />
              {t('translations.tooltip')}
            </span>
          )}
        </div>
        <Tabs>
          <TabList>
            <Tab tabIndex="0" id="Tab1" panelId="Panel1">
              {t('tabs.dataset.label')}
            </Tab>
            <Tab tabIndex="0" id="Tab2" panelId="Panel2">
              {t('tabs.permissions.label')}
            </Tab>
          </TabList>
          <TabPanel id="Panel1" tabId="Tab1" className="p-4">
            <h2>Dataset form</h2>
          </TabPanel>
          <TabPanel id="Panel2" tabId="Tab2" className="p-4">
            <h2>Permissions form</h2>
          </TabPanel>
        </Tabs>
      </div>
      <Translations
        {...drawer}
        defaultLocaleValues={values}
        setDefaultLocaleValues={setValues}
        setTreeEntity={setTreeEntity}
        entityId={entity?.id || null}
        localizations={localizations}
        onSave={setLocalizations}
        locale={locale}
      />
    </>
  );
}

EditLevel.propTypes = {
  entity: PropTypes.object,
  setEntity: PropTypes.func,
  parent: PropTypes.string,
  onUpdate: PropTypes.func,
  locale: PropTypes.string,
};
