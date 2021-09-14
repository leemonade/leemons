import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  Input,
  Checkbox,
  useDrawer,
  Drawer,
} from 'leemons-ui';
import { InformationCircleIcon, ExclamationCircleIcon, XIcon } from '@heroicons/react/solid';
import { useForm, Controller } from 'react-hook-form';
import PlatformLocales from '@multilanguage/components/PlatformLocales';
import addLevelSchema from '../../../../services/levelSchemas/addLevelSchema';
import updateLevelSchema from '../../../../services/levelSchemas/updateLevelSchema';

function TranslationTab({
  localeConfig: {
    currentLocale: { code: locale },
    currentLocaleIsDefaultLocale: isDefault,
  },
  register,
  name,
  setName,
}) {
  <p>Hola</p>;
  // if (isDefault) {
  //   return (
  //     <Input
  //       value={name}
  //       onChange={(e) => {
  //         setName(e.target.value);
  //       }}
  //       outlined
  //       className="input w-full"
  //       placeholder="Level name"
  //     />
  //   );
  // }
  // return (
  //   <Input
  //     {...register(`names.${locale}`)}
  //     outlined
  //     className="input w-full"
  //     placeholder="Level name"
  //   />
  // );
}

export default function EditLevel({ entity, parent, onUpdate = () => {} }) {
  const [name, setName] = useState('');
  const [selectedLocale, setSelectedLocale] = useState(null);
  const { register, handleSubmit, setValue, control } = useForm();
  const [drawer, toggleTranslations] = useDrawer({
    animated: true,
    side: 'right',
  });

  useEffect(() => {
    // setValue('name', entity ? entity.name : '');
    setName(entity ? entity.name : '');
    setValue('isClass', entity ? !!entity.isClass : false);
  }, [entity]);

  const onSubmit = async (data) => {
    const isNewEntity = !entity;

    const levelSchema = {
      names: {
        en: name,
        ...data.names,
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
          {/* <FormControl {...register('name')}> */}
          <div className="flex space-x-2 mb-4">
            {/* <Controller
              control={control}
              name="name"
              render={({ field: { onChange, ...field } }) => ( */}
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
            <button className="btn  btn-primary">Save level and continue</button>
          </div>
          {/* </FormControl> */}
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
          <span className="fc_legend">
            <ExclamationCircleIcon className={`w-3 h-3 inline mr-2 text-error`} />
            Untranslated content will appear in the default language
          </span>
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
      <Drawer {...drawer}>
        <div className="p-6 max-w-sm relative">
          <Button
            className="btn-circle btn-xs ml-8 bg-transparent border-0 absolute top-1 right-1"
            onClick={toggleTranslations}
          >
            <XIcon className="inline-block w-4 h-4 stroke-current" />
          </Button>
          <section>
            {/* TO DO LIBRERIA ICONOS PROPIA - No existe similar a este en HeroIcons */}
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M5 8.75V5.75C5 5.35218 5.15804 4.97064 5.43934 4.68934C5.72064 4.40804 6.10218 4.25 6.5 4.25C6.89782 4.25 7.27936 4.40804 7.56066 4.68934C7.84196 4.97064 8 5.35218 8 5.75V8.75"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 7.25H8"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 11V12.5"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 12.5H20"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 12.5C18.5 12.5 17 17 14 17"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 15.2666C17.3345 15.7654 17.7788 16.1809 18.2988 16.4813C18.8189 16.7817 19.4008 16.959 20 16.9996"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.75 19.25C11.3522 19.25 10.9706 19.092 10.6893 18.8107C10.408 18.5294 10.25 18.1478 10.25 17.75V10.25C10.25 9.85218 10.408 9.47064 10.6893 9.18934C10.9706 8.90804 11.3522 8.75 11.75 8.75H22.25C22.6478 8.75 23.0294 8.90804 23.3107 9.18934C23.592 9.47064 23.75 9.85218 23.75 10.25V17.75C23.75 18.1478 23.592 18.5294 23.3107 18.8107C23.0294 19.092 22.6478 19.25 22.25 19.25H20.75V23.75L16.25 19.25H11.75Z"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.25 13.25L4.25 16.25V11.75H2.75C2.35218 11.75 1.97064 11.592 1.68934 11.3107C1.40804 11.0294 1.25 10.6478 1.25 10.25V2.75C1.25 2.35218 1.40804 1.97064 1.68934 1.68934C1.97064 1.40804 2.35218 1.25 2.75 1.25H13.25C13.6478 1.25 14.0294 1.40804 14.3107 1.68934C14.592 1.97064 14.75 2.35218 14.75 2.75V5.75"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)" />
                </clipPath>
              </defs>
            </svg>
            <h2 className="text-secondary text-xl">Level translation</h2>
            <PlatformLocales>
              <p>HOla</p>
              <TranslationTab register={register} name={name} setName={setName} />
            </PlatformLocales>
            <div className="flex justify-between my-16">
              <Button color="primary" className="btn-link" onClick={toggleTranslations}>
                Cancel{' '}
              </Button>
              <Button color="primary" onClick={toggleTranslations}>
                Save
              </Button>
            </div>
          </section>
        </div>
      </Drawer>
    </>
  );
}
