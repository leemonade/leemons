import React from 'react';
import prefixPN from '@assignables/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { get } from 'lodash';
import { unflatten } from '@common';
import { Box, Text, ImageLoader } from '@bubbles-ui/components';
import { ROLENAMES_DEFAULT_PROPS, ROLENAMES_PROP_TYPES } from './RoleName.constants';
import { useRoleNameStyles } from './RoleName.styles';

function useRoleLocalization(role) {
  const localizationKey = prefixPN(`roles.${role}.singular`);

  const [, translations] = useTranslateLoader(localizationKey);

  return React.useMemo(() => {
    if (!translations?.items) {
      return '';
    }

    const res = unflatten(translations.items);
    return get(res, localizationKey);
  }, [translations]);
}
function RoleName({ role }) {
  const roleName = useRoleLocalization(role.name);
  const { classes } = useRoleNameStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.icon}>
        <ImageLoader src={role.icon} height={16} width={16} />
      </Box>
      <Text className={classes.text} transform="capitalize">
        {roleName}
      </Text>
    </Box>
  );
}

RoleName.propTypes = ROLENAMES_PROP_TYPES;
RoleName.defaultProps = ROLENAMES_DEFAULT_PROPS;

export default RoleName;
export { RoleName };
