import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Item from './item';

export default function LocalePicker({
  locales,
  selected: _selected = null,
  setLocale = () => {},
}) {
  const [selected, setSelected] = useState(_selected);
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((_expanded) => !_expanded);
  };

  const selectItem = (id) => () => {
    setSelected(id);
    setLocale(id);
    toggleExpanded();
  };
  return (
    <div>
      <div className="relative">
        <button
          type="button"
          className={`relative w-full bg-white border border-gray-300 ${
            expanded ? 'rounded-t-md' : 'rounded-md'
          } shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          onClick={toggleExpanded}
        >
          <span className="flex items-center">
            <span className="ml-3 block truncate text-black">
              {selected === null ? 'Select a locale' : `${selected.name} (${selected.code})`}
            </span>
          </span>
          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {/* <!-- Heroicon name: solid/selector --> */}
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        <ul
          className={`${
            expanded ? null : 'hidden'
          } absolute z-10 w-full bg-white shadow-lg max-h-56 rounded-b-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm`}
          tabIndex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          {!expanded
            ? null
            : locales.map((locale) => (
                <Item
                  key={locale.code}
                  locale={locale}
                  select={selectItem(locale)}
                  selected={selected === locale}
                />
              ))}
        </ul>
      </div>
    </div>
  );
}

LocalePicker.propTypes = {
  locales: PropTypes.object,
  selected: PropTypes.bool,
  setLocale: PropTypes.func,
};
