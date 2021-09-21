import { useState } from 'react';

import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { Avatar, Button } from 'leemons-ui';
import Autosuggest from 'react-autosuggest';

export default function EditLevelTutor() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([
    {
      name: 'C',
      year: 1972,
    },
    {
      name: 'C#',
      year: 2000,
    },
    {
      name: 'C++',
      year: 1983,
    },
    {
      name: 'Clojure',
      year: 2007,
    },
    {
      name: 'Elm',
      year: 2012,
    },
    {
      name: 'Go',
      year: 2009,
    },
    {
      name: 'Haskell',
      year: 1990,
    },
    {
      name: 'Java',
      year: 1995,
    },
    {
      name: 'Javascript',
      year: 1995,
    },
    {
      name: 'Perl',
      year: 1987,
    },
    {
      name: 'PHP',
      year: 1995,
    },
    {
      name: 'Python',
      year: 1991,
    },
    {
      name: 'Ruby',
      year: 1995,
    },
    {
      name: 'Scala',
      year: 2003,
    },
  ]);
  const [translate] = useTranslate({
    keysStartsWith: 'edit_level_page.tutor',
  });
  const t = tLoader('edit_level_page.tutor', translate);
  console.log(translate);

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Imagine you have a list of languages that you'd like to autosuggest.
  const languages = [
    {
      name: 'C',
      year: 1972,
    },
    {
      name: 'C#',
      year: 2000,
    },
    {
      name: 'C++',
      year: 1983,
    },
    {
      name: 'Clojure',
      year: 2007,
    },
    {
      name: 'Elm',
      year: 2012,
    },
    {
      name: 'Go',
      year: 2009,
    },
    {
      name: 'Haskell',
      year: 1990,
    },
    {
      name: 'Java',
      year: 1995,
    },
    {
      name: 'Javascript',
      year: 1995,
    },
    {
      name: 'Perl',
      year: 1987,
    },
    {
      name: 'PHP',
      year: 1995,
    },
    {
      name: 'Python',
      year: 1991,
    },
    {
      name: 'Ruby',
      year: 1995,
    },
    {
      name: 'Scala',
      year: 2003,
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
    <div className={isHighlighted ? 'bg-red-50' : 'bg-transparent'}>{suggestion.name}</div>
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
      <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
        <div className=" w-4/12">
          <legend className="edit-section-title text-xl text-secondary">{t('tutor.title')}</legend>
          <p className="edit-section-description font-inter text-sm text-secondary-300">
            {t('description')}
          </p>
        </div>
        <div className=" w-8/12">
          <p>Hika</p>
          {/* autsuggest dummy example */}
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            alwaysRenderSuggestions={true}
          />
          {/*
          <div data-reactroot="" className="block relative border border-base-300 z-10 open">
            <input
              type="text"
              value="A"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-owns="react-autowhatever-1"
              aria-expanded="true"
              aria-haspopup="true"
              className="input input-bordered w-full rounded-none"
              placeholder="Search"
            />
            <div id="react-autowhatever-1" className="relative">
              <ul role="listbox" className="react-autosuggest__suggestions-list">
                <li
                  role="option"
                  id="react-autowhatever-1--item-0"
                  className="p-1 border-b border-base-300"
                  data-suggestion-index="0"
                >
                  <div className="suggestion-content">
                    <div className="user-card minimal">
                      <Avatar circle={true} size={8} className="">
                        <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
                      </Avatar>
                      <span>Antonia Hidalgo</span>
                    </div>
                  </div>
                </li>
                <li
                  role="option"
                  id="react-autowhatever-1--item-1"
                  className="p-1 border-b border-base-300"
                  data-suggestion-index="1"
                >
                  <div className="user-card minimal">
                    <Avatar circle={true} size={8} className="">
                      <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
                    </Avatar>
                    <span>Antonia Hidalgo</span>
                  </div>
                </li>
              </ul>
            </div>
          </div> */}
          {/* End autsuggest dummy example */}
        </div>
      </fielset>

      {/* Fin Dummy tabla */}
    </>
  );
}
