import React from 'react';
import { FormWithTheme } from '@bubbles-ui/leemons';

export default function formWithTheme(schema, ui, conditions, props = {}) {
  // Añadir otro parametro donde se le pase un onUserSearch y que este busque en el backend los usuarios y devuelva el formato que necesita el select
  return FormWithTheme(schema, ui, conditions, props);
}
