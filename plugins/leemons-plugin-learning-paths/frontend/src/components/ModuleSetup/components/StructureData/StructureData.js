import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Tooltip,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { v4 as uuidv4 } from 'uuid';
import { fireEvent } from 'leemons-hooks';
import { cloneDeep, get, noop, set, without } from 'lodash';
import { useRoles } from '@assignables/components/Ongoing/AssignmentList/components/Filters/components/Type/Type';
import addAction from '@learning-paths/components/ModuleSetup/helpers/addAction';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { AssetPickerDrawer } from '@leebrary/components/AssetPickerDrawer';
import { EmptyState } from './components/EmptyState';
import { ModuleComposer } from './components/ModuleComposer';
import { EVENT_BASE, ACTIVITIES_KEY } from '../../constants';

const MEDIA_FILES_CATEGORY = 'media-files';
const BOOKMARKS_CATEGORY = 'bookmarks';

const ACTIVITY_TYPE = 'activity';
const ASSET_TYPE = 'asset';

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

  const selectableCategories = useMemo(
    () => [
      ...without(
        assignablesRoles?.map((role) => `assignables.${role?.value}`) ?? [],
        'assignables.learningpaths.module'
      ),
      MEDIA_FILES_CATEGORY,
      BOOKMARKS_CATEGORY,
    ],
    [assignablesRoles]
  );

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
                label={localizations?.buttons?.tooltips?.disabledNotActivities}
                disabled={get(sharedData, ACTIVITIES_KEY, [])?.length > 1}
              >
                <Box>
                  <Button
                    onClick={() => onNextStep()}
                    rightIcon={<ChevRightIcon />}
                    disabled={isLoading || get(sharedData, ACTIVITIES_KEY, [])?.length < 2}
                    loading={isLoading}
                  >
                    {_localizations?.buttons?.next}
                  </Button>
                </Box>
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
            const { providerData } = asset;
            const type = providerData ? ACTIVITY_TYPE : ASSET_TYPE;

            setSharedData((data) =>
              set(cloneDeep(data), ACTIVITIES_KEY, [
                ...get(data, ACTIVITIES_KEY, []),
                {
                  activity: providerData?.id ?? asset?.id,
                  default: {
                    type: 'mandatory',
                  },
                  id: uuidv4(),
                  type,
                },
              ])
            );
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
    </TotalLayoutStepContainer>
  );
}

export default StructureData;

StructureData.propTypes = {
  localizations: PropTypes.object,
  onPrevStep: PropTypes.func,
  onNextStep: PropTypes.func,
  onSave: PropTypes.func,
  scrollRef: PropTypes.any,
};
