import * as _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  getDefaultPlatformLocaleRequest,
  getPlatformLocalesRequest,
  listCentersRequest,
  listProfilesRequest,
} from '@users/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addSuccessAlert } from '@layout/alert';
import PropTypes from 'prop-types';
import {
  DATASET_ITEM_DRAWER_DEFAULT_PROPS,
  DatasetItemDrawer as DatasetItemDrawerBubbles,
} from '@bubbles-ui/leemons';
import formWithTheme from '@common/formWithTheme';
import prefixPN from '../helpers/prefixPN';
import transformItemToSchemaAndUi from './help/transformItemToSchemaAndUi';
import { getDatasetSchemaFieldLocaleRequest, saveDatasetFieldRequest } from '../request';

const DatasetItemDrawer = ({
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

  function render() {
    setR(new Date().getTime());
  }

  function getSelectOptionsTranslate(key) {
    return _.map(contextRef.current.drawer.selectOptions[key], (d) => ({
      ...d,
      label: t(`selectOptions.${key}.${d.value}`),
    }));
  }

  async function onSave(_data) {
    const data = _.cloneDeep(_data);
    data.frontConfig = data.config;
    delete data.config;
    try {
      // ES: Datos principales para crear/actualizar el schema
      const schemaWithAllConfig = transformItemToSchemaAndUi(data, Object.keys(data.locales)[0]);
      if (item) {
        schemaWithAllConfig.schema.frontConfig = {
          ...schemaWithAllConfig.schema.frontConfig,
          ...item.frontConfig,
        };
        schemaWithAllConfig.schema.frontConfig.permissions = data.frontConfig.permissions;
      }
      // ES: Datos secundarios traducciones
      const schemaLocales = {};
      _.forIn(data.locales, (value, key) => {
        schemaLocales[key] = transformItemToSchemaAndUi(data, key);

        // Schema
        const schemaGoodKeys = {};
        if (schemaLocales[key].schema.title) schemaGoodKeys.title = schemaLocales[key].schema.title;
        if (schemaLocales[key].schema.description)
          schemaGoodKeys.description = schemaLocales[key].schema.description;
        if (schemaLocales[key].schema.selectPlaceholder)
          schemaGoodKeys.selectPlaceholder = schemaLocales[key].schema.selectPlaceholder;
        if (schemaLocales[key].schema.optionLabel)
          schemaGoodKeys.optionLabel = schemaLocales[key].schema.optionLabel;
        if (schemaLocales[key].schema.yesOptionLabel)
          schemaGoodKeys.yesOptionLabel = schemaLocales[key].schema.yesOptionLabel;
        if (schemaLocales[key].schema.noOptionLabel)
          schemaGoodKeys.noOptionLabel = schemaLocales[key].schema.noOptionLabel;
        if (schemaLocales[key].schema.items?.enumNames)
          schemaGoodKeys.items = { enumNames: schemaLocales[key].schema.items.enumNames };
        if (schemaLocales[key].schema.enumNames)
          schemaGoodKeys.enumNames = schemaLocales[key].schema.enumNames;
        if (schemaLocales[key].schema.frontConfig?.checkboxLabels)
          schemaGoodKeys.frontConfig = {
            checkboxLabels: schemaLocales[key].schema.frontConfig.checkboxLabels,
          };
        schemaLocales[key].schema = schemaGoodKeys;

        // Ui
        const uiGoodKeys = {};
        if (schemaLocales[key].ui['ui:help'])
          uiGoodKeys['ui:help'] = schemaLocales[key].ui['ui:help'];
        schemaLocales[key].ui = uiGoodKeys;
      });
      // ES: Calculamos los permisos finales
      const permissions = {
        // ES: Si esta marcado como que los permisos afecten a todos los centros decimos que las ids
        // son de tipo perfil, si solo afecta a unos centros en concreto es rol por que se almacenaran
        // las ids de los roles que sean la interseccion de centro - perfil
        permissionsType: schemaWithAllConfig.schema.frontConfig.isAllCenterMode
          ? 'profile'
          : 'role',
        permissions: {},
      };
      if (schemaWithAllConfig.schema.frontConfig.permissions) {
        if (permissions.permissionsType === 'profile') {
          _.forEach(schemaWithAllConfig.schema.frontConfig.permissions, ({ id, view, edit }) => {
            permissions.permissions[id] = [];
            if (view) permissions.permissions[id].push('view');
            if (edit) permissions.permissions[id].push('edit');
          });
        } else {
          const oneOfCentersHasRole = (role) => {
            const selectedCenters = _.filter(
              contextRef.current.centers,
              ({ id }) => schemaWithAllConfig.schema.frontConfig.centers.indexOf(id) >= 0
            );
            let hasRole = false;
            // eslint-disable-next-line consistent-return
            _.forEach(selectedCenters, ({ roles }) => {
              // eslint-disable-next-line consistent-return
              _.forEach(roles, ({ id }) => {
                if (id === role) {
                  hasRole = true;
                  return false;
                }
              });
              if (hasRole) return false;
            });
            return hasRole;
          };
          _.forEach(schemaWithAllConfig.schema.frontConfig.permissions, ({ view, edit, roles }) => {
            _.forEach(roles, (role) => {
              if (oneOfCentersHasRole(role.id)) {
                permissions.permissions[role.id] = [];
                if (view) permissions.permissions[role.id].push('view');
                if (edit) permissions.permissions[role.id].push('edit');
              }
            });
          });
        }
      }

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
          { label: t('selectOptions.allLabel'), value: '*' },
          ..._.map(centers, ({ id, name }) => ({
            label: name,
            value: id,
          })),
        ];

        // User centers
        contextRef.current.drawer.selectOptions.userCenters = [
          { label: t('selectOptions.allLabel'), value: '*' },
          ..._.map(centers, ({ id, name }) => ({
            label: name,
            value: id,
          })),
        ];

        // User profiles
        contextRef.current.drawer.selectOptions.userProfiles = [
          { label: t('selectOptions.allLabel'), value: '*' },
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

  return (
    <DatasetItemDrawerBubbles
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
      formWithTheme={formWithTheme}
      opened={opened}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

DatasetItemDrawer.propTypes = {
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
      return <DatasetItemDrawer onClose={() => setShow(false)} opened={show} {...data} />;
    },
  ];
};

export default useDatasetItemDrawer;
