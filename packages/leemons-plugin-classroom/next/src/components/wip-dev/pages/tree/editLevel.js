import React, { useEffect, useState } from 'react';
import { Button, FormControl, Tabs, Tab, TabList, TabPanel, Input, Checkbox } from 'leemons-ui';
import { InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';
import addLevelSchema from '../../../../services/levelSchemas/addLevelSchema';
import updateLevelSchema from '../../../../services/levelSchemas/updateLevelSchema';
// import useTranslationsTabs from '../../../multilanguage/translationsDrawer';
import Translations from './translations';

export default function EditLevel({ entity, parent, onUpdate = () => {} }) {
  // Translations drawer
  // const { toggleTranslations, warnings, ...translationsProps } = useTranslationsTabs({
  //   warningDefault: true,
  // });

  const [name, setName] = useState('');
  const { register, handleSubmit, setValue } = useForm();

  // Update form values if the selected entity changes
  useEffect(() => {
    setName(entity ? entity.name : '');
    setValue('isClass', entity ? !!entity.isClass : false);
  }, [entity]);

  // On form Submit, create/update entity
  const onSubmit = async (data) => {
    const isNewEntity = !entity;

    // Only save written values
    const names = Object.entries(data.names)
      .filter(([, value]) => value?.length)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    const levelSchema = {
      names: {
        en: name,
        ...names,
      },
      isClass: data.isClass,
      parent,
    };

    if (isNewEntity) {
      await addLevelSchema(levelSchema);
    } else {
      await updateLevelSchema({ ...levelSchema, id: entity.id });
    }
    onUpdate();
  };
  return (
    <>
      <div className="flex-1 my-2 mb-2 bg-primary-content py-6 pl-12 pr-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <div className="flex space-x-2 mb-4">
              <Input
                // {...field}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  // onChange(e);
                }}
                outlined
                className="input w-full"
                placeholder="Level name"
              />
              {/* )}
            /> */}
              <Button color="primary">Save level and continue</Button>
            </div>
          </FormControl>
          <FormControl
            className="mb-12 px-4"
            label={
              <>
                Class Level{' '}
                <span className="fc_legend">
                  <InformationCircleIcon className={`w-5 h-5 inline mx-2 text-gray-30`} />
                  Minimum level of student assignment
                </span>
              </>
            }
            labelPosition="right"
          >
            <Checkbox color="primary" {...register('isClass')} />
          </FormControl>
        </form>
        <div>
          <Button color="primary" link className="pr-1" onClick={toggleTranslations}>
            Translations
          </Button>
          {Object.values(warnings).some((value) => value) && (
            <span className="fc_legend">
              <ExclamationCircleIcon className={`w-3 h-3 inline mr-2 text-error`} />
              Untranslated content will appear in the default language
            </span>
          )}
        </div>
        <Tabs>
          <TabList>
            <Tab tabIndex="0" id="Tab1" panelId="Panel1">
              Extra data
            </Tab>
            <Tab tabIndex="0" id="Tab2" panelId="Panel2">
              Permissions
            </Tab>
          </TabList>
          <TabPanel id="Panel1" tabId="Tab1" className="p-4">
            <h2>Any content 1</h2>
          </TabPanel>
          <TabPanel id="Panel2" tabId="Tab2" className="p-4">
            <h2>Any content 2</h2>
          </TabPanel>
        </Tabs>
      </div>
      {/* Translations Drawer */}
      {/* <Translations {...translationsProps} register={register} setName={setName} name={name} /> */}
    </>
  );
}
