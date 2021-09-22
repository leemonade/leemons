import { useState } from 'react';

import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { Avatar, Card, UserCard, Button } from 'leemons-ui';
import { XIcon } from '@heroicons/react/solid';
import { PlusIcon, RefreshIcon } from '@heroicons/react/outline';
import Autosuggest from 'react-autosuggest';

export default function EditLevelTutor() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([
    {
      name: 'Ana García',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Carmen González',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Concepción Perez',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Clara Pazos',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Elisa Merino',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Gonzalo Murillo',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Javier Gutierrez',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Javier Martínez',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Pedro García',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Pedro Marmol',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Pedro Zerolo',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Rubiselda Méndez',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Salugral Adriana',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
  ]);
  const [translate] = useTranslate({
    keysStartsWith: 'plugins.classroom.edit_level_page.tutor',
  });
  const t = tLoader('plugins.classroom.edit_level_page.tutor', translate);
  console.log(translate);

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Imagine you have a list of languages that you'd like to autosuggest.
  const languages = [
    {
      name: 'Ana García',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Carmen González',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Concepción Perez',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Clara Pazos',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Elisa Merino',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Gonzalo Murillo',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Javier Gutierrez',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Javier Martínez',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Pedro García',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Pedro Marmol',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Pedro Zerolo',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Rubiselda Méndez',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
    {
      name: 'Salugral Adriana',
      img: 'http://daisyui.com/tailwind-css-component-profile-1@40w.png',
    },
  ];

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (_value) => {
    const inputValue = _value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : languages.filter((lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue);
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = (suggestion) => suggestion.name;

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion, { isHighlighted }) => (
    <UserCard className={`minimal ${isHighlighted ? 'is-focused' : ''}`}>
      <Avatar circle={true} className="">
        <img src={suggestion.img} />
      </Avatar>
      <span>{suggestion.name}</span>
    </UserCard>
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
      {/* Si no tengo asignado un tutor */}
      <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
        <div className=" w-3/12">
          <legend className="edit-section-title text-xl text-secondary">{t('title')}</legend>
          <p className="edit-section-description font-inter text-sm text-secondary-300">
            {t('description')}
          </p>
        </div>
        <div className=" w-6/12 relative">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            alwaysRenderSuggestions={false}
          />
          <Button className="btn-circle btn-xs absolute top-2 right-2 text-white">
            <XIcon className="inline-block w-4 h-4 stroke-current" />
          </Button>
        </div>
        <div className="">
          <Button color="primary" text={true} className="block whitespace-nowrap">
            <PlusIcon className="inline-block w-3 h-3 border border-solid rounded-full border-current mr-2" />
            {t('btn_apply')}
          </Button>
        </div>
      </fielset>

      {/* Si tengo asignado un tutor */}
      <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
        <div className=" w-3/12">
          <legend className="edit-section-title text-xl text-secondary">{t('title')}</legend>
          <p className="edit-section-description font-inter text-sm text-secondary-300">
            {t('description')}
          </p>
        </div>
        <div className=" w-6/12">
          <Card className="shadow">
            <UserCard>
              <dl className="basic horizontal">
                <dt className="avatar-container read-only">Avatar</dt>
                <dd className="avatar-container">
                  <Avatar circle={true} size={8} className="stroke border-secondary-50">
                    <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
                  </Avatar>
                </dd>
                <dt className="read-only">Nombre</dt>
                <dd className="user-card-name">Benoit Lafalletye</dd>
                <dt className="read-only">Teléfono</dt>
                <dd className="user-card-phone">
                  <a href="tel:123-456-7890">123-456-7890</a>
                </dd>
                <dt className="read-only">Correo electrónico</dt>
                <dd className="user-card-email">lafalletye.benoit@example.com</dd>
              </dl>
            </UserCard>
          </Card>
        </div>
        <div className="">
          <Button color="primary" text={true} className="block whitespace-nowrap">
            <RefreshIcon className="inline-block w-3 h-3 border border-solid rounded-full border-current mr-2" />
            {t('btn_change')}
          </Button>
        </div>
      </fielset>
    </>
  );
}
