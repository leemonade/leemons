import * as _ from 'lodash';
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  Stack,
  RadioGroup,
  TextInput,
  Box,
  Title,
  Text,
  Button,
  Alert,
  Radio,
  Table,
  Paper,
  UserDisplayItem,
} from '@bubbles-ui/components';
import moment from 'moment';
import RelationSelect from '@families/components/relationSelect';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { StarIcon } from '@bubbles-ui/icons/solid';
import { searchUsersRequest } from '@families/request';
import { useRequestErrorMessage } from '@common';
import { FamilyChildIcon, SingleActionsGraduateMaleIcon } from '@bubbles-ui/icons/outline';
import { SearchUserDrawerStyles } from './SearchUserDrawer.styles';

const SearchUserDrawer = ({ opened, t, type, alreadyExistingMembers, onAdd, ...props }) => {
  const { t: tCommonForm } = useCommonTranslate('forms');
  const [selectedFilter, setSelectedFilter] = useState('name');
  const [loading, setLoading] = useState(false);
  const [error, setError, ErrorAlert] = useRequestErrorMessage();
  const [users, setUsers] = useState();
  const [inputValue, setInputValue] = useState('');
  const [inputValueRequired, setInputValueRequired] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedRelation, setSelectedRelation] = useState('...');
  const [otherRelationValue, setOtherRelationValue] = useState('');
  const [relationError, setRelationError] = useState();
  const [dirty, setDirty] = useState(false);

  const tableHeaders = useMemo(
    () => [
      {
        Header: ' ',
        accessor: (currentUser) => (
          <Radio
            name="searchUserModalUser"
            checked={currentUser.id === selectedUser?.id}
            onChange={() => setSelectedUser(currentUser)}
            value={currentUser.id}
          />
        ),
      },
      {
        Header: t('table.email'),
        accessor: (field) => <UserDisplayItem {...field} variant="email" />,
      },
      {
        Header: t('table.name'),
        accessor: ({ name }) => <Text>{name}</Text>,
      },
      {
        Header: t('table.surname'),
        accessor: ({ surnames }) => <Text>{surnames}</Text>,
      },
      {
        Header: t('table.created_at'),
        accessor: ({ created_at }) => moment(created_at).format('L'),
      },
    ],
    [t, selectedUser]
  );

  const add = async () => {
    setDirty(true);
    const value = {};
    if (type === 'guardian') {
      if (!selectedRelation || selectedRelation === '...') {
        setRelationError('need-relation');
        return;
      }
      if (selectedRelation === 'other' && !otherRelationValue) {
        setRelationError('need-other-relation');
        return;
      }
      value.memberType = selectedRelation === 'other' ? otherRelationValue : selectedRelation;
    }
    if (selectedUser) {
      onAdd({ ...selectedUser, ...value });
    }
  };

  const search = async () => {
    try {
      setInputValueRequired(false);
      if (!inputValue) {
        setInputValueRequired(true);
        return false;
      }
      setLoading(true);
      const query = {
        ignoreUserIds: _.map(alreadyExistingMembers, 'id'),
      };
      if (selectedFilter === 'name') {
        query.user = {
          name: inputValue,
          surnames: inputValue,
        };
      }
      if (selectedFilter === 'email') {
        query.user = {
          email: inputValue,
        };
      }
      const { users } = await searchUsersRequest(type, query);
      setUsers(users);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  const { classes } = SearchUserDrawerStyles({}, { name: 'SearchUserDrawer' });
  const noUsers = !users || !users.length;
  return (
    <Drawer opened={opened} size={715} {...props} back="Back">
      <Stack direction="column" fullWidth fullHeight spacing={4}>
        <Stack spacing={4} skipFlex>
          <StarIcon height={24} width={24} />
          <Title order={2}>{t(`assign_${type}_to_family`)}</Title>
        </Stack>
        {noUsers && (
          <>
            <Stack direction="column" spacing={3} style={{ marginTop: 24 }}>
              <Title order={3}>{'Select a profile'}</Title>
              <RadioGroup
                fullWidth
                variant="icon"
                value={type}
                data={[
                  {
                    value: 'guardian',
                    label: 'Add tutor',
                    icon: <FamilyChildIcon height={32} width={32} />,
                  },
                  {
                    value: 'student',
                    label: 'Add student',
                    icon: <SingleActionsGraduateMaleIcon height={32} width={32} />,
                  },
                ]}
              />
            </Stack>
            <RadioGroup
              // label={t('search_user_to_add')}
              name="searchUsersFilter"
              data={[
                { value: 'name', label: t('search_by_name') },
                { value: 'email', label: t('search_by_email') },
              ]}
              onChange={setSelectedFilter}
            />
            <Stack spacing={6} alignItems="center">
              <TextInput
                placeholder={t(`enter_${selectedFilter}`)}
                error={inputValueRequired ? tCommonForm('required') : ''}
                value={inputValue}
                onChange={setInputValue}
                style={{ flex: 1 }}
              />
              <Button loading={loading} onClick={search}>
                {t('search')}
              </Button>
            </Stack>
            {users && (
              <Alert severity="error" closeable={false}>
                {t('no_users_to_add')}
              </Alert>
            )}
          </>
        )}
        {!noUsers && (
          <Box className={classes.tableWrapper}>
            {/* <FormControl
        multiple={true}
        formError={!selectedUser && dirty ? { message: tCommonForm('required') } : null}
      > */}
            <Paper padding={2} mt={20} mb={20} fullWidth>
              <Table columns={tableHeaders} data={users} />
            </Paper>
            <Stack
              justifyContent={type === 'guardian' ? 'space-between' : 'flex-end'}
              alignItems="flex-end"
              style={{ marginTop: 36 }}
              fullWidth
            >
              <Stack spacing={4} skipFlex>
                {type === 'guardian' && (
                  <Stack spacing={4}>
                    <RelationSelect
                      label={t('guardian_relation')}
                      error={relationError === 'need-relation' ? tCommonForm('required') : ''}
                      value={selectedRelation}
                      onChange={(e) => {
                        setRelationError(null);
                        setSelectedRelation(e);
                      }}
                    />
                    {selectedRelation === 'other' && (
                      <TextInput
                        label={t('specify_relation')}
                        error={
                          relationError === 'need-other-relation' ? tCommonForm('required') : ''
                        }
                        value={otherRelationValue}
                        onChange={(e) => {
                          setRelationError(null);
                          setOtherRelationValue(e);
                        }}
                      />
                    )}
                  </Stack>
                )}
              </Stack>
              <Button color="primary" loading={loading} onClick={add}>
                {t(`add_${type}`)}
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Drawer>
  );
};

SearchUserDrawer.propTypes = {
  opened: PropTypes.bool,
  t: PropTypes.func,
  type: PropTypes.string,
};

export { SearchUserDrawer };
export default SearchUserDrawer;
