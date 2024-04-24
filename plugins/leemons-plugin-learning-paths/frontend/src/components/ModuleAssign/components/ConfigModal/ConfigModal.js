import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, LoadingOverlay, Title, Drawer } from '@bubbles-ui/components';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';

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
  const scrollRef = React.useRef(null);

  const roleLocalizations = useRolesLocalizations([role]);

  const Component = useMemo(() => {
    if (!role) {
      return null;
    }

    return components[role] || null;
  }, [role, components]);

  const rawValue = useWatch({
    name: `${stateKey}.raw`,
    disabled: !!assignable && !!Component,
  });

  useEffect(() => {
    setOpened(!!Component);
  }, [Component]);

  if (!Component) {
    return <></>;
  }

  return (
    <Drawer onClose={onClose} shadow trapFocus withOverlay opened={opened} size="xl">
      <Drawer.Header
        title={
          <Title order={3}>{`${localizations?.steps?.setup?.action}: ${
            roleLocalizations[role]?.singular || ''
          }`}</Title>
        }
      />
      <Drawer.Content>
        <ConfigModalErrorBoundary>
          <Component
            fallback={<LoadingOverlay />}
            scrollRef={scrollRef}
            assignable={assignable}
            onClose={onClose}
            value={rawValue}
            onSave={({ config, raw }) => {
              setValue(`${stateKey}.config`, config);
              setValue(`${stateKey}.raw`, raw);
              onClose();
            }}
          />
        </ConfigModalErrorBoundary>
      </Drawer.Content>
    </Drawer>
  );
}

ConfigModal.propTypes = {
  assignable: PropTypes.object,
  components: PropTypes.object,
  localizations: PropTypes.object,
  activityId: PropTypes.string,
  onClose: PropTypes.func,
};
