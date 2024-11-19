import { useEffect, useMemo, useRef, useState } from 'react';

import useAssignables from '@assignables/requests/hooks/queries/useAssignables';
import { Box, createStyles, Stack, Table } from '@bubbles-ui/components';
import { unflatten } from '@common';
import loadable from '@loadable/component';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { get, isFunction, map, uniqBy } from 'lodash';
import PropTypes from 'prop-types';

import { ResourceRenderer } from '../../../ModuleSetup/components/StructureData/components/ModuleComposer/components/ResourceRenderer';
import { ConfigModal } from '../ConfigModal';

import { ConfigAction } from './components/ConfigAction';
import { DeleteAction } from './components/DeleteAction';
import { Duration } from './components/Duration';

import { TypeRenderer } from '@learning-paths/components/ModuleAssign/components/Config/components/TypeRenderer';
import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';
import { prefixPN } from '@learning-paths/helpers';

export function useConfigLocalizations(parentLocalizations) {
  // key is string
  const keys = [
    prefixPN('moduleSetup.steps.structureData.moduleComposer.columns'),
    prefixPN('moduleSetup.steps.structureData.moduleComposer.lastUpdate'),
  ];
  const [, translations] = useTranslateLoader(keys);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return {
        ...parentLocalizations,
        columns: get(res, keys[0], {}),
        lastUpdate: get(res, keys[1], ''),
      };
    }

    return {};
  });
}

export const useConfigStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      padding: globalTheme.spacing.padding.xlg,
    },
  };
});

function useActivities(assignable) {
  const activitiesIds = useMemo(
    () => map(assignable?.submission?.activities, 'activity'),
    [assignable?.submission?.activities]
  );

  const { isLoading, data: assignables } = useAssignables({
    ids: activitiesIds,

    enabled: !!activitiesIds?.length,
    placeholderData: [],
  });

  const assignablesById = useMemo(
    () =>
      Object.fromEntries(assignables?.map((assignableData) => [assignableData.id, assignableData])),
    [assignables]
  );
  const activitiesData = useMemo(
    () =>
      isLoading || !assignables?.length
        ? []
        : assignable?.submission?.activities.map((activity) => ({
            ...activity,
            activity: assignablesById[activity.activity],
          })),
    [activitiesIds, assignablesById]
  );

  return {
    isLoading,
    data: activitiesData,
  };
}

function useParsedActivities({ activities, components, localizations, onConfig }) {
  const { useWatch, setValue } = useModuleAssignContext();
  const timeState = useWatch({ name: 'state.time' });
  const order = useWatch({ name: 'state.order' });

  return useMemo(() => {
    const sortedActivities = order
      ? activities?.sort((a, b) => order?.[a.id] - order?.[b.id])
      : activities;

    return sortedActivities?.map(({ activity, id }) => ({
      id,
      resource: (
        <ResourceRenderer
          activity={activity}
          id={id}
          key={`${id}-resource`}
          localizations={localizations}
        />
      ),
      type: (
        <TypeRenderer
          id={id}
          localizations={localizations?.structureData?.types}
          defaultValue={'mandatory'}
        />
      ),
      time: <Duration id={id} setValue={setValue} timeState={timeState} />,
      actions:
        components[activity.role] && !components[activity.role].disabled?.(activity) ? (
          <Stack sx={{ cursor: 'pointer' }} spacing={2} justifyContent="flex-end" fullWidth>
            <ConfigAction onConfig={onConfig} activity={activity} id={id} />
            <DeleteAction id={id} />
          </Stack>
        ) : (
          <></>
        ),
    }));
  }, [activities, components, localizations, onConfig, setValue, timeState, order]);
}

function useColumns({ localizations }) {
  return useMemo(
    () => [
      {
        Header: localizations?.resource || '',
        accessor: 'resource',
      },
      {
        Header: localizations?.type || '',
        accessor: 'type',
      },
      {
        Header: localizations?.time || '',
        accessor: 'time',
      },
      {
        Header: localizations?.actions || '',
        accessor: 'actions',
      },
    ],
    [localizations]
  );
}

function useLoadRolesComponents(activities) {
  const store = useRef({ imports: {}, loaded: 0, components: {} });
  const [components, setComponents] = useState({});

  const roles = useMemo(
    () =>
      uniqBy(
        activities.map(({ activity }) => activity.roleDetails),
        'name'
      ),
    [activities]
  );

  useEffect(
    () =>
      roles.forEach(({ plugin, name /* , assignmentDrawerComponent */ }) => {
        const pluginName = plugin;
        const assignmentDrawerComponent = `AssignmentDrawer`;

        if (!store.current.imports[name]) {
          store.current.imports[name] = loadable(
            () =>
              import(
                `@app/plugins/${pluginName}/src/widgets/assignables/${assignmentDrawerComponent}.js`
              )
          );

          // EN: Preload each role components, so we can do things with them
          // ES: Pre-cargar los componentes de cada rol para poder usarlos
          store.current.imports[name]
            .load()
            .then((c) => {
              store.current.components[name] = c.default;
            })
            .catch(() => {
              store.current.components[name] = null;
            })
            .finally(() => {
              // EN: Each time a plugin is loaded, add 1 to the counter, so when all the plugins are loaded, we can return the components
              // ES: Cada vez que un plugin se cargue, añádelo al contador, para así poder devolver todos los componentes a la vez
              store.current.loaded++;
              if (roles.length === store.current.loaded) {
                setComponents(store.current.components);
              }
            });
        }
      }),
    [roles]
  );

  return components;
}

function useDefaultValues({ activities, components }) {
  const { getValues, setValue } = useModuleAssignContext();

  useEffect(() => {
    activities.forEach(async ({ id, activity }) => {
      const valueKey = `state.activities.${id}.defaultConfig`;
      const value = getValues(valueKey);

      const component = components[activity.role];

      if (!value && isFunction(component?.defaultValues)) {
        const defaultValues = await component.defaultValues(activity);
        setValue(`${valueKey}`, defaultValues);
      }
      setValue(`state.activities.loaded.${id}`, true);
    });
  }, [activities, components]);
}

export function Config({ assignable, localizations: parentLocalizations }) {
  const localizations = useConfigLocalizations(parentLocalizations);
  const columns = useColumns({ localizations: localizations?.columns });
  const { data: activities } = useActivities(assignable);
  const { setValue } = useModuleAssignContext();

  const [configuratedAssignable, setConfiguratedAssignable] = useState(null);

  const components = useLoadRolesComponents(activities);
  useDefaultValues({ activities, components });

  const parsedActivities = useParsedActivities({
    components,
    activities,
    localizations,
    onConfig: setConfiguratedAssignable,
  });

  const { classes } = useConfigStyles();

  return (
    <Box className={classes.root}>
      {!!configuratedAssignable && (
        <ConfigModal
          localizations={localizations}
          components={components}
          assignable={configuratedAssignable?.activity}
          activityId={configuratedAssignable?.id}
          onClose={() => setConfiguratedAssignable(null)}
        />
      )}

      <Table
        columns={columns}
        data={parsedActivities}
        isAssetList
        sortable
        onChangeData={({ newData }) => {
          const order = {};
          newData.forEach(({ id }, index) => {
            order[id] = index;
          });

          setValue('state.order', order);
        }}
      />
    </Box>
  );
}

Config.propTypes = {
  assignable: PropTypes.object,
  localizations: PropTypes.object,
};
