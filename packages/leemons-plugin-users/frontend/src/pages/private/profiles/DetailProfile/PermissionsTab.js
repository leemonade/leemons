import { Box, Select, Stack, Table, createStyles, useDebouncedValue } from '@bubbles-ui/components';
import { CheckCircleIcon } from '@bubbles-ui/icons/outline';
import { useAsync } from '@common/useAsync';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import { getTranslationKey as getTranslationKeyActions } from '@users/actions/getTranslationKey';
import { getTranslationKey as getTranslationKeyPermissions } from '@users/permissions/getTranslationKey';
import { listActionsRequest, listPermissionsRequest } from '@users/request';
import {
  filter,
  find,
  findIndex,
  forEach,
  forIn,
  isEmpty,
  isNil,
  map,
  orderBy,
  uniqBy,
} from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const PermissionsTabStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.interactive01h,
    margin: '0 auto',
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const PermissionsTab = ({
  t,
  profile,
  embedded,
  onPermissionsChange = () => {},
  isEditMode,
}) => {
  const dataTable = useRef([]);
  const initialArrayPermissions = useRef([]);
  const [selectedPermission, setSelectedPermission] = useState('all');
  const [selectPermissions, setSelectPermissions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [actions, setActions] = useState(null);
  const [actionT, setActionT] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [permissionT, setPermissionT] = useState(null);

  const [tableDataDebounced] = useDebouncedValue(tableData, 2000);
  const { classes } = PermissionsTabStyles();

  // ·····················································································
  // DATA PROCESSING

  const sendPermissionChange = () => {
    onPermissionsChange(
      map(dataTable.current, ({ name, permissionName, ...rest }) => {
        const actionNames = [];
        forIn(rest, ({ checked }, key) => {
          if (checked) actionNames.push(key);
        });
        return {
          permissionName,
          actionNames,
        };
      })
    );
  };

  const getPermissionsForTable = (editMode) =>
    permissions.map((permission) => {
      const response = {
        name: permissionT[getTranslationKeyPermissions(permission.permissionName, 'name')],
        permissionName: permission.permissionName,
      };
      actions.map(({ actionName }) => {
        if (permission.actions.indexOf(actionName) >= 0) {
          let cPermission = null;
          if (dataTable.current) {
            cPermission = find(dataTable.current, {
              permissionName: permission.permissionName,
            });
          }
          if (editMode) {
            response[actionName] = {
              type: 'checkbox',
              // eslint-disable-next-line no-nested-ternary
              checked: cPermission
                ? cPermission[actionName].checked
                : profile && profile.permissions[permission.permissionName]
                ? profile.permissions[permission.permissionName].indexOf(actionName) >= 0
                : false,
            };
          } else {
            response[actionName] = () => {
              // eslint-disable-next-line no-nested-ternary
              const checked = cPermission
                ? cPermission[actionName].checked
                : profile && profile.permissions[permission.permissionName]
                ? profile.permissions[permission.permissionName].indexOf(actionName) >= 0
                : false;
              if (checked)
                return (
                  <Box style={{ textAlign: 'center' }}>
                    <CheckCircleIcon className={classes.icon} />
                  </Box>
                );
              return null;
            };
          }
        }
        return null;
      });
      return response;
    });

  async function updateTableData(e) {
    setTableData(e);

    forEach(e, (d) => {
      const index = findIndex(dataTable.current, { permissionName: d.permissionName });
      if (index >= 0) {
        dataTable.current[index] = d;
      }
    });
  }

  async function updateSelectPermissions() {
    const perms = uniqBy(initialArrayPermissions.current, 'pluginName');
    setSelectPermissions(
      map(perms, ({ pluginName }) => ({
        pluginName,
        name: pluginName.split('.')[1],
      }))
    );
  }

  // ·····················································································
  // EFFECTS

  useEffect(() => {
    if (selectedPermission !== 'all') {
      setPermissions(filter(initialArrayPermissions.current, { pluginName: selectedPermission }));
    } else {
      setPermissions(initialArrayPermissions.current);
    }
  }, [selectedPermission]);

  useEffect(() => {
    if (permissions && actions && permissionT) {
      setTableData(getPermissionsForTable(isEditMode));
      const data = getPermissionsForTable(true);
      if ((!dataTable.current || !dataTable.current.length) && data.length)
        dataTable.current = data;
    }
  }, [profile, permissions, actions, permissionT, isEditMode]);

  useEffect(() => {
    // TODO: El sendPermissionChange se ha movido aquí porque estaba retrasando el render de la página. Sin embargo, si se pulsa en el botón de guardar rápidamente, no dará tiempo a que se haya lanzado esta función y por lo tanto ocurrirá un error. Hay que revisarlo para ver cómo podemos optimizar la función y mover esto dentro de updateTableData()
    sendPermissionChange();
  }, [tableDataDebounced]);

  // ·····················································································
  // INIT DATA LOAD

  const initDataLoad = useCallback(async () => {
    const permissionsResponse = await listPermissionsRequest();
    const permissionsTranslate = await getLocalizationsByArrayOfItems(
      permissionsResponse.permissions,
      (permission) => getTranslationKeyPermissions(permission.permissionName, 'name')
    );

    const actionsResponse = await listActionsRequest();
    const actionsTranslate = await getLocalizationsByArrayOfItems(
      actionsResponse.actions,
      (action) => getTranslationKeyActions(action.actionName, 'name')
    );

    return {
      permissions: { ...permissionsResponse, translate: permissionsTranslate },
      actions: { ...actionsResponse, translate: actionsTranslate },
    };
  }, []);

  const onDataLoadSuccess = useCallback(({ permissions: _permissions, actions: _actions }) => {
    initialArrayPermissions.current = orderBy(_permissions.permissions, ['permissionName']);
    setPermissionT(_permissions.translate.items);
    setPermissions(initialArrayPermissions.current);
    updateSelectPermissions();

    setActionT(_actions.translate.items);
    setActions(_actions.actions);
  }, []);
  const onDataLoadError = useCallback(() => {}, []);

  useAsync(initDataLoad, onDataLoadSuccess, onDataLoadError);

  // ··························································································
  // TABLE SETUP

  const tableHeaders = useMemo(() => {
    const result = [
      {
        Header: t('leemon'),
        accessor: 'name',
        // className: 'text-left',
      },
    ];
    if (actions && actionT) {
      forIn(actions, (action) => {
        const key = getTranslationKeyActions(action.actionName, 'name');
        result.push({
          Header: actionT[key] || '',
          accessor: action.actionName,
          // className: 'text-center',
          style: { textAlign: 'center', width: `${Math.round(60 / actions.length)}%` },
        });
      });
    }
    return result;
  }, [actionT, actions, t]);

  const permissionOptions = useMemo(
    () => [
      { label: t('permissions_all'), value: 'all' },
      ...selectPermissions.map(({ pluginName, name }) => ({
        label: name,
        value: pluginName,
      })),
    ],
    [selectPermissions, t]
  );

  return (
    <Stack direction="column" fullWidth>
      <Box style={{ width: embedded ? '100%' : '70%', padding: 12 }}>
        <Select
          label={t('permissions')}
          description={t('select_permissions')}
          orientation="horizontal"
          data={permissionOptions}
          value={selectedPermission}
          onChange={(val) => {
            setSelectedPermission(val);
          }}
        />
      </Box>

      <Box>
        {!isNil(tableData) && !isEmpty(tableData) ? (
          <Table
            columns={tableHeaders}
            data={tableData}
            onChangeData={(val) => (isEditMode ? updateTableData(val.newData) : null)}
          />
        ) : null}
      </Box>
    </Stack>
  );
};

PermissionsTab.propTypes = {
  t: PropTypes.func,
  profile: PropTypes.any,
  onPermissionsChange: PropTypes.func,
  isEditMode: PropTypes.bool,
  embedded: PropTypes.bool,
};
