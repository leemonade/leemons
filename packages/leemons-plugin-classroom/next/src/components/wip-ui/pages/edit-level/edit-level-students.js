import { useState } from 'react';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { FormControl, Radio, Badge, Button, Alert } from 'leemons-ui';
import { XIcon, BanIcon } from '@heroicons/react/solid';
import { PlusIcon, SearchIcon, PencilIcon } from '@heroicons/react/outline';
import Autosuggest from 'react-autosuggest';
import ListTable from './search-list-table';

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
    placeholder: 'Type a programming language',
    value,
    onChange,
  };

  return (
    <>
      {/* No ha realizado búsqueda
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
          <div className="flex flex-nowrap justify-between mb-3">
            <FormControl label={t('option01')} labelPosition="right">
              <Radio name="opt" checked />
            </FormControl>
            <FormControl label={t('option02')} labelPosition="right">
              <Radio name="opt" />
            </FormControl>
            <FormControl label={t('option03')} labelPosition="right">
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
      {/* Búsqueda realizada
          ver:  https://vldzx7.axshare.com/#id=qv3jww&p=03_01_03_02b_class_first_edit_-_select_by_tag_2_-_&sc=3&g=1 */}
      <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
        <div className=" w-3/12">
          <legend className="edit-section-title text-xl text-secondary">{t('title')}</legend>
          <p className="edit-section-description font-inter text-sm text-secondary-300">
            {t('description')}
          </p>
        </div>
        <div className=" w-9/12">
          <div className="flex flex-nowrap justify-between mb-3">
            <FormControl label={t('option01')} labelPosition="right">
              <Radio name="opt" checked />
            </FormControl>
            <FormControl label={t('option02')} labelPosition="right">
              <Radio name="opt" />
            </FormControl>
            <FormControl label={t('option03')} labelPosition="right">
              <Radio name="opt" />
            </FormControl>
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
    </>
  );
}
