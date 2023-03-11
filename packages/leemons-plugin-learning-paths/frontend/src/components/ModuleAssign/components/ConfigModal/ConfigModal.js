import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Drawer, Loader, Text, createStyles } from '@bubbles-ui/components';
import loadable from '@loadable/component';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';
import { get } from 'lodash';

// useLocalizations

export const useConfigModalStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    drawerHeader: {
      ...globalTheme.content.typo.heading.md,
      flexGrow: 1,
      paddingLeft: globalTheme.spacing.padding.xlg,
    },
  };
});

export class ConfigModalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert severity="error" closeable={false}>
          No config component was defined for this activity
        </Alert>
      );
    }

    return this.props.children;
  }
}

export function ConfigModal({ assignable, components, localizations, activityId, onClose }) {
  const { role } = assignable;
  const [opened, setOpened] = useState(false);
  const { setValue, useWatch } = useModuleAssignContext();
  const stateKey = `state.activities.${activityId}`;

  const roleLocalizations = useRolesLocalizations([role]);

  const Component = useMemo(() => {
    if (!role) {
      return null;
    }

    return components[role] || null;

    // const [, pluginName] = roleDetails.plugin.split('.');

    // return loadable(() =>
    //   import(`@leemons/plugins/${pluginName}/src/widgets/assignables/AssignmentDrawer.js`)
    // );
  }, [role]);

  const rawValue = useWatch({
    name: `${stateKey}.raw`,
    disabled: !!assignable && !!Component,
  });

  useEffect(() => {
    setOpened(!!Component);
  }, [Component]);

  const { classes } = useConfigModalStyles();

  if (!Component) {
    return <></>;
  }

  return (
    // TRANSLATE
    <Drawer
      opened={opened}
      onClose={onClose}
      shadow
      size={600}
      contentPadding={0}
      trapFocus
      withOverlay
      header={
        <Text className={classes.drawerHeader}>{`${localizations?.steps?.setup?.action}: ${get(roleLocalizations, `${role}.singular`) || ''
          }`}</Text>
      }
    >
      <ConfigModalErrorBoundary>
        <Component
          fallback={<Loader />}
          assignable={assignable}
          value={rawValue}
          onSave={({ config, raw }) => {
            setValue(`${stateKey}.config`, config);
            setValue(`${stateKey}.raw`, raw);
            onClose();
          }}
        />
      </ConfigModalErrorBoundary>
    </Drawer>
  );
}

ConfigModal.propTypes = {
  assignable: PropTypes.object,
};
