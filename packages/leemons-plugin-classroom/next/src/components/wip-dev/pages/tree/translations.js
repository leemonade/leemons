// TODO: Add translations from the saved object itself
import React, { useEffect, useState } from 'react';
import { Input } from 'leemons-ui';

function TranslationTab({ locale, isDefault, name, setName, register }) {
  if (isDefault) {
    return (
      <Input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        outlined
        className="input w-full"
        placeholder="Level name"
      />
    );
  }
  return (
    <Input
      {...register(`names.${locale}`)}
      outlined
      className="input w-full"
      placeholder="Level name"
    />
  );
}

export default function Translations({ setWarnings, TranslationsTabs, register, name, setName }) {
  return (
    <TranslationsTabs>
      <TranslationTab register={register} name={name} setName={setName} />
    </TranslationsTabs>
  );
}
