import React from 'react';
import PropTypes from 'prop-types';

export default function Item({ locale, select = () => {}, selected }) {
  return (
    <li
      className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100"
      role="option"
      onClick={select}
    >
      <div className="flex items-center">
        {/* <!-- Selected: "font-semibold", Not Selected: "font-normal" --> */}
        <span className="font-normal ml-3 block truncate">
          {locale.name} ({locale.code})
        </span>
      </div>

      {/* Checkmark, only display for selected option.

          Highlighted: "text-white", Not Highlighted: "text-indigo-600" */}
      {selected ? (
        <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
          {/* <!-- Heroicon name: solid/check --> */}
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      ) : null}
    </li>
  );
}

Item.propTypes = {
  locale: PropTypes.object,
  select: PropTypes.func,
  selected: PropTypes.bool,
};
