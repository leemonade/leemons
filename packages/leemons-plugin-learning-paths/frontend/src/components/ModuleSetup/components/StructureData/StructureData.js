import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  DropdownButton,
  Tooltip,
  createStyles,
  useResizeObserver,
  useViewportSize,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { uuidv4 } from '@bubbles-ui/leemons';

import { fireEvent } from 'leemons-hooks';
import { cloneDeep, get, set, without } from 'lodash';

import { useRoles } from '@assignables/components/Ongoing/AssignmentList/components/Filters/components/Type/Type';
import { addErrorAlert } from '@layout/alert';
import addAction from '@learning-paths/components/ModuleSetup/helpers/addAction';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { AssetPickerDrawer } from '@leebrary/components/AssetPickerDrawer';
import { useHistory } from 'react-router-dom';
import { EmptyState } from './components/EmptyState';
import { ModuleComposer } from './components/ModuleComposer';

export const useStructureDataStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
    },
    content: {
      paddingLeft: globalTheme.spacing.padding.xlg,
      paddingRight: globalTheme.spacing.padding.xlg,
      paddingTop: globalTheme.spacing.padding.xlg,
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      borderTop: `1px solid ${globalTheme.border.color.line.muted}`,
      marginTop: globalTheme.spacing.padding.xlg,

      paddingLeft: globalTheme.spacing.padding.xlg,
      paddingRight: globalTheme.spacing.padding.xlg,
      paddingTop: globalTheme.spacing.padding.xlg,
      paddingBottom: globalTheme.spacing.padding.xlg,
    },
  };
});

function useOnSave() {
  const eventBase = 'plugin.learning-paths.modules.edit';
  useEffect(
    () =>
      addAction(`${eventBase}.onSave`, () => {
        fireEvent(`${eventBase}.onSave.intercepted`);

        fireEvent(`${eventBase}.onSave.succeed`);
      }),
    []
  );
}

export function StructureData({ localizations: _localizations, onPrevStep }) {
  useOnSave();
  const [isLoading, setIsLoading] = useState(false);
  const eventBase = 'plugin.learning-paths.modules.edit';

  useEffect(
    () =>
      addAction(`${eventBase}.onSave`, () => {
        setIsLoading(true);
      }),
    [setIsLoading]
  );

  useEffect(
    () => addAction(`${eventBase}.onSave.finished`, () => setIsLoading(false)),
    [setIsLoading]
  );

  const history = useHistory();

  const localizations = _localizations?.steps?.structureData;
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [sharedData, setSharedData] = useModuleSetupContext();

  const { width: viewportWidth } = useViewportSize();
  const [boxRef, rect] = useResizeObserver();
  const drawerSize = useMemo(() => Math.max(viewportWidth / 2, 500), [viewportWidth, rect]);

  const assignablesRoles = useRoles();

  const selectableCategories = useMemo(() =>
    without(
      assignablesRoles?.map((role) => `assignables.${role?.value}`) ?? [],
      'assignables.learningpaths.module'
    )
  );

  const { classes } = useStructureDataStyles();

  return (
    <Box>
      <Box className={classes.content} ref={boxRef}>
        <AssetPickerDrawer
          layout="rows"
          opened={showAssetDrawer}
          size={drawerSize}
          shadow
          categories={selectableCategories}
          onClose={() => setShowAssetDrawer(0)}
          onSelect={(asset) => {
            if (!asset?.providerData) {
              addErrorAlert(localizations?.alerts?.error?.nonAssignableAsset);
            } else {
              const { providerData } = asset;

              setSharedData((data) =>
                set(cloneDeep(data), 'state.activities', [
                  ...get(data, 'state.activities', []),
                  {
                    activity: providerData?.id,
                    default: {
                      type: 'mandatory',
                    },
                    id: uuidv4(),
                  },
                ])
              );
            }
            setShowAssetDrawer(0);
          }}
        />
        {get(sharedData, 'state.activities', [])?.length ? (
          <ModuleComposer
            onActivityChange={(newActivities) =>
              setSharedData((data) => set(cloneDeep(data), 'state.activities', newActivities))
            }
            onSelectAsset={() => setShowAssetDrawer(1)}
            onRemoveAsset={(id) =>
              setSharedData((data) => {
                const index = data.state.activities.findIndex((value) => value.id === id);
                const newData = cloneDeep(data);

                newData.state.activities.splice(index, 1);

                return newData;
              })
            }
            localizations={localizations}
          />
        ) : (
          <EmptyState onSelectAsset={() => setShowAssetDrawer(1)} localizations={localizations} />
        )}
      </Box>
      <Box className={classes.buttons}>
        <Button variant="link" leftIcon={<ChevLeftIcon />} onClick={onPrevStep}>
          {_localizations?.buttons?.previous}
        </Button>
        <Tooltip
          label={_localizations?.buttons?.tooltips?.disabledNotResources}
          disabled={get(sharedData, 'state.activities', [])?.length > 1}
        >
          <Box>
            <DropdownButton
              disabled={get(sharedData, 'state.activities', [])?.length < 2}
              loading={isLoading}
              data={[
                {
                  label: _localizations?.buttons?.publish,
                  onClick: () =>
                    fireEvent('plugin.learning-paths.modules.edit.onSave&Publish', () =>
                      history.push(
                        '/private/leebrary/assignables.learningpaths.module/list?activeTab=published'
                      )
                    ),
                },
                // {
                //   label: _localizations?.buttons?.publishAndShare,
                //   onClick: () =>
                //     fireEvent('plugin.learning-paths.modules.edit.onSave&Publish', () =>
                //       alert('Should redirect to share options')
                //     ),
                // },
                {
                  label: _localizations?.buttons?.publishAndAssign,
                  onClick: () =>
                    fireEvent('plugin.learning-paths.modules.edit.onSave&Publish', ({ id }) =>
                      history.push(`/private/learning-paths/modules/${id}/assign`)
                    ),
                },
              ]}
              sx={{ '&[data-disabled]': { pointerEvents: 'all' } }}
            >
              {_localizations?.buttons?.publishOptions}
            </DropdownButton>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}

StructureData.propTypes = {
  localizations: PropTypes.object,
  onPrevStep: PropTypes.func,
};
