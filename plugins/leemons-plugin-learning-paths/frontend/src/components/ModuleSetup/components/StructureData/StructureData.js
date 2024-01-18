import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  createStyles,
  Tooltip,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { v4 as uuidv4 } from 'uuid';
import { fireEvent } from 'leemons-hooks';
import { cloneDeep, get, noop, set, without } from 'lodash';
import { useRoles } from '@assignables/components/Ongoing/AssignmentList/components/Filters/components/Type/Type';
import { addErrorAlert } from '@layout/alert';
import addAction from '@learning-paths/components/ModuleSetup/helpers/addAction';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { AssetPickerDrawer } from '@leebrary/components/AssetPickerDrawer';
import { EmptyState } from './components/EmptyState';
import { ModuleComposer } from './components/ModuleComposer';
import { EVENT_BASE, ACTIVITIES_KEY } from '../../constants';

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

export function StructureData({
  localizations: _localizations,
  scrollRef,
  onPrevStep = noop,
  onNextStep = noop,
  onSave = noop,
}) {
  useOnSave();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () =>
      addAction(`${EVENT_BASE}.onSave`, () => {
        setIsLoading(true);
      }),
    [setIsLoading]
  );

  useEffect(
    () => addAction(`${EVENT_BASE}.onSave.finished`, () => setIsLoading(false)),
    [setIsLoading]
  );

  const localizations = _localizations?.steps?.structureData;
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [sharedData, setSharedData] = useModuleSetupContext();

  const assignablesRoles = useRoles();

  const selectableCategories = useMemo(() =>
    without(
      assignablesRoles?.map((role) => `assignables.${role?.value}`) ?? [],
      'assignables.learningpaths.module'
    )
  );

  const { classes } = useStructureDataStyles();

  return (
    <TotalLayoutStepContainer
      stepName={_localizations?.tabs?.structure}
      Footer={
        <TotalLayoutFooterContainer
          scrollRef={scrollRef}
          fixed
          leftZone={
            <Button variant="outline" leftIcon={<ChevLeftIcon />} onClick={onPrevStep}>
              {_localizations?.buttons?.previous}
            </Button>
          }
          rightZone={
            <>
              <Button variant="link" onClick={onSave} disabled={isLoading}>
                {_localizations?.buttons?.saveDraft}
              </Button>
              <Tooltip
                label={localizations?.buttons?.tooltips?.disabledNotResources}
                disabled={get(sharedData, ACTIVITIES_KEY, [])?.length > 1}
              >
                <Button
                  onClick={() => onNextStep()}
                  rightIcon={<ChevRightIcon />}
                  disabled={isLoading || get(sharedData, ACTIVITIES_KEY, [])?.length < 2}
                  loading={isLoading}
                >
                  {_localizations?.buttons?.next}
                </Button>
              </Tooltip>
            </>
          }
        />
      }
    >
      <Box>
        <AssetPickerDrawer
          layout="rows"
          opened={showAssetDrawer}
          shadow
          categories={selectableCategories}
          onClose={() => setShowAssetDrawer(0)}
          onSelect={(asset) => {
            if (!asset?.providerData) {
              addErrorAlert(localizations?.alerts?.error?.nonAssignableAsset);
            } else {
              const { providerData } = asset;

              setSharedData((data) =>
                set(cloneDeep(data), ACTIVITIES_KEY, [
                  ...get(data, ACTIVITIES_KEY, []),
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
        {get(sharedData, ACTIVITIES_KEY, [])?.length ? (
          <ModuleComposer
            onActivityChange={(newActivities) =>
              setSharedData((data) => set(cloneDeep(data), ACTIVITIES_KEY, newActivities))
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
      {/*
      <Box className={classes.buttons}>
        <Button variant="link" leftIcon={<ChevLeftIcon />} onClick={onPrevStep}>
          {_localizations?.buttons?.previous}
        </Button>
        <Tooltip
          label={_localizations?.buttons?.tooltips?.disabledNotResources}
          disabled={get(sharedData, ACTIVITIES_KEY, [])?.length > 1}
        >
          <Box>
            <DropdownButton
              disabled={get(sharedData, ACTIVITIES_KEY, [])?.length < 2}
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
      */}
    </TotalLayoutStepContainer>
  );
}

StructureData.propTypes = {
  localizations: PropTypes.object,
  onPrevStep: PropTypes.func,
  onNextStep: PropTypes.func,
  onSave: PropTypes.func,
  scrollRef: PropTypes.any,
};
