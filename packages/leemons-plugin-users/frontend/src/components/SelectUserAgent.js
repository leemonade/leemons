import React, { useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, find, findIndex, map } from 'lodash';
import { ActionButton, Box, MultiSelect, UserDisplayItem } from '@bubbles-ui/components';
import { useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { getUserAgentsInfoRequest, searchUserAgentsRequest } from '../request';

function ValueItem(props) {
  return (
    <Box>
      {props.onRemove ? (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            zIndex: 9,
            right: theme.spacing[2],
            top: `calc(50% - ${theme.spacing[1] / 2}px  )`,
            transform: 'translateY(-50%)',
            backgroundColor: theme.colors.uiBackground01,
          })}
        >
          <ActionButton icon={<RemoveIcon />} onClick={() => props.onRemove()} />
        </Box>
      ) : null}

      <UserDisplayItem {...props} size="xs" />
    </Box>
  );
}

const SelectUserAgent = forwardRef(({ profiles, centers, ...props }, ref) => {
  const [store, render] = useStore({
    data: [],
  });
  const [, , , getErrorMessage] = useRequestErrorMessage();

  async function search(value) {
    try {
      const filters = {
        user: {
          name: value,
          surnames: value,
          email: value,
        },
      };
      if (profiles) filters.profile = profiles;
      if (centers) filters.center = centers;

      const response = await searchUserAgentsRequest(filters, {
        withCenter: true,
        withProfile: true,
      });
      store.data = map(response.userAgents, (item) => ({
        ...item.user,
        variant: 'rol',
        rol: item.profile.name,
        center: item.center.name,
        value: item.id,
        label: `${item.user.name}${item.user.surnames ? ` ${item.user.surnames}` : ''}`,
      }));
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function onValueChange() {
    try {
      // Comprobamos si la id esta dentro de los datos si no esta tenemos que sacar el detalle y añadirlo al data
      const selectedAgentData = find(store.data, { value: props.value });
      if (!selectedAgentData) {
        const { userAgents } = await getUserAgentsInfoRequest([props.value], {
          withCenter: true,
          withProfile: true,
        });
        if (userAgents[0]) {
          store.selectedAgent = {
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
      } else {
        store.selectedAgent = selectedAgentData;
      }
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  useEffect(() => {
    onValueChange();
  }, [props.value]);

  const data = cloneDeep(store.data);

  if (store.selectedAgent) {
    const hasValueInData = findIndex(data, { value: store.selectedAgent.value });
    if (hasValueInData < 0) {
      data.push(store.selectedAgent);
    }
  }

  return (
    <MultiSelect
      {...props}
      ref={ref}
      searchable
      onSearchChange={search}
      itemComponent={UserDisplayItem}
      valueComponent={ValueItem}
      maxSelectedValues={1}
      data={data}
      value={props.value ? [props.value] : []}
      onChange={(value) => {
        if (value.length >= 0) {
          props.onChange(value[0]);
        } else {
          props.onChange(null);
        }
      }}
    />
  );
});
SelectUserAgent.displayName = '@users/components/SelectUserAgent';
SelectUserAgent.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  profiles: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  centers: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

export { SelectUserAgent };
export default SelectUserAgent;
