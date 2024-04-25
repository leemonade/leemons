import React, { useEffect, useState } from 'react';
import { Box, Text, TextClamp, ImageLoader } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@learning-paths/helpers/prefixPN';
import { useModuleActivities } from '@learning-paths/hooks/useModuleActivities';
import { capitalize, map, uniq } from 'lodash';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import { AssetMetadataModuleStyles } from './AssetMetadataModule.styles';
import {
  ASSET_METADATA_MODULE_DEFAULT_PROPS,
  ASSET_METADATA_MODULE_PROP_TYPES,
} from './AssetMetadataModule.constants';
import { ModuleCardIcon } from '../ModuleCardIcon';

const AssetMetadataModule = ({ metadata }) => {
  const [t] = useTranslateLoader(prefixPN('moduleDrawer'));
  const [fields, setFields] = useState();
  const activitiesNumber = metadata?.providerData?.submission?.activities.length;
  const activitiesData = metadata?.providerData
    ? useModuleActivities({ module: metadata?.providerData })
    : false;

  const rolesLocalizations = useRolesLocalizations(uniq(map(activitiesData, 'role')));

  const { classes } = AssetMetadataModuleStyles({}, { name: 'AssetMetadataModule' });
  const getActivitiesToRender = (activities) => {
    const activitiesToRender = [];
    if (Array.isArray(activities) && activities.length >= 1) {
      activities.forEach((activity) => {
        const name = activity?.asset?.name;
        const icon = activity?.roleDetails?.icon;
        const role = activity?.roleDetails?.name;
        activitiesToRender.push({
          name,
          icon,
          role,
        });
      });
    }
    return activitiesToRender;
  };

  useEffect(() => {
    if (activitiesData) {
      setFields(getActivitiesToRender(activitiesData));
    }
  }, [activitiesData]);

  // if (!fields) return null;

  return (
    <Box>
      <Box className={classes.typologyContainer}>
        <ModuleCardIcon width={24} height={24} />
        <Text className={classes.value}>{t('module')}</Text>
      </Box>
      <Box className={classes.box}>
        <Box>
          <Text className={classes.title}>{`${t('activities')}: `}</Text>
          <Text className={classes.value}>{activitiesNumber}</Text>
        </Box>
      </Box>
      <Box className={classes.tableWrapper}>
        <Box className={classes.tableRow}>
          <Box className={classes.tableColumnName}>
            <Text>{t('name')}</Text>
          </Box>
          <Box className={classes.tableColumnType}>
            <Text>{t('Type')}</Text>
          </Box>
        </Box>
      </Box>
      {!!fields &&
        fields.map((activity, index) => (
          <Box
            className={classes.tableRowMap}
            key={index}
            style={{
              borderBottom: index !== fields.length - 1 ? '1px solid #DDE1E6' : 'none',
            }}
          >
            <Box className={classes.tableColumActivity}>
              <TextClamp lines={1}>
                <Text>{activity.name}</Text>
              </TextClamp>
            </Box>
            <Box className={classes.tableTypology}>
              <Box
                style={{
                  position: 'relative',
                }}
              >
                <ImageLoader
                  style={{
                    width: 18,
                    height: 18,
                    position: 'relative',
                    color: '#878D96',
                  }}
                  width={18}
                  height={18}
                  src={activity.icon}
                />
              </Box>
              <TextClamp lines={1}>
                <Text>{capitalize(rolesLocalizations[activity.role]?.singular)}</Text>
              </TextClamp>
            </Box>
          </Box>
        ))}
    </Box>
  );
};
AssetMetadataModule.propTypes = ASSET_METADATA_MODULE_PROP_TYPES;
AssetMetadataModule.defaultProps = ASSET_METADATA_MODULE_DEFAULT_PROPS;
AssetMetadataModule.displayName = 'AssetMetadataModule';

export default AssetMetadataModule;
export { AssetMetadataModule };
