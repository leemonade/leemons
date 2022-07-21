import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Alert,
  Avatar,
  Box,
  Button,
  COLORS,
  ContextContainer,
  Stack,
  Table,
  UserDisplayItem,
} from '@bubbles-ui/components';
import getUserFullName from '@users/helpers/getUserFullName';
import {AlertWarningTriangleIcon, BlockIcon, DeleteBinIcon} from '@bubbles-ui/icons/solid';
import {addErrorAlert} from '@layout/alert';
import {AddCircleIcon} from '@bubbles-ui/icons/outline';
import {LocaleDate, useStore} from '@common';
import {cloneDeep, filter, findIndex, forEach, isNil, map} from 'lodash';
import SelectUserAgent, {SelectUserAgentValueComponent} from '@users/components/SelectUserAgent';
import {getProfilesRequest} from '../../../request';

function getSeverity(classes, value) {
  let count = 0;
  forEach(classes, (classe) => {
    if (classe.students.includes(value)) {
      count++;
    }
  });
  let severity = null;
  if (count === classes.length) {
    severity = 'error';
  } else if (count > 0) {
    severity = 'warning';
  }
  return severity;
}

const ItemComponent = ({classes, onMouseDown, ...props}) => {
  const severity = getSeverity(classes, props.value);
  return (
    <UserDisplayItem
      {...props}
      onMouseDown={(e) => {
        if (severity !== 'error') onMouseDown(e);
      }}
      severity={severity}
    />
  );
};

ItemComponent.propTypes = {
  value: PropTypes.string,
  classes: PropTypes.array,
  onMouseDown: PropTypes.func,
};

const ValueComponent = ({classes, ...props}) => {
  const severity = getSeverity(classes, props.value);
  return <SelectUserAgentValueComponent {...props} severity={severity}/>;
};

ValueComponent.propTypes = {
  value: PropTypes.string,
  classes: PropTypes.array,
  onMouseDown: PropTypes.func,
};

const ByData = ({classes, center, messages, onChange, disableSave}) => {
  const [store, render] = useStore({
    allChecked: false,
    userAgentsChecked: [],
  });

  function getSelectedUserAgents() {
    return store.userAgentsChecked;
  }

  function getSelectedUserAgentsIds() {
    return map(getSelectedUserAgents(), 'value');
  }

  function getClassesThatExceedSeatLimit() {
    const userAgents = getSelectedUserAgentsIds();
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
    onChange(getSelectedUserAgentsIds());
    getClassesThatExceedSeatLimit();
  }

  async function init() {
    const {profiles} = await getProfilesRequest();
    store.profile = profiles.student;
    render();
  }

  React.useEffect(() => {
    getClassesThatExceedSeatLimit();
    init();
    emit();
  }, []);

  React.useEffect(() => {
    (async () => {
      store.selectUserAgent = null;
      store.userAgentsChecked = [];
      emit();
      render();
    })();
  }, [classes]);

  let tableHeaders = [];

  const warnings = filter(store.userAgentsChecked, {severity: 'warning'});

  if (warnings.length) {
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
      Header: messages.surnameHeader,
      accessor: 'surnames',
      className: 'text-left',
    },
    {
      Header: messages.nameHeader,
      accessor: 'name',
      className: 'text-left',
    },
    {
      Header: messages.emailHeader,
      accessor: 'email',
      className: 'text-left',
    },
    {
      Header: messages.birthdayHeader,
      accessor: 'birthdate',
      className: 'text-left',
    },
    {
      Header: ' ',
      accessor: 'actions',
      className: 'text-left',
    },
  ]);

  function onChangeUserAgent(e, userAgent) {
    const ids = getSelectedUserAgentsIds();
    if (!ids.includes(e)) {
      store.selectUserAgent = userAgent;
      render();
    } else {
      store.selectUserAgent = userAgent;
      render();
      addErrorAlert(messages.userAlreadySelected);
      setTimeout(() => {
        store.selectUserAgent = null;
        render();
      }, 1);
    }
  }

  function removeUserAgent(id) {
    const index = findIndex(store.userAgentsChecked, {value: id});
    if (index >= 0) {
      store.userAgentsChecked.splice(index, 1);
      emit();
      render();
    }
  }

  function addUserAgent() {
    const severity = getSeverity(classes, store.selectUserAgent.value);
    const userAgent = store.selectUserAgent;

    store.userAgentsChecked.push({
      ...store.selectUserAgent,
      avatar: (
        <Avatar
          image={store.selectUserAgent.avatar}
          fullName={getUserFullName(store.selectUserAgent)}
        />
      ),
      severity,
      birthdate: <LocaleDate date={store.selectUserAgent.birthdate}/>,
      classStatusDom: (
        <Stack alignItems="center">
          {severity === 'warning' ? (
            <AlertWarningTriangleIcon style={{color: COLORS.fatic03}}/>
          ) : null}
          {severity === 'error' ? <BlockIcon style={{color: COLORS.fatic01}}/> : null}
        </Stack>
      ),
      actions: (
        <Box style={{textAlign: 'right', width: '100%'}}>
          <ActionButton
            onClick={() => removeUserAgent(userAgent.value)}
            tooltip={messages.removeUser}
            icon={<DeleteBinIcon/>}
          />
        </Box>
      ),
    });
    store.selectUserAgent = null;
    emit();
    render();
  }

  return (
    <ContextContainer fullWidth sx={(theme) => ({paddingTop: theme.spacing[4]})}>
      <Stack fullWidth spacing={1}>
        <Box>
          <SelectUserAgent
            value={store.selectUserAgent?.value}
            centers={[center]}
            profiles={[store.profile]}
            onChange={onChangeUserAgent}
            itemRenderProps={{}}
            valueRenderProps={{}}
            itemComponent={(e) => <ItemComponent {...e} classes={classes}/>}
            valueComponent={(e) => <ValueComponent {...e} classes={classes}/>}
          />
        </Box>
        <Box skipFlex>
          <Button variant="light" size="sm" leftIcon={<AddCircleIcon/>} onClick={addUserAgent}>
            {messages.addStudent}
          </Button>
        </Box>
      </Stack>

      {store.classesExceed?.length ? (
        <Alert severity="error" closeable={false}>
          {messages.seatsError1}
          <br/>
          {store.classesExceed.map((classe) => (
            <>
              {messages.seatsClassError
                .replace('{{className}}', classe.classe.name)
                .replace('{{seats}}', classe.seats)}
              <br/>
            </>
          ))}
          {messages.seatsError2}
        </Alert>
      ) : null}
      {store.userAgentsChecked?.length ? (
        <Box>
          <Table columns={tableHeaders} data={store.userAgentsChecked}/>
        </Box>
      ) : null}
    </ContextContainer>
  );
};

ByData.propTypes = {
  messages: PropTypes.object,
  center: PropTypes.string,
  onChange: PropTypes.func,
  disableSave: PropTypes.func,
  classes: PropTypes.array,
};

// eslint-disable-next-line import/prefer-default-export
export {ByData};
