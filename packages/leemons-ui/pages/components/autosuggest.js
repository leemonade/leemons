import React from 'react';
import { useState } from 'react';
import { XIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { Avatar, Divider, UserCard, Button, Badge } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';
import Autosuggest from 'react-autosuggest';

function UserCardPage() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([
    {
      name: 'Carlota García',
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
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };
  // Imagine you have a list of languages that you'd like to autosuggest.
  const languages = [
    {
      name: 'Carlota García',
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
    <main>
      <div className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">User Card</span>
      </div>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper
          title="Auto suggest minimal card"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            alwaysRenderSuggestions={true}
          />
        </Wrapper>

        <Divider className="my-6" />
      </div>
    </main>
  );
}

export default UserCardPage;
