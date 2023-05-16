import React from 'react';
import PropTypes from 'prop-types';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import {
  Box,
  Title,
  Stack,
  Text,
  Badge,
  UserDisplayItem,
  Select,
  Table,
} from '@bubbles-ui/components';
import { isFunction } from 'lodash';
import { UserListBoxStyles } from './UserListBox.styles';

const UserListBox = ({
  title,
  icon,
  label,
  data,
  type,
  relationship,
  isEditing,
  onClick,
  onRemove,
  t,
  permissions,
  fullWidth,
}) => {
  const isEmpty = data.length < 1;
  const { classes } = UserListBoxStyles({ isEmpty, fullWidth }, { name: 'UserListBox' });

  const renderData = () =>
    data.map((user) => {
      if (type !== 'phones')
        return (
          <Box key={user.id} className={classes.userWrapper}>
            <UserDisplayItem {...user} variant="block" />
            <DeleteBinIcon
              height={16}
              width={16}
              className={classes.deleteIcon}
              onClick={() => onRemove(type, user.id)}
            />
          </Box>
        );
      return (
        <Box key={user.id}>
          <Table />
        </Box>
      );
    });

  const onClickHandler = () => {
    isFunction(onClick) && onClick();
  };

  return (
    <Stack spacing={4} direction="column" className={classes.root}>
      <Stack spacing={4} alignItems="center">
        <Title order={3}>{title}</Title>
        {isEditing && (
          <AddCircleIcon
            height={16}
            width={16}
            className={classes.addIcon}
            onClick={onClickHandler}
          />
        )}
        {!isEditing && (
          <Badge color="stroke" radius="default" closable={false}>
            {relationship}
          </Badge>
        )}
      </Stack>
      <Stack
        className={classes.listWrapper}
        justifyContent="center"
        alignItems="center"
        onClick={isEmpty ? onClickHandler : undefined}
      >
        {data.length < 1 && (
          <Stack direction="column" alignItems="center">
            <Stack direction="column" alignItems="center" spacing={2} style={{ marginBottom: 24 }}>
              <Box className={classes.iconWrapper}>{icon}</Box>
              <Text color="soft">{label}</Text>
            </Stack>
            <AddCircleIcon height={24} width={24} className={classes.iconWrapper} />
          </Stack>
        )}
        {data.length > 0 && (
          <Box className={classes.userList}>
            {renderData()}
            {type === 'guardian' && data.length >= 2 && (
              <Select
                label={t('guardian_relation')}
                placeholder={t('maritalStatus.select_marital_status')}
                data={[
                  {
                    value: t('maritalStatus.married', undefined, true),
                    label: t('maritalStatus.married'),
                  },
                  {
                    value: t('maritalStatus.divorced', undefined, true),
                    label: t('maritalStatus.divorced'),
                  },
                  {
                    value: t('maritalStatus.domestic_partners', undefined, true),
                    label: t('maritalStatus.domestic_partners'),
                  },
                  {
                    value: t('maritalStatus.cohabitants', undefined, true),
                    label: t('maritalStatus.cohabitants'),
                  },
                  {
                    value: t('maritalStatus.separated', undefined, true),
                    label: t('maritalStatus.separated'),
                  },
                ]}
                disabled={!permissions.guardiansInfo.update}
                style={{ marginTop: 16 }}
              />
            )}
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

UserListBox.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string,
  data: PropTypes.array,
  onClick: PropTypes.func,
  type: PropTypes.string,
  onRemove: PropTypes.func,
  relationship: PropTypes.string,
  isEditing: PropTypes.bool,
};

export { UserListBox };
export default UserListBox;
