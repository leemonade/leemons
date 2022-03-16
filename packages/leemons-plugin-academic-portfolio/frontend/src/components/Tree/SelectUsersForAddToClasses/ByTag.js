import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Avatar,
  Checkbox,
  COLORS,
  ContextContainer,
  Stack,
  Table,
  Title,
} from '@bubbles-ui/components';
import { addErrorAlert } from '@layout/alert';
import { TagsAutocomplete, useStore } from '@common';
import { AlertWarningTriangleIcon, BlockIcon } from '@bubbles-ui/icons/solid';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { difference, forEach, map } from 'lodash';
import getUserFullName from '@users/helpers/getUserFullName';
import { getStudentsByTagsRequest } from '../../../request';

const ByTag = ({ tree, center, messages, onChange }) => {
  const [store, render] = useStore({
    allChecked: false,
    userAgentsChecked: [],
  });
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const data = React.useMemo(() => {
    const getClasses = (item) => {
      let classes = [];
      if (item.nodeType === 'class') {
        classes.push(item.value);
      }
      if (item.childrens) {
        forEach(item.childrens, (e) => {
          classes = classes.concat(getClasses(e));
        });
      }
      return classes;
    };

    return { classes: getClasses(tree) };
  }, [tree]);

  function emit() {
    onChange(difference(store.userAgentsChecked, store.allUsedUserAgents));
  }

  function processUsers() {
    store.students = map(store.students, (student) => ({
      ...student,
      checked: (
        <Checkbox
          checked={store.allChecked || store.userAgentsChecked.includes(student.id)}
          disabled={student.classStatus === 'all-used'}
          onChange={(ev) => {
            if (!ev) {
              store.allChecked = false;
              const index = store.userAgentsChecked.indexOf(student.id);
              if (index >= 0) {
                store.userAgentsChecked.splice(index, 1);
              }
            } else {
              store.userAgentsChecked.push(student.id);
              if (store.userAgentsChecked.length === store.students.length) {
                store.allChecked = true;
              }
            }
            processUsers();
            emit();
            render();
          }}
        />
      ),
    }));
  }

  async function onTagsChange(e) {
    try {
      store.tags = e;
      store.students = null;
      store.allChecked = false;
      store.userAgentsChecked = [];
      store.allUsedUserAgents = [];
      store.usedUserAgents = [];
      emit();
      render();
      if (e.length) {
        const { students } = await getStudentsByTagsRequest(e, center);

        store.students = map(students, (student) => {
          let count = 0;
          forEach(data.classes, (classe) => {
            if (classe.students.includes(student.id)) {
              count++;
            }
          });
          let classStatus = 'un-used';
          if (count === data.classes.length) {
            classStatus = 'all-used';
            store.allUsedUserAgents.push(student.id);
          } else if (count > 0) {
            classStatus = 'used';
            store.usedUserAgents.push(student.id);
          }

          return {
            ...student,
            classStatus,
            avatar: <Avatar image={student.user.avatar} fullName={getUserFullName(student.user)} />,
            classStatusDom: (
              <Stack alignItems="center">
                {classStatus === 'used' ? (
                  <AlertWarningTriangleIcon style={{ color: COLORS.fatic03 }} />
                ) : null}
                {classStatus === 'all-used' ? (
                  <BlockIcon style={{ color: COLORS.fatic01 }} />
                ) : null}
              </Stack>
            ),
            user: { ...student.user, birthdate: new Date(student.user.birthdate).toLocaleString() },
          };
        });
        processUsers();
      }
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  let tableHeaders = [
    {
      Header: (
        <Checkbox
          checked={store.allChecked}
          onChange={() => {
            store.allChecked = !store.allChecked;
            if (!store.allChecked) {
              store.userAgentsChecked = [];
            } else {
              store.userAgentsChecked = map(store.students, 'id');
            }
            processUsers();
            emit();
            render();
          }}
        />
      ),
      accessor: 'checked',
      className: 'text-left',
    },
  ];

  if (store.allUsedUserAgents?.length || store.usedUserAgents?.length) {
    tableHeaders.push({
      Header: ' ',
      accessor: 'classStatusDom',
      className: 'text-left',
    });
  }

  tableHeaders = tableHeaders.concat([
    {
      Header: ' ',
      accessor: 'avatar',
      className: 'text-left',
    },
    {
      Header: messages.emailHeader,
      accessor: 'user.email',
      className: 'text-left',
    },
    {
      Header: messages.nameHeader,
      accessor: 'user.name',
      className: 'text-left',
    },
    {
      Header: messages.surnameHeader,
      accessor: 'user.surnames',
      className: 'text-left',
    },
    {
      Header: messages.birthdayHeader,
      accessor: 'user.birthdate',
      className: 'text-left',
    },
  ]);

  return (
    <ContextContainer sx={(theme) => ({ paddingTop: theme.spacing[4] })}>
      <TagsAutocomplete
        onChange={onTagsChange}
        pluginName="users"
        value={store.tags}
        labels={{ addButton: messages.addTag }}
      />

      {store.students ? (
        <ContextContainer>
          <Stack>
            <Title order={6} color="tertiary">
              {messages.studentsFound.replace('{{count}}', store.students.length)}
            </Title>
          </Stack>
          {store.students.length ? (
            <ContextContainer>
              {store.allUsedUserAgents.length ? (
                <Alert severity="error" closeable={false}>
                  {messages.studentsError.replace('{{count}}', store.allUsedUserAgents.length)}
                </Alert>
              ) : null}
              {store.usedUserAgents.length ? (
                <Alert severity="warning" closeable={false}>
                  {messages.studentsWarning.replace('{{count}}', store.usedUserAgents.length)}
                </Alert>
              ) : null}

              <Table columns={tableHeaders} data={store.students} />
            </ContextContainer>
          ) : null}
        </ContextContainer>
      ) : null}
    </ContextContainer>
  );
};

ByTag.propTypes = {
  messages: PropTypes.object,
  center: PropTypes.string,
  onChange: PropTypes.func,
  tree: PropTypes.any,
};

// eslint-disable-next-line import/prefer-default-export
export { ByTag };
