/* eslint-disable no-unreachable */
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';

import { ActionButton, Box, MultiSelect, Stack, UserDisplayItem } from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import {
  cloneDeep,
  filter,
  find,
  findIndex,
  flattenDeep,
  isArray,
  isEmpty,
  isNil,
  map,
  uniq,
} from 'lodash';
import { getUserAgentsInfoRequest, searchUserAgentsRequest } from '../request';

// EN: The Component for MultiSelect selected values component
// ES: El componente para el componente MultiSelect de valores seleccionados
export function SelectUserAgentValueComponent({ onRemove, value, ...props }) {
  return (
    <Stack sx={(theme) => ({ paddingRight: theme.spacing[1] })}>
      <UserDisplayItem {...props} />
      {onRemove ? (
        <Box>
          <ActionButton icon={<RemoveIcon />} onClick={(event) => onRemove(event, value)} />
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
      programs,
      courses,
      selectedUsers,
      selectedUserAgents,
      maxSelectedValues = 1,
      users,
      onlyContacts,
      returnItem,
      itemRenderProps = { variant: 'rol', style: { cursor: 'pointer' } },
      valueRenderProps = { variant: 'inline', size: 'xs', style: { padding: 0 } },
      itemComponent: ItemComponent = UserDisplayItem,
      valueComponent: ValueComponent = SelectUserAgentValueComponent,
      value: inputValue = [],
      onChange = () => {},
      ...props
    },
    ref
  ) => {
    const [usersData, setUsersData] = useState(null);
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

        if (programs) {
          filters.program = programs;
        }

        if (courses) {
          filters.course = courses;
        }

        const response = await searchUserAgentsRequest(filters, {
          withCenter: true,
          withProfile: true,
          onlyContacts,
        });

        const data = map(response.userAgents, (item) => ({
          ...item.user,
          variant: 'rol',
          rol: item.profile?.name,
          center: item.center?.name,
          value: item.id,
          label: `${item.user.name}${item.user.surnames ? ` ${item.user.surnames}` : ''}`,
        }));

        store.data = data;
        render();
      } catch (err) {
        console.error(err);
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
      values = isArray(values) ? values : [values];

      if (returnItem) {
        values = values.map((item) => find(store.data, { value: item }));
      }

      values = maxSelectedValues === 1 ? values[0] || null : values;
      const userAgent = maxSelectedValues === 1 ? find(store.data, { value: values }) : undefined;
      onChange(values, userAgent);
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

    // EN: Allow the user to select the users to display
    // ES: Permite al usuario seleccionar los usuarios a mostrar
    useEffect(() => {
      (async () => {
        if (users) {
          if (users.length && users[0].name) {
            setUsersData(users);
          } else {
            let data = await getUserAgentsInfoRequest(users, {
              withCenter: true,
              withProfile: true,
            });

            data = data.userAgents.map((item) => ({
              ...item.user,
              variant: 'rol',
              rol: item.profile.name,
              center: item.center.name,
              value: item.id,
              label: `${item.user.name}${item.user.surnames ? ` ${item.user.surnames}` : ''}`,
            }));

            setUsersData(data);
          }
        } else if (usersData) {
          setUsersData(null);
        }
      })();
    }, [users]);

    // EN: Initial search for the first render
    // ES: Búsqueda inicial para la primera renderización
    useEffect(() => {
      if (!store.data?.length && !users) {
        search('');
      }
    }, [profiles]);

    useEffect(() => {
      search('');
    }, [courses, programs]);

    // EN: Concat the selected values with the data array
    // ES: Concatenamos los valores seleccionados con el array de datos
    const data = cloneDeep(store.data);

    if (store.selectedAgents?.length && !users) {
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

    let toData = usersData || data;
    if (selectedUsers) {
      toData = filter(toData, ({ id }) => !selectedUsers.includes(id));
    }
    if (selectedUserAgents) {
      toData = filter(toData, ({ value }) => !selectedUserAgents.includes(value));
    }

    return (
      <MultiSelect
        {...props}
        ref={ref}
        searchable
        onSearchChange={usersData ? undefined : search}
        itemComponent={(p) => <ItemComponent {...p} {...itemRenderProps} />}
        valueComponent={(p) => <ValueComponent {...p} {...valueRenderProps} />}
        multiple={maxSelectedValues !== 1}
        data={toData}
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
  users: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  profiles: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  centers: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  programs: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  courses: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  maxSelectedValues: PropTypes.number,
  onlyContacts: PropTypes.bool,
  returnItem: PropTypes.bool,
  itemRenderProps: PropTypes.object,
  valueRenderProps: PropTypes.object,
  itemComponent: PropTypes.any,
  valueComponent: PropTypes.any,
  selectedUsers: PropTypes.any,
  selectedUserAgents: PropTypes.any,
};

SelectUserAgentValueComponent.propTypes = {
  onRemove: PropTypes.func,
  value: PropTypes.string,
};

export { SelectUserAgent };
export default SelectUserAgent;
