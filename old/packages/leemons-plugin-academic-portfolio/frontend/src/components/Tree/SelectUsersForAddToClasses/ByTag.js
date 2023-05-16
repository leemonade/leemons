import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Avatar,
  Checkbox,
  COLORS,
  ContextContainer,
  Paragraph,
  Stack,
  Table,
  Title,
} from '@bubbles-ui/components';
import { addErrorAlert } from '@layout/alert';
import { LocaleDate, TagsAutocomplete, useStore } from '@common';
import { AlertWarningTriangleIcon, BlockIcon } from '@bubbles-ui/icons/solid';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { cloneDeep, difference, forEach, isNil, map } from 'lodash';
import getUserFullName from '@users/helpers/getUserFullName';
import { getStudentsByTagsRequest } from '../../../request';

const ByTag = ({ classes, center, messages, onChange, disableSave }) => {
  const [store, render] = useStore({
    allChecked: false,
    userAgentsChecked: [],
    allUsedUserAgents: [],
  });
  const [, , , getErrorMessage] = useRequestErrorMessage();

  function getSelectedUserAgents() {
    return difference(store.userAgentsChecked, store.allUsedUserAgents);
  }

  function getClassesThatExceedSeatLimit() {
    const userAgents = getSelectedUserAgents();
    const _classes = cloneDeep(classes);
    forEach(userAgents, (student) => {
      forEach(_classes, (classe) => {
        if (classe.students.indexOf(student) < 0 && classe.parentStudents.indexOf(student) < 0) {
          classe.students.push(student);
        }
      });
    });
    store.classesExceed = [];
    forEach(_classes, (classe, index) => {
      if (
        isNil(classe.seats) ||
        classe.seats < classe.students.length + classe.parentStudents.length
      ) {
        store.classesExceed.push({
          classe: classes[index],
          seats: isNil(classe.seats)
            ? 0
            : classe.seats -
              (classes[index].students.length + classes[index].parentStudents.length),
        });
      }
    });

    if (userAgents.length && store.classesExceed.length) {
      disableSave(true);
    } else {
      disableSave(false);
    }
  }

  function emit() {
    onChange(getSelectedUserAgents());
    getClassesThatExceedSeatLimit();
  }

  function processUsers() {
    store.students = map(store.students, (student) => ({
      ...student,
      checked: (
        <Checkbox
          checked={
            store.allUsedUserAgents.indexOf(student.id) >= 0
              ? false
              : store.allChecked || store.userAgentsChecked.includes(student.id)
          }
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
          forEach(classes, (classe) => {
            if (classe.students.includes(student.id)) {
              count++;
            }
          });
          let classStatus = 'un-used';

          if (count === classes.length) {
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
            user: { ...student.user, birthdate: <LocaleDate date={student.user.birthdate} /> },
          };
        });
        processUsers();
      }
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  React.useEffect(() => {
    (async () => {
      if (store.tags?.length) {
        getClassesThatExceedSeatLimit();
        await onTagsChange(store.tags);
        emit();
      }
    })();
  }, [classes]);

  React.useEffect(() => {
    getClassesThatExceedSeatLimit();
    emit();
  }, []);

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
              {store.classesExceed.length ? (
                <Alert severity="error" closeable={false}>
                  {messages.seatsError1}
                  <br />
                  {store.classesExceed.map((classe) => (
                    <>
                      {messages.seatsClassError
                        .replace('{{className}}', classe.classe.name)
                        .replace('{{seats}}', classe.seats)}
                      <br />
                    </>
                  ))}
                  {messages.seatsError2}
                </Alert>
              ) : null}
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

              <Paragraph>
                {messages.selected.replace('{{count}}', getSelectedUserAgents().length)}
              </Paragraph>

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
  disableSave: PropTypes.func,
  classes: PropTypes.array,
};

// eslint-disable-next-line import/prefer-default-export
export { ByTag };
