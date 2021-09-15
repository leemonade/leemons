import React, { useEffect, useState } from 'react';
import { Button, FormControl, Tabs, Tab, TabList, TabPanel, Input, Checkbox } from 'leemons-ui';
import { InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import addLevelSchema from '../../../../services/levelSchemas/addLevelSchema';
import updateLevelSchema from '../../../../services/levelSchemas/updateLevelSchema';

import { useTranslationsDrawer } from '../../../multilanguage/translationsDrawer';
import Translations from './translations';

export default function EditLevel({ entity, parent, onUpdate = () => {} }) {
  // Translations drawer
  const drawer = useTranslationsDrawer({ warningDefault: true });
  const { toggleDrawer, warnings } = drawer;

  const [values, setValues] = useState({ name: '' });
  const { register, handleSubmit, setValue } = useForm();

  // Update form values if the selected entity changes
  useEffect(() => {
    setValues({ name: entity ? entity.name : '' });
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
                value={values.name}
                onChange={(e) => {
                  setValues({ ...values, name: e.target.value });
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
          <Button color="primary" link className="pr-1" onClick={toggleDrawer}>
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
      <Translations {...drawer} defaultLocaleValues={values} setDefaultLocaleValues={setValues} />
    </>
  );
}

EditLevel.propTypes = {
  entity: PropTypes.object,
  parent: PropTypes.string,
  onUpdate: PropTypes.func,
};
