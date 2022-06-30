import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

export default function LocaleCreator({ addLocale }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const response = await fetch('/api/multilanguage/locale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((r) => r.json());

    if (response.locale) {
      addLocale(response.locale);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <div className="rounded-md shadow-sm flex">
        <label htmlFor="locale-code" className="sr-only">
          Email address
        </label>
        <input
          id="locale-code"
          name="code"
          type="input"
          autoComplete="locale-code"
          required
          className="appearance-none rounded-none relative inline-block w-16 pl-3 pr-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="code"
          {...register('code', { required: true, minLength: 2, maxLength: 5 })}
        />
        <label htmlFor="locale-name" className="sr-only">
          Password
        </label>
        <input
          id="locale-name"
          name="name"
          type="name"
          autoComplete="locale-name"
          required
          className="appearance-none rounded-none w-full relative inline-block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="name"
          {...register('name', {
            required: true,
          })}
        />
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add locale
        </button>
      </div>
    </form>
  );
}
LocaleCreator.propTypes = {
  addLocale: PropTypes.func,
};
