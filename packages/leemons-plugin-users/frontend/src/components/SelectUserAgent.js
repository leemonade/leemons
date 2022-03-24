/* eslint-disable no-unreachable */
import React, { forwardRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  cloneDeep,
  find,
  findIndex,
  map,
  isEmpty,
  isArray,
  flattenDeep,
  uniq,
  isNil,
} from 'lodash';
import { ActionButton, Box, Stack, MultiSelect, UserDisplayItem } from '@bubbles-ui/components';
import { useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { getUserAgentsInfoRequest, searchUserAgentsRequest } from '../request';

// EN: The Component for MultiSelect selected values component
// ES: El componente para el componente MultiSelect de valores seleccionados
export function SelectUserAgentValueComponent({ onRemove, ...props }) {
  return (
    <Stack sx={(theme) => ({ paddingRight: theme.spacing[1] })}>
      <UserDisplayItem {...props} />
      {onRemove ? (
        <Box>
          <ActionButton icon={<RemoveIcon />} onClick={() => onRemove()} />
        </Box>
      ) : null}
    </Stack>
  );
}

const SelectUserAgent = forwardRef(
  (
    {
      profiles,
      centers,
      maxSelectedValues = 1,
      onlyContacts,
      returnItem,
      itemRenderProps = { variant: 'rol' },
      valueRenderProps = { variant: 'inline', size: 'xs', style: { padding: 0 } },
      itemComponent: ItemComponent = UserDisplayItem,
      valueComponent: ValueComponent = SelectUserAgentValueComponent,
      value: inputValue,
      onChange = () => {},
      ...props
    },
    ref
  ) => {
    const [store, render] = useStore({
      data: [],
    });
    const [, , , getErrorMessage] = useRequestErrorMessage();

    // EN: Function triggered on user input for searching users
    // ES: Función que se activa al introducir un valor en el input de búsqueda de usuarios
    async function search(value) {
      try {
        const filters = {
          user: {
            name: value,
            surnames: value,
            secondSurname: value,
            email: value,
          },
        };
        if (profiles) {
          filters.profile = profiles;
        }

        if (centers) {
          filters.center = centers;
        }

        const response = await searchUserAgentsRequest(filters, {
          withCenter: true,
          withProfile: true,
          onlyContacts,
        });
        const data = map(response.userAgents, (item) => ({
          ...item.user,
          variant: 'rol',
          rol: item.profile.name,
          center: item.center.name,
          value: item.id,
          label: `${item.user.name}${item.user.surnames ? ` ${item.user.surnames}` : ''}`,
        }));

        store.data = data;
        render();
      } catch (err) {
        addErrorAlert(getErrorMessage(err));
      }
    }

    // EN: Allow compatibility with old versions, returning a single value if required
    // ES: Permite la compatibilidad con versiones antiguas, devolviendo un valor si es necesario
    function handleChange(value) {
      /*
      if (maxSelectedValues === 1) {
        if (value.length >= 0) {
          props.onChange(value[0], find(store.data, { value: value[0] }));
        } else {
          props.onChange(null);
        }
      } else {
        props.onChange(value);
      }
      */

      let values = value || [];

      if (returnItem) {
        values = values.map((item) => find(store.data, { value: item }));
      }

      values = maxSelectedValues === 1 ? values[0] || null : values;
      onChange(values);
    }

    // EN: Handle controlled input value by adding the selected values to the data array
    // ES: Maneja el valor de entrada controlado añadiendo los valores seleccionados al array de datos
    async function onValueChange(propValues) {
      let values = propValues;

      try {
        // EN: The value can be an array or a single value (string), so convert it to an array
        // ES: El valor puede ser un array o un valor simple (string), por lo que lo convertimos a un array
        if (!values || (Array.isArray(values) && !values.length)) {
          store.selectedAgents = [];
          return;
        }

        if (!Array.isArray(values)) {
          values = [values];
        }

        // EN: Get the user agents info for the entries selected but not yet in the data array
        // ES: Obtenemos la información de los agentes de usuario para las entradas seleccionadas pero no están aún en el array de datos
        const selectedAgents = await Promise.all(
          values.map(async (value) => {
            // ES: en caso de que el value sea el mismo objeto/s devuelto por el Select
            if (!isEmpty(value?.value) && !isEmpty(value?.id)) {
              return value;
            }

            const selectedAgentData = find(store.data, { value });

            // EN: Check if the id is inside the data if not we have to get the detail and add it to the data
            // ES: Comprobamos si la id esta dentro de los datos si no esta tenemos que sacar el detalle y añadirlo al data
            if (!selectedAgentData) {
              const { userAgents } = await getUserAgentsInfoRequest([value], {
                withCenter: true,
                withProfile: true,
              });
              if (userAgents[0]) {
                return {
                  ...userAgents[0].user,
                  variant: 'rol',
                  rol: userAgents[0].profile.name,
                  center: userAgents[0].center.name,
                  value: userAgents[0].id,
                  label: `${userAgents[0].user.name}${
                    userAgents[0].user.surnames ? ` ${userAgents[0].user.surnames}` : ''
                  }`,
                };
              }
            }
            return selectedAgentData;
          })
        );

        store.selectedAgents = selectedAgents;

        render();
      } catch (err) {
        addErrorAlert(getErrorMessage(err));
      }
    }

    useEffect(() => {
      // In case of inputValue is "undefined" or "null"
      const value = inputValue || [];
      onValueChange(uniq(flattenDeep([value])));
    }, [inputValue]);

    // EN: Initial search for the first render
    // ES: Búsqueda inicial para la primera renderización
    useEffect(() => {
      if (!store.data?.length) {
        search('');
      }
    }, [profiles]);

    // EN: Concat the selected values with the data array
    // ES: Concatenamos los valores seleccionados con el array de datos
    const data = cloneDeep(store.data);

    if (store.selectedAgents?.length) {
      store.selectedAgents?.forEach((agent) => {
        const hasValueInData = findIndex(data, { value: agent?.value });
        if (hasValueInData < 0) {
          data.push(agent);
        }
      });
    }

    const propValue = useMemo(() => {
      const value = inputValue;

      if (isEmpty(value) || isNil(value)) {
        return [];
      }

      if (isArray(value)) {
        return value.map((item) => {
          if (!isEmpty(item?.value) && !isEmpty(item?.id)) {
            return item.value;
          }
          return value;
        });
      }

      if (!isEmpty(value?.value) && !isEmpty(value?.id)) {
        return [value.value];
      }

      return [value];
    }, [inputValue]);

    return (
      <MultiSelect
        {...props}
        ref={ref}
        searchable
        onSearchChange={search}
        itemComponent={(p) => <ItemComponent {...p} {...itemRenderProps} />}
        valueComponent={(p) => <ValueComponent {...p} {...valueRenderProps} />}
        maxSelectedValues={maxSelectedValues}
        data={data}
        // EN: The value can be an array or a single value (string), so convert it to an array
        // ES: El valor puede ser un array o un valor simple (string), por lo que lo convertimos a un array
        value={uniq(flattenDeep(propValue))}
        onChange={handleChange}
      />
    );
  }
);

SelectUserAgent.displayName = 'SelectUserAgent';
SelectUserAgent.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  profiles: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  centers: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  maxSelectedValues: PropTypes.number,
  onlyContacts: PropTypes.bool,
  returnItem: PropTypes.bool,
  itemRenderProps: PropTypes.object,
  valueRenderProps: PropTypes.object,
  itemComponent: PropTypes.element,
  valueComponent: PropTypes.element,
};

SelectUserAgentValueComponent.propTypes = {
  onRemove: PropTypes.func,
};

export { SelectUserAgent };
export default SelectUserAgent;
