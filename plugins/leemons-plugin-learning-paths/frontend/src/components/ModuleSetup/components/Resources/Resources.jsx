import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, get, set, uniq } from 'lodash';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  DropdownButton,
  createStyles,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { fireEvent } from 'leemons-hooks';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { AssetPickerDrawer } from '@leebrary/components/AssetPickerDrawer';
import { EmptyState } from '../StructureData/components/EmptyState';
import { ResourcesTable } from './components/ResourcesTable';
import addAction from '../../helpers/addAction';
import { EVENT_BASE, ACTIVITIES_KEY, RESOURCES_KEY } from '../../constants';

export const useResourcesStyles = createStyles((theme) => {
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

export function Resources({ localizations, onPrevStep, scrollRef, onSave }) {
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [sharedData, setSharedData] = useModuleSetupContext();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

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

  const { classes } = useResourcesStyles();
  return (
    <TotalLayoutStepContainer
      stepName={localizations?.tabs?.resources}
      Footer={
        <TotalLayoutFooterContainer
          scrollRef={scrollRef}
          fixed
          leftZone={
            <Button variant="outline" leftIcon={<ChevLeftIcon />} onClick={onPrevStep}>
              {localizations?.buttons?.previous}
            </Button>
          }
          rightZone={
            <>
              <Button variant="link" onClick={onSave} disabled={isLoading}>
                {localizations?.buttons?.saveDraft}
              </Button>

              <DropdownButton
                chevronUp
                width="auto"
                disabled={isLoading || get(sharedData, ACTIVITIES_KEY, [])?.length < 2}
                loading={isLoading}
                data={[
                  {
                    label: localizations?.buttons?.publish,
                    onClick: () =>
                      fireEvent('plugin.learning-paths.modules.edit.onSave&Publish', () =>
                        history.push(
                          '/private/leebrary/assignables.learningpaths.module/list?activeTab=published'
                        )
                      ),
                  },
                  {
                    label: localizations?.buttons?.publishAndAssign,
                    onClick: () =>
                      fireEvent('plugin.learning-paths.modules.edit.onSave&Publish', ({ id }) =>
                        history.push(`/private/learning-paths/modules/${id}/assign`)
                      ),
                  },
                ]}
                sx={{ '&[data-disabled]': { pointerEvents: 'all' } }}
              >
                {localizations?.buttons?.finish}
              </DropdownButton>
            </>
          }
        />
      }
    >
      <Box>
        <AssetPickerDrawer
          layout="rows"
          categories={['media-files', 'bookmarks', 'assignables.content-creator']}
          creatable
          onClose={() => setShowAssetDrawer(false)}
          onSelect={(asset) => {
            const isContentCreator = asset?.providerData?.role === 'content-creator';

            setSharedData((data) =>
              set(
                cloneDeep(data),
                RESOURCES_KEY,
                uniq([
                  ...get(data, RESOURCES_KEY, []),
                  isContentCreator ? { id: asset.id, duplicate: false } : asset.id,
                ])
              )
            );
            setShowAssetDrawer(false);
          }}
          opened={showAssetDrawer}
          shadow
        />
        {get(sharedData, RESOURCES_KEY, [])?.length ? (
          <ResourcesTable
            onAssetChange={(newAssets) => {
              setSharedData((data) => set(cloneDeep(data), RESOURCES_KEY, newAssets));
            }}
            onSelectAsset={() => setShowAssetDrawer(1)}
            onRemoveAsset={(id) =>
              setSharedData((data) => {
                const index = data.state.resources.findIndex((value) => value === id);
                const newData = cloneDeep(data);

                newData.state.resources.splice(index, 1);

                return newData;
              })
            }
            localizations={localizations}
          />
        ) : (
          <EmptyState
            localizations={localizations?.steps?.resourcesData}
            onSelectAsset={() => setShowAssetDrawer(true)}
          />
        )}
      </Box>
    </TotalLayoutStepContainer>
  );
}

Resources.propTypes = {
  localizations: PropTypes.object,
  onPrevStep: PropTypes.func,
  scrollRef: PropTypes.any,
  onSave: PropTypes.func,
};
