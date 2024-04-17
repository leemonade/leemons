import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Alert,
  BaseDrawer,
  LoadingOverlay,
  Title,
  ActionButton,
  createStyles,
  TotalLayoutContainer,
  Stack,
} from '@bubbles-ui/components';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';
import { RemoveIcon } from '@bubbles-ui/icons/outline';

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
  const scrollRef = React.useRef(null);

  const roleLocalizations = useRolesLocalizations([role]);

  const Component = useMemo(() => {
    if (!role) {
      return null;
    }

    return components[role] || null;
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
    <BaseDrawer
      empty
      shadow
      trapFocus
      withOverlay
      opened={opened}
      onClose={onClose}
      size={728}
      contentPadding={0}
      close={false}
    >
      <TotalLayoutContainer
        clean
        scrollRef={scrollRef}
        Header={
          <Stack
            fullWidth
            justifyContent="space-between"
            alignItems="center"
            style={{
              padding: `0 16px 0 24px`,
              height: 70,
            }}
          >
            <Title order={3}>{`${localizations?.steps?.setup?.action}: ${
              roleLocalizations[role]?.singular || ''
            }`}</Title>
            <Box>
              <ActionButton icon={<RemoveIcon />} onClick={onClose} />
            </Box>
          </Stack>
        }
      >
        <Stack ref={scrollRef} fullWidth fullHeight style={{ overflowY: 'auto' }}>
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
        </Stack>
      </TotalLayoutContainer>
    </BaseDrawer>
  );
}

ConfigModal.propTypes = {
  assignable: PropTypes.object,
  components: PropTypes.object,
  localizations: PropTypes.object,
  activityId: PropTypes.string,
  onClose: PropTypes.func,
};
