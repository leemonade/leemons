/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';

import { useFormWithTheme } from '@common/hooks/useFormWithTheme';
import { DATASET_ITEM_DRAWER_DEFAULT_PROPS, DatasetItemDrawer } from '@dataset/components';
import transformItemToSchemaAndUi from '@dataset/components/help/transformItemToSchemaAndUi';
import { addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import {
  getDefaultPlatformLocaleRequest,
  getPlatformLocalesRequest,
  listCentersRequest,
  listProfilesRequest,
} from '@users/request';
import _ from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '../helpers/prefixPN';
import { getDatasetSchemaFieldLocaleRequest, saveDatasetFieldRequest } from '../request';

const ItemDrawer = ({
  onClose = () => {},
  onSave: _onSave = () => {},
  opened,
  item,
  locationName,
  pluginName,
}) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('datasetItemDrawer'));
  const contextRef = useRef({
    drawer: {
      loading: true,
      isSaving: false,
      selectOptions: {},
      ...DATASET_ITEM_DRAWER_DEFAULT_PROPS,
    },
  });
  const [, setR] = useState();
  const SELECT_ALL_LABEL = t('selectOptions.allLabel');

  // ····················································
  // UTILS

  function render() {
    setR(new Date().getTime());
  }

  function getSelectOptionsTranslate(key) {
    return _.map(contextRef.current.drawer.selectOptions[key], (d) => ({
      ...d,
      label: t(`selectOptions.${key}.${d.value}`),
    }));
  }

  // ····················································
  // HELPERS

  function filterSchemaKeys(schema) {
    const schemaGoodKeys = {};
    if (schema.title) schemaGoodKeys.title = schema.title;
    if (schema.description) schemaGoodKeys.description = schema.description;
    if (schema.selectPlaceholder) schemaGoodKeys.selectPlaceholder = schema.selectPlaceholder;
    if (schema.optionLabel) schemaGoodKeys.optionLabel = schema.optionLabel;
    if (schema.yesOptionLabel) schemaGoodKeys.yesOptionLabel = schema.yesOptionLabel;
    if (schema.noOptionLabel) schemaGoodKeys.noOptionLabel = schema.noOptionLabel;
    if (schema.items?.enumNames) schemaGoodKeys.items = { enumNames: schema.items.enumNames };
    if (schema.enumNames) schemaGoodKeys.enumNames = schema.enumNames;
    if (schema.frontConfig?.checkboxLabels) {
      schemaGoodKeys.frontConfig = { checkboxLabels: schema.frontConfig.checkboxLabels };
    }
    return schemaGoodKeys;
  }

  function filterUiKeys(ui) {
    const uiGoodKeys = {};
    if (ui['ui:help']) uiGoodKeys['ui:help'] = ui['ui:help'];
    return uiGoodKeys;
  }

  function prepareSchemaWithAllConfig(data) {
    const schemaWithAllConfig = transformItemToSchemaAndUi(data, Object.keys(data.locales)[0]);
    if (item) {
      schemaWithAllConfig.schema.frontConfig = {
        ...schemaWithAllConfig.schema.frontConfig,
        ...item.frontConfig,
      };
      schemaWithAllConfig.schema.frontConfig.permissions = data.frontConfig.permissions;
    }
    return schemaWithAllConfig;
  }

  function prepareSchemaLocales(data) {
    const schemaLocales = {};
    _.forIn(data.locales, (value, key) => {
      schemaLocales[key] = transformItemToSchemaAndUi(data, key);
      schemaLocales[key].schema = filterSchemaKeys(schemaLocales[key].schema);
      schemaLocales[key].ui = filterUiKeys(schemaLocales[key].ui);
    });
    return schemaLocales;
  }

  function oneOfCentersHasRole(roleId, schemaWithAllConfig) {
    const selectedCenters = _.filter(
      contextRef.current.centers,
      ({ id }) => schemaWithAllConfig.schema.frontConfig.centers.indexOf(id) >= 0
    );
    return selectedCenters.some(({ roles }) => roles.some(({ id }) => id === roleId));
  }

  function assignProfilePermissions(schemaWithAllConfig, permissions) {
    _.forEach(schemaWithAllConfig.schema.frontConfig.permissions, ({ id, view, edit }) => {
      permissions.permissions[id] = [];
      if (view) permissions.permissions[id].push('view');
      if (edit) permissions.permissions[id].push('edit');
    });
  }

  function assignRolePermissions(schemaWithAllConfig, permissions) {
    _.forEach(schemaWithAllConfig.schema.frontConfig.permissions, ({ view, edit, roles }) => {
      _.forEach(roles, (role) => {
        if (oneOfCentersHasRole(role.id, schemaWithAllConfig)) {
          permissions.permissions[role.id] = [];
          if (view) permissions.permissions[role.id].push('view');
          if (edit) permissions.permissions[role.id].push('edit');
        }
      });
    });
  }

  function calculatePermissions(schemaWithAllConfig) {
    const permissionsType = schemaWithAllConfig.schema.frontConfig.isAllCenterMode
      ? 'profile'
      : 'role';
    const permissions = { permissionsType, permissions: {} };

    if (schemaWithAllConfig.schema.frontConfig.permissions) {
      if (permissionsType === 'profile') {
        assignProfilePermissions(schemaWithAllConfig, permissions);
      } else {
        assignRolePermissions(schemaWithAllConfig, permissions);
      }
    }
    return permissions;
  }

  // ····················································
  // METHODS

  async function onSave(_data) {
    const data = _.cloneDeep(_data);
    data.frontConfig = data.config;
    delete data.config;
    try {
      // ES: Datos principales para crear/actualizar el schema
      const schemaWithAllConfig = prepareSchemaWithAllConfig(data);

      // ES: Datos secundarios traducciones
      const schemaLocales = prepareSchemaLocales(data);

      // ES: Calculamos los permisos finales
      const permissions = calculatePermissions(schemaWithAllConfig);
      schemaWithAllConfig.schema = { ...schemaWithAllConfig.schema, ...permissions };

      if (item && item.id) {
        schemaWithAllConfig.schema.id = item.id;
      }

      if (locationName && pluginName) {
        try {
          contextRef.current.drawer.isSaving = true;
          render();
          const dataset = await saveDatasetFieldRequest(
            locationName,
            pluginName,
            schemaWithAllConfig,
            schemaLocales
          );
          contextRef.current.drawer.isSaving = false;
          _onSave(dataset);
          addSuccessAlert(item && item.id ? t('update_done') : t('save_done'));
          onClose();
        } catch (e) {
          contextRef.current.drawer.isSaving = false;
        }
        render();
      } else {
        _onSave({ schemaConfig: schemaWithAllConfig, schemaLocales });
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function load() {
    try {
      if (!tLoading) {
        contextRef.current.drawer.loading = true;
        render();
        const [
          { locale },
          { locales },
          {
            data: { items: profiles },
          },
          {
            data: { items: centers },
          },
        ] = await Promise.all([
          getDefaultPlatformLocaleRequest(),
          getPlatformLocalesRequest(),
          listProfilesRequest({
            page: 0,
            size: 99999,
            withRoles: { columns: ['id'] },
          }),
          listCentersRequest({
            page: 0,
            size: 99999,
            withRoles: { columns: ['id'] },
          }),
        ]);
        contextRef.current.centers = centers;

        contextRef.current.drawer.locales = _.map(locales, ({ name, code }) => ({
          label: name,
          code,
        }));
        contextRef.current.drawer.defaultLocale = locale;
        contextRef.current.drawer.profiles = profiles;
        contextRef.current.drawer.selectOptions.centers = [
          { label: SELECT_ALL_LABEL, value: '*' },
          ..._.map(centers, ({ id, name }) => ({
            label: name,
            value: id,
          })),
        ];

        // User centers
        contextRef.current.drawer.selectOptions.userCenters = [
          { label: SELECT_ALL_LABEL, value: '*' },
          ..._.map(centers, ({ id, name }) => ({
            label: name,
            value: id,
          })),
        ];

        // User profiles
        contextRef.current.drawer.selectOptions.userProfiles = [
          { label: SELECT_ALL_LABEL, value: '*' },
          ..._.map(profiles, ({ id, name }) => ({
            label: name,
            value: id,
          })),
        ];

        contextRef.current.drawer.selectOptions.fieldBooleanInitialState =
          getSelectOptionsTranslate('fieldBooleanInitialState');
        contextRef.current.drawer.selectOptions.fieldMultioptionShowAs =
          getSelectOptionsTranslate('fieldMultioptionShowAs');
        contextRef.current.drawer.selectOptions.fieldBooleanShowAs =
          getSelectOptionsTranslate('fieldBooleanShowAs');
        contextRef.current.drawer.selectOptions.fieldTypes =
          getSelectOptionsTranslate('fieldTypes');

        _.forEach(contextRef.current.drawer.messages, (value, key) => {
          contextRef.current.drawer.messages[key] = t(`messages.${key}`);
        });
        _.forEach(contextRef.current.drawer.errorMessages, (value, key) => {
          contextRef.current.drawer.errorMessages[key] = t(`errorMessages.${key}`);
        });

        contextRef.current.drawer.loading = false;

        if (item) {
          // ES: Cargamos todos los locales del item
          const itemLocales = await Promise.all(
            _.map(contextRef.current.drawer.locales, ({ code }) =>
              getDatasetSchemaFieldLocaleRequest(locationName, pluginName, code, item.id)
            )
          );
          const configLocales = {};
          _.forEach(contextRef.current.drawer.locales, ({ code }, i) => {
            const { schema, ui } = itemLocales[i];
            configLocales[code] = {};
            _.set(configLocales[code], 'schema.title', _.get(schema, 'title', ''));
            _.set(configLocales[code], 'schema.description', _.get(schema, 'description', ''));
            _.set(
              configLocales[code],
              'schema.selectPlaceholder',
              _.get(schema, 'selectPlaceholder', '')
            );
            _.set(configLocales[code], 'schema.optionLabel', _.get(schema, 'optionLabel', ''));
            _.set(
              configLocales[code],
              'schema.yesOptionLabel',
              _.get(schema, 'yesOptionLabel', '')
            );
            _.set(configLocales[code], 'schema.noOptionLabel', _.get(schema, 'noOptionLabel', ''));
            _.set(
              configLocales[code],
              'schema.frontConfig.checkboxLabels',
              _.get(schema, 'frontConfig.checkboxLabels', {})
            );
            _.set(configLocales[code], 'ui.ui:help', _.get(ui, 'ui:help', ''));
          });

          contextRef.current.defaultValues = {
            config: item.schema.frontConfig,
            locales: configLocales,
          };
        }

        render();
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, [tLoading, item]);

  // ····················································
  // RENDER

  return (
    <DatasetItemDrawer
      {...contextRef.current.drawer}
      defaultValues={
        contextRef.current.defaultValues || {
          config: {
            type: 'text_field',
            centers: ['*'],
            isAllCenterMode: true,
          },
        }
      }
      formWithTheme={useFormWithTheme}
      opened={opened}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

ItemDrawer.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  opened: PropTypes.bool,
  item: PropTypes.any,
  locationName: PropTypes.string,
  pluginName: PropTypes.string,
};

export const useDatasetItemDrawer = () => {
  const [show, setShow] = useState(false);

  return [
    function toggle() {
      setShow(!show);
    },
    function drawer(data) {
      return <ItemDrawer onClose={() => setShow(false)} opened={show} {...data} />;
    },
  ];
};

export default useDatasetItemDrawer;
