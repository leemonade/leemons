import { useState } from 'react';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { FormControl, Radio, Badge, Button, Alert } from 'leemons-ui';
import { XIcon, BanIcon } from '@heroicons/react/solid';
import { PlusIcon, SearchIcon, PencilIcon } from '@heroicons/react/outline';
import Autosuggest from 'react-autosuggest';
import ListTable from './search-list-table';
import ListTable2 from './search-list-table-radio';

export default function SearchResults() {
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
      {/* Tabla de resultados por Tags */}
      <div className="flex flex-col w-full relative bg-gray-10 p-6 mb-12">
        <div>
          <h3 className=" text-base font-medium text-secondary-300 mb-6">
            {t('title_results')} <strong className=" text-secondary-600">20 {t('title')}</strong>
          </h3>
          <Alert color="error" className=" border border-solid border-red-200 bg-red-50 mb-6">
            <div className="flex-1 items-center">
              <BanIcon className="w-6 h-6 mx-2 stroke-current" />
              <label className=" font-inter text-xs text-secondary ">{t('error_repeat')}</label>
            </div>
          </Alert>
        </div>
        <div>
          <Button color="primary" className="mr-4 inline-block">
            <PlusIcon className="inline-block w-4 h-4 mr-2" />
            {t('btn_add_selected')}
          </Button>
          <span class="font-inter"> 3 {t('counter_label')}</span>
        </div>
        <ListTable></ListTable>
        {/* Falta darle estilos al paginador */}
      </div>

      {/* Tabla de resultados por otos datos */}
      {/* --- sin resultados --- */}
      <Alert color="error" className=" border border-solid border-red-200 bg-red-50 mb-6 mr-6">
        <div className="flex-1 items-center">
          <XIcon className="w-6 h-6 mx-2 stroke-current" />
          <label className=" font-inter text-xs text-secondary ">{t('error_not_found')}</label>
        </div>
      </Alert>
      {/* --- con resultados --- */}
      <div className="flex flex-col w-full relative bg-gray-10 p-6 mb-12">
        <div>
          <h3 className=" text-base font-medium text-secondary-300 mb-6">
            {t('title_results')} <strong className=" text-secondary-600">2 {t('title')}</strong>
            {t('results_by_name')}
            <strong className=" text-secondary-600">Ana</strong>
            {t('results_by_birthdate')}
            <strong className=" text-secondary-600">09/04/2010</strong>
          </h3>
        </div>
        <div>
          <Button color="primary" className="mr-4 inline-block">
            <PlusIcon className="inline-block w-4 h-4 mr-2" />
            {t('btn_add_selected')}
          </Button>
        </div>
        <ListTable2></ListTable2>
        {/* Falta darle estilos al paginador */}
      </div>
    </>
  );
}
