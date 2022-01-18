import React, { useEffect, useState } from 'react';
import { Button, FormControl, Select, Input, Checkbox, Textarea, Label, Radio } from 'leemons-ui';
import { InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useAlerts, Alerts } from '@subjects/components/alerts';
import addLevelSchema from '../../../services/levelSchemas/addLevelSchema';
import updateLevelSchema from '../../../services/levelSchemas/updateLevelSchema';

import { useTranslationsDrawer } from '../../multilanguage/translationsDrawer';
import Translations from './translations';
import useDirtyState from '../../../hooks/useDirtyState';
import ExitWithoutSaving from './exitWithoutSaving';

export default function EditLevel({
  entity = null,
  parent,
  locale,
  setEntity = () => {},
  onUpdate = () => {},
  onClose = () => {},
}) {
  const [showSaveWithouSaving, setShowSaveWithouSaving] = useState(false);
  const [translations] = useTranslate({ keysStartsWith: 'plugins.subjects.editor' });
  const t = tLoader('plugins.subjects.editor', translations);
  // Translations drawer
  const drawer = useTranslationsDrawer({ warningDefault: true });
  const { toggleDrawer, warnings, defaultLocale } = drawer;

  // Default locale values
  const {
    value: dirtyValue,
    setValue: dirtySetValue,
    setDefaultValue: dirtySetDefaultValue,
    defaultValue: dirtyDefaultValue,
    isDirty,
  } = useDirtyState({ localizations: {}, defaultLocale: { name: '' } });
  // All the localized values
  // TODO: If localizations exists, it denotes they are dirty
  const { register, handleSubmit, setValue } = useForm();

  // Handle alerts (for showing alers)
  const { addAlert, ...alerts } = useAlerts({ icon: ExclamationCircleIcon });

  // Update tree entity while editing
  const setTreeEntity = (entityValues) => {
    if (entity) {
      // Already existing entity
      setEntity({ entity: { ...entity, ...entityValues } });
    } else if (parent) {
      // New entity
      setEntity({ newEntity: entityValues, parent });
    }
  };

  // Update tree entity if the user locale is equal to the platform locale
  // If not, handled by translations
  useEffect(() => {
    if (locale === defaultLocale) {
      setTreeEntity({ name: dirtyValue.defaultLocale.name });
    }
  }, [dirtyValue.defaultLocale]);

  // Update form values if the selected entity changes
  useEffect(() => {
    setValue('isSubject', entity ? !!entity.isSubject : false);

    // Clear previous entity localizations
    dirtySetDefaultValue({ ...dirtyDefaultValue, localizations: {} });
    dirtySetValue({ ...dirtyValue, localizations: {} });
  }, [entity?.id]);

  // On form Submit, create/update entity
  const onSubmit = async (data) => {
    const isNewEntity = !entity;

    // Don't save if the default locale is not filled
    if (!dirtyValue.defaultLocale.name.length) {
      addAlert({ label: 'The level name is required' });
      return;
    }

    // Only save filled values
    const localizatedValues = Object.entries(dirtyValue.localizations).reduce(
      (obj, [vLocale, lValues]) =>
        Object.entries(lValues).reduce((obj2, [key, value]) => {
          // When creating entity, ignore empty names
          if (isNewEntity && !value) {
            return obj2;
          }
          return {
            ...obj,
            [key]: { ...obj2[key], [vLocale]: value },
          };
        }, obj),
      {}
    );

    const levelSchema = {
      names: {
        ...localizatedValues.name,
        [defaultLocale]: dirtyValue.defaultLocale.name,
      },
      isClass: data.isClass,
      parent,
    };

    try {
      if (isNewEntity) {
        const { id, parent: _parent } = await addLevelSchema(levelSchema);
        if (id) {
          // Update the currently edited entity to the new entity
          setEntity({ ...entity, entity: { ...entity, id, parent: _parent } });
        }
      } else {
        await updateLevelSchema({ ...levelSchema, id: entity.id });
      }

      addAlert({ label: 'Saved successfuly', level: 'success', icon: InformationCircleIcon });

      // Trigger parent update event (ideally, updates the tree entities)
      onUpdate();
    } catch (e) {
      addAlert({ label: 'Unable to save the level' });
    }
  };

  const handleClose = (force = false) => {
    if (force === true || !isDirty()) {
      onClose();
    } else {
      setShowSaveWithouSaving(true);
    }
  };
  return (
    <>
      <ExitWithoutSaving
        isShown={showSaveWithouSaving}
        onDiscard={() => {
          setShowSaveWithouSaving(false);
          handleClose(true);
        }}
        onCancel={() => {
          setShowSaveWithouSaving(false);
        }}
      />
      <div className="flex flex-col flex-1 relative">
        {/* EDIT DATA */}
        <div className="flex flex-col flex-1 p-12 overflow-y-scroll">
          {/* ·······················································
          ALERTS BADGES */}
          <Alerts {...alerts} />
          {/* ·······················································
          MAIN FORM */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormControl>
                <Input
                  value={dirtyValue.defaultLocale.name}
                  onChange={(e) => {
                    dirtySetValue({
                      ...dirtyValue,
                      defaultLocale: { ...dirtyValue.defaultLocale, name: e.target.value },
                    });
                  }}
                  outlined
                  className="input-lg w-full"
                  placeholder={t('form.name.placeholder')}
                />
              </FormControl>

              <FormControl
                label={
                  <>
                    {t('form.isSubject.label')}{' '}
                    <span className="fc_legend">
                      <InformationCircleIcon className={`w-5 h-5 inline mx-2 text-gray-30`} />
                      {t('form.isSubject.tooltip')}
                    </span>
                  </>
                }
                labelPosition="right"
              >
                <Checkbox color="primary" asToggle {...register('isSubject')} />
              </FormControl>

              <FormControl>
                <Textarea
                  value={dirtyValue.defaultLocale.description}
                  onChange={(e) => {
                    dirtySetValue({
                      ...dirtyValue,
                      defaultLocale: { ...dirtyValue.defaultLocale, description: e.target.value },
                    });
                  }}
                  outlined
                  className="w-full"
                  placeholder={t('form.description.placeholder')}
                />
              </FormControl>
            </div>
          </form>
          {/* ·······················································
          TRANSLATIONS */}
          <div className="flex items-center gap-2 my-4">
            <Button color="primary" outlined rounded onClick={toggleDrawer} className="btn-sm">
              {t('translations.label')}
            </Button>
            {Object.values(warnings).some((value) => value) && (
              <span className="fc_legend">
                <ExclamationCircleIcon className={`w-3 h-3 inline mr-2 text-error`} />
                {t('translations.tooltip')}
              </span>
            )}
          </div>
          {false && (
            <>
              {/* -------------------------------------------------------
          TEACHING */}
              <div className="border-t border-gray-20 my-4" />
              <div className="max-w-lg flex flex-col py-4">
                <h2 className="text-xl font-normal">Teaching</h2>
                <div className="page-description text-sm">
                  <p>
                    How is this subject taught? Yearly, half-yearly... indicate the formats in which
                    each subject is taught.
                  </p>
                </div>
                <div className="mt-4 max-w-sm">
                  <Select outlined multiple>
                    <option disabled selected>
                      Add type
                    </option>
                    {'Daily Weekly Fortnightly Monthly Quarterly Quarterly Semiannual Yearly'
                      .split(' ')
                      .map((item, i) => (
                        <option key={`o-${i}`} value={item}>
                          {item}
                        </option>
                      ))}
                  </Select>
                </div>
              </div>

              {/* -------------------------------------------------------
          COURSES */}
              <div className="border-t border-gray-20 my-4" />
              <div className="max-w-lg flex flex-col py-4">
                <h2 className="text-xl font-normal">Courses and hours per course</h2>
                <div className="page-description text-sm">
                  <p>
                    This information will make it possible to define in which stages and courses the
                    subject is taught and how many hours per week it covers (stages are inherited
                    from the structure defined in Classroom).
                  </p>
                </div>
                <div className="mt-4">
                  <FormControl label="Fixed stages" labelPosition="right" className="font-normal">
                    <Radio name="opt" color="primary" checked />
                  </FormControl>
                  <div className="text-sm font-inter pl-8 text-gray-300 mb-4">
                    (use this system if the subject must be taken at a specific stage).
                  </div>
                  <FormControl
                    label="Recommended stages"
                    labelPosition="right"
                    className="font-normal"
                  >
                    <Radio name="opt" color="primary" />
                  </FormControl>
                  <div className="text-sm font-inter pl-8 text-gray-300">
                    (use this system if the planning of subjects is only a recommendation and
                    students can take them at a time of their choice).
                  </div>
                </div>
                <div className="mt-4">
                  <FormControl label="Add hours" labelPosition="right" className="font-normal">
                    <Checkbox
                      color="primary"
                      asToggle
                      onChange={(e) => dirtySetValue({ ...dirtyValue, addHours: e.target.checked })}
                    />
                  </FormControl>
                  {dirtyValue && dirtyValue.addHours && (
                    <div className="mt-4 max-w-sm">
                      <Select outlined multiple>
                        <option disabled selected>
                          Add temporality
                        </option>
                        {'Daily Weekly Fortnightly Monthly Quarterly Quarterly Semiannual Yearly'
                          .split(' ')
                          .map((item, i) => (
                            <option key={`o-${i}`} value={item}>
                              {item}
                            </option>
                          ))}
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* -------------------------------------------------------
          CREDITS */}
              <div className="border-t border-gray-20 my-4" />
              <div className="max-w-lg flex flex-col py-4">
                <h2 className="text-xl font-normal">Credits</h2>
                <div className="page-description text-sm">
                  <p>
                    Activate the Credit system if your students can study the subjects of this level
                    indistinctly in order to obtain an evaluable knowledge.
                  </p>
                </div>
                <div className="mt-4">
                  <FormControl label="Credit system" labelPosition="right" className="font-normal">
                    <Checkbox
                      color="primary"
                      asToggle
                      onChange={(e) =>
                        dirtySetValue({ ...dirtyValue, useCredits: e.target.checked })
                      }
                    />
                  </FormControl>
                  {dirtyValue && dirtyValue.useCredits && (
                    <div className="mt-6">
                      <div className="font-inter font-normal text-gray-300">
                        Credit specification
                      </div>
                      <div className="flex gap-8 mt-4">
                        {'Minimum Recommended Maximum'.split(' ').map((item, i) => (
                          <FormControl
                            key={`c-${i}`}
                            label={item}
                            labelPosition="right"
                            className="font-inter"
                          >
                            <Checkbox />
                          </FormControl>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* -------------------------------------------------------
          VISUAL IDENTIFICATION */}
              <div className="border-t border-gray-20 my-4" />
              <div className="max-w-lg flex flex-col py-4">
                <h2 className="text-xl font-normal">Visual Identification </h2>
                <div className="page-description text-sm">
                  <p>
                    You can allow your centre's administration to upload an icon and/or add a colour
                    for each level.
                  </p>
                  <p>
                    Accessibility: if you have students with visual impairment, activate the use of
                    an icon as a minimum.
                  </p>
                </div>

                <div className="flex flex-col gap-1 mt-4">
                  {'Icon Color'.split(' ').map((item, i) => (
                    <FormControl
                      key={`c-${i}`}
                      label={item}
                      labelPosition="right"
                      className="font-inter"
                    >
                      <Checkbox />
                    </FormControl>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* -------------------------------------------------------
          DATASET */}
          <div className="border-t border-gray-20 my-4" />
          <div className="max-w-lg flex flex-col py-4">
            <h2 className="text-xl font-normal">Extra data</h2>
          </div>
        </div>

        {/* BUTTON BAR */}
        <div className="flex justify-end gap-2 py-6 px-12">
          <Button type="button" color="secondary" text onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" color="primary">
            {t('form.save')}
          </Button>
        </div>
      </div>

      {/* TRANSLATIONS DRAWER */}
      <Translations
        {...drawer}
        defaultLocaleValues={dirtyValue.defaultLocale}
        setDefaultLocaleValues={(newValue, dirty = true) => {
          dirtySetValue({ ...dirtyValue, defaultLocale: newValue });
          if (!dirty) {
            dirtySetDefaultValue({ ...dirtyDefaultValue, defaultLocale: newValue });
          }
        }}
        setTreeEntity={setTreeEntity}
        entityId={entity?.id || null}
        localizations={dirtyValue.localizations}
        onSave={(newValue) => dirtySetValue({ ...dirtyValue, localizations: newValue })}
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
  onClose: PropTypes.func,
  locale: PropTypes.string,
};
