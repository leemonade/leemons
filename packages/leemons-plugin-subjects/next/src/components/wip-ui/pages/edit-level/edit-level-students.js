import { useState } from 'react';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import {
  FormControl,
  Radio,
  Badge,
  Button,
  Alert,
  UserCard,
  Avatar,
  Select,
  Input,
} from 'leemons-ui';
import { XIcon, BanIcon } from '@heroicons/react/solid';
import { PlusIcon, InformationCircleIcon, SearchIcon, PencilIcon } from '@heroicons/react/outline';
import Autosuggest from 'react-autosuggest';

export default function EditLevelStudents() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([
    {
      tag: 'Primary',
    },
    {
      tag: 'Principal',
    },
    {
      tag: 'Private',
    },
  ]);

  const [suggestions2, setSuggestions2] = useState([
    {
      name: 'Ana López',
      birthday: '09/04/1983',
      email: 'ana.lopez@coleguay.com',
    },
  ]);
  const [translate] = useTranslate({
    keysStartsWith: 'plugins.classroom.edit_level_page.students',
  });
  const t = tLoader('plugins.classroom.edit_level_page.students', translate);
  console.log(translate);

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Imagine you have a list of languages that you'd like to autosuggest.
  const languages = [
    {
      tag: 'Primary',
    },
    {
      tag: 'Principal',
    },
    {
      tag: 'Private',
    },
  ];

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (_value) => {
    const inputValue = _value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : languages.filter((lang) => lang.tag.toLowerCase().slice(0, inputLength) === inputValue);
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = (suggestion) => suggestion.name;

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion, { isHighlighted }) => (
    <span className={`py-2 px-3 block text-sm font-inter ${isHighlighted ? 'is-focused' : ''}`}>
      {suggestion.tag}
    </span>
  );
  const renderSuggestion2 = (suggestion2, { isHighlighted }) => (
    <span className={`py-2 px-3 block text-sm font-inter ${isHighlighted ? 'is-focused' : ''}`}>
      <UserCard>
        <dl className="basic horizontal">
          <dt className="avatar-container read-only">Avatar</dt>
          <dd className="avatar-container">
            <Avatar circle={true} size={8} className="stroke border-secondary-50">
              <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
            </Avatar>
          </dd>
          <dt className="read-only">Nombre</dt>
          <dd className="user-card-name">{suggestion2.name}</dd>
          <dt className="read-only">F. Naciemiento</dt>
          <dd className="user-card-phone">{suggestion2.birthday}</dd>
          <dt className="read-only">Correo electrónico</dt>
          <dd className="user-card-email">{suggestion2.email}</dd>
        </dl>
      </UserCard> 
    </span>
  );

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value: _value }) => {
    setSuggestions(getSuggestions(_value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: 'Type an email',
    value,
    onChange,
  };

  return (
    <>
      {/* Por TAG No ha realizado búsqueda
          ver: https://vldzx7.axshare.com/#id=3zqoj9&p=03_01_03_02_class_first_edit&sc=3&g=1
     */}

      <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
        <div className=" w-3/12">
          <legend className="edit-section-title text-xl text-secondary">{t('title')}</legend>
          <p className="edit-section-description font-inter text-sm text-secondary-300">
            {t('description')}
          </p>
        </div>
        <div className=" w-9/12">
          <div className="flex flex-nowrap gap-4 mb-3">
            <FormControl label={t('option01')} labelPosition="right">
              <Radio name="opt" checked />
            </FormControl>
            <FormControl label={t('option02')} labelPosition="right">
              <Radio name="opt" />
            </FormControl>
          </div>
          <div className="flex w-full">
            <div className="relative ">
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                alwaysRenderSuggestions={false}
              />

              <Button
                className="btn-circle btn-xs absolute top-2 right-2 text-white"
                title={t('btn_add')}
              >
                <PlusIcon className="inline-block w-4 h-4 stroke-current" />
              </Button>
              {/* Tag seleccionados */}

              <ul className="flex my-3">
                <li>
                  <Badge className="badge-sm">
                    Primary
                    <XIcon className="inline-block w-4 h-4 ml-2 stroke-current" />
                  </Badge>
                </li>
                <li>
                  <Badge className="badge-sm">
                    1 <XIcon className="inline-block w-4 h-4 ml-2 stroke-current" />
                  </Badge>
                </li>
              </ul>

              <Alert color="error" className=" border border-solid border-red-200 bg-red-100">
                <div className="flex-1 items-center">
                  <BanIcon className="w-6 h-6 mx-2 stroke-current" />
                  <label className=" font-inter text-xs text-secondary ">{t('error_long')}</label>
                </div>
              </Alert>

              <Button color="primary" text={true} className=" ">
                <SearchIcon className="inline-block w-4 h-4 mr-2" />
                {t('btn_search')}
              </Button>
            </div>
          </div>
        </div>
      </fielset>
      {/* Por TAG Búsqueda realizada
          ver:  https://vldzx7.axshare.com/#id=qv3jww&p=03_01_03_02b_class_first_edit_-_select_by_tag_2_-_&sc=3&g=1 */}
      <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
        <div className=" w-3/12">
          <legend className="edit-section-title text-xl text-secondary">{t('title')}</legend>
          <p className="edit-section-description font-inter text-sm text-secondary-300">
            {t('description')}
          </p>
        </div>
        <div className=" w-9/12">
          <div className="flex flex-nowrap gap-4 mb-3">
            <FormControl label={t('option01')} labelPosition="right">
              <Radio name="opt01" checked />
            </FormControl>
            <FormControl label={t('option02')} labelPosition="right">
              <Radio name="opt01" />
            </FormControl>
            {/* <FormControl label={t('option03')} labelPosition="right">
              <Radio name="opt01" />
            </FormControl> */}
          </div>
          <div className="flex flex-nowrap w-full relative">
            <ul className="flex mr-2 w-full my-3 border border-gray-30 p-2">
              <li>
                <Badge className="badge-sm">
                  Primary
                  <XIcon className="inline-block w-4 h-4 ml-2 stroke-current" />
                </Badge>
              </li>
              <li>
                <Badge className="badge-sm">
                  1 <XIcon className="inline-block w-4 h-4 ml-2 stroke-current" />
                </Badge>
              </li>
            </ul>
            <Button
              className="btn-circle btn-xs absolute top-5 right-4 text-white"
              title={t('btn_edit')}
            >
              <PencilIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
          </div>
          <div className="flex flex-nowrap w-full relative">
            <Button color="primary" text={true} className=" ">
              <SearchIcon className="inline-block w-4 h-4 mr-2" />
              {t('btn_search_again')}
            </Button>
          </div>
        </div>
      </fielset>

      {/* Busqueda  
          Ver: https://vldzx7.axshare.com/#id=wl4mfs&p=03_01_03_02c_class_first_edit_-_select_individuals&sc=3&g=1 */}
      <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
        <div className=" w-3/12">
          <legend className="edit-section-title text-xl text-secondary">{t('title')}</legend>
          <p className="edit-section-description font-inter text-sm text-secondary-300">
            {t('description')}
          </p>
        </div>
        {/* Por email */}
        <div className=" w-9/12">
          <div>
            <div className="flex flex-nowrap gap-4 mb-3">
              <FormControl label={t('option01')} labelPosition="right">
                <Radio name="opt01" />
              </FormControl>
              <FormControl label={t('option02')} labelPosition="right">
                <Radio name="opt01" checked />
              </FormControl>
            </div>
            <div className="flex flex-col w-full">
              <Alert className="bg-gray-10 mb-4">
                <div className="flex-1 items-center">
                  <InformationCircleIcon className="w- h-4 mx-2 text-gray-50 stroke-current" />
                  <label className=" font-inter text-xs text-secondary ">{t('info_search')}</label>
                </div>
              </Alert>
              <div className="w-full">
                <div className="flex gap-4 w-full mb-4">
                  <div className="w-4/12">
                    <Select outlined>
                      <option selected>{t('option_email')}</option>
                      <option>{t('option_name')}</option>
                      <option>{t('option_surename')}</option>
                      <option>{t('option_birthday')}</option>
                    </Select>
                  </div>
                  <div className="w-8/12 relative">
                    <Autosuggest
                      suggestions={suggestions2}
                      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onSuggestionsClearRequested}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion2}
                      inputProps={inputProps}
                      alwaysRenderSuggestions={false}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <Button color="primary" text={true} className="block">
                    <PlusIcon className="inline-block w-4 h-4 mr-2" />
                    {t('btn_add_selected')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Por otros datos */}
          <div>
            <div className="flex flex-nowrap gap-4 mb-3">
              <FormControl label={t('option01')} labelPosition="right">
                <Radio name="opt" />
              </FormControl>
              <FormControl label={t('option02')} labelPosition="right">
                <Radio name="opt" id="option02" checked />
              </FormControl>
            </div>
            <div className="flex flex-col w-full">
              <Alert className="bg-gray-10 mb-4">
                <div className="flex-1 items-center">
                  <InformationCircleIcon className="w- h-4 mx-2 text-gray-50 stroke-current" />
                  <label className=" font-inter text-xs text-secondary ">{t('info_search')}</label>
                </div>
              </Alert>
              <div className="w-full">
                <div className="flex gap-4 w-full mb-4">
                  <div className="w-4/12">
                    <Select outlined>
                      <option name="op1">{t('option_email')}</option>
                      <option name="op1" selected>
                        {t('option_name')}
                      </option>
                      <option name="op1">{t('option_surename')}</option>
                      <option name="op1">{t('option_birthday')}</option>
                    </Select>
                  </div>
                  <div className="w-8/12 relative">
                    <FormControl>
                      <Input outlined={true} placeholder={t('option_name')}></Input>
                    </FormControl>
                  </div>
                </div>
                <div className="flex gap-4 w-full mb-4">
                  <div className="w-4/12">
                    <Select outlined>
                      <option name="op2">{t('option_email')}</option>
                      <option name="op2">{t('option_name')}</option>
                      <option name="op2">{t('option_surename')}</option>
                      <option name="op2" selected>
                        {t('option_birthday')}
                      </option>
                    </Select>
                  </div>
                  <div className="w-8/12 relative">
                    <FormControl>
                      <Input outlined={true} type="date" placeholder={t('option_birthday')}></Input>
                    </FormControl>
                  </div>
                </div>
                <div className="w-full">
                  <Button color="primary" text={true} className=" ">
                    <SearchIcon className="inline-block w-4 h-4 mr-2" />
                    {t('btn_search2')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </fielset>
    </>
  );
}
