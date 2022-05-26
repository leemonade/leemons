import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import { filter, forEach, isString, keyBy, map } from 'lodash';
import { Box, COLORS, ImageLoader, Stack, Text, TextClamp } from '@bubbles-ui/components';
import getClassData from '@assignables/helpers/getClassData';
import getUserAgentsInfo from '@users/request/getUserAgentsInfo';
import SelectUserAgent from '@users/components/SelectUserAgent';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash/array';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import getAssignation from '../requests/assignations/getAssignation';

export default function AssignableUserNavigator({ value, instance, onChange = () => {} }) {
  const [t, translations] = useTranslateLoader(prefixPN('userNavigator'));
  const [store, render] = useStore({
    loading: true,
    idLoaded: '',
  });

  async function init() {
    try {
      if (isString(instance)) {
        store.instance = await getAssignableInstance({ id: instance });
      } else {
        store.instance = instance;
      }

      const studentIds = map(store.instance.students, 'user');

      const promises = [];
      forEach(studentIds, (user) => {
        promises.push(getAssignation({ id: store.instance.id, user }));
      });

      const [classe, { userAgents }, assignations] = await Promise.all([
        getClassData(store.instance.classes, { multiSubject: t('multiSubject') }),
        getUserAgentsInfo(studentIds),
        Promise.all(promises),
      ]);

      const assignationsByUser = keyBy(assignations, 'user');

      store.userAgents = filter(
        userAgents,
        (userAgent) => assignationsByUser[userAgent.id]?.finished
      );
      store.class = classe;
      store.idLoaded = store.instance.id;
      store.loading = false;

      store.selectUsers = map(store.userAgents, ({ id, user }) => ({
        ...user,
        id,
        variant: 'rol',
        value: id,
        label: `${user.name}${user.surnames ? ` ${user.surnames}` : ''}`,
      }));

      render();
    } catch (error) {
      console.log(error);
      addErrorAlert(error);
    }
  }

  function changeSelectedUser(e) {
    onChange(e);
    render();
  }

  React.useEffect(() => {
    if (instance && translations) {
      const id = isString(instance) ? instance : instance.id;
      if (id !== store.idLoaded) init();
    }
  }, [instance, translations]);

  const taskHeaderProps = React.useMemo(() => {
    if (store.instance && store.class) {
      return {
        title: store.instance.assignable.asset.name,
        subtitle: store.class.name,
        icon: store.class.icon,
        color: store.class.color,
        styles: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: store.isFirstStep && '50%',
          borderRadius: '16px 16px 0 0',
          backgroundColor: COLORS.uiBackground01,
        },
      };
    }
    return {};
  }, [store.instance, store.class]);

  const currIndx = value ? findIndex(store.userAgents, { id: value }) : null;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors.uiBackground01,
        borderRadius: '16px',
        padding: theme.spacing[4],
        position: 'relative',
      })}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing[4],
        })}
      >
        <TextClamp lines={1}>
          <Text size="lg" strong color="primary">
            {taskHeaderProps.title}
          </Text>
        </TextClamp>
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
          })}
        >
          <Box
            sx={(theme) => ({
              borderRadius: '50%',
              backgroundColor: taskHeaderProps.color,
              padding: theme.spacing[1],
            })}
          >
            <ImageLoader src={taskHeaderProps.icon} height={12} width={12} />
          </Box>
          <Text strong color="primary">
            {taskHeaderProps.subtitle}
          </Text>
        </Box>
      </Box>
      <Box sx={(theme) => ({ marginTop: theme.spacing[6], marginBottom: theme.spacing[4] })}>
        <SelectUserAgent value={value} users={store.selectUsers} onChange={changeSelectedUser} />
      </Box>
      <Stack fullWidth justifyContent="space-between" alignItems="center">
        <Text role="productive" size="xs">
          {t('student')} {value ? currIndx + 1 : 0}/{store.userAgents?.length || 0}
        </Text>
        <Stack>
          {currIndx > 0 ? (
            <Box
              onClick={() => onChange(store.userAgents[currIndx - 1].id)}
              sx={(theme) => ({
                fontSize: theme.fontSizes[4],
                cursor: 'pointer',
                padding: theme.spacing[2],
              })}
            >
              <ChevLeftIcon />
            </Box>
          ) : null}

          {currIndx + 1 < store.userAgents?.length ? (
            <Box
              onClick={() => onChange(store.userAgents[currIndx + 1].id)}
              sx={(theme) => ({
                cursor: 'pointer',
                fontSize: theme.fontSizes[4],
                padding: theme.spacing[2],
                marginLeft: theme.spacing[2],
              })}
            >
              <ChevRightIcon />
            </Box>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

AssignableUserNavigator.propTypes = {
  instance: PropTypes.any,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
