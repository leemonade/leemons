import React, { forwardRef, useImperativeHandle } from 'react';

import {
  ContextContainer,
  Box,
  createStyles,
  Button,
  LoadingOverlay,
} from '@bubbles-ui/components';
import { EditIcon } from '@bubbles-ui/icons/solid';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { noop } from 'lodash';
import PropTypes from 'prop-types';

import { UserDataset } from './UserDataset';

import { checkForms } from '@users/helpers/dataset';
import prefixPN from '@users/helpers/prefixPN';
import { useUserDatasets } from '@users/hooks';
import { useSaveUserAgentsDatasets } from '@users/hooks/mutations/useSaveUserAgentsDatasets';
import { useSaveUserDatasets } from '@users/hooks/mutations/useSaveUserDatasets';
import { useUserAgentsDatasets } from '@users/hooks/queries/useUserAgentsDatasets';
import { getSessionProfile } from '@users/session';

const DatasetStyles = createStyles((theme) => ({
  container: {
    '& .mantine-InputWrapper-header label': {
      color: theme.colors.text01,
      fontWeight: 500,
    },
    '& .form-group.field .mantine-InputWrapper-root': {
      gap: '2px',
    },
    '& .form-group .section-content-wrapper': {
      gap: '8px',
    },
  },
}));

const UserDatasets = forwardRef(
  (
    {
      userAgentIds = [],
      userId,
      preferEditMode,
      hideReadOnly,
      validateOnlyForMe,
      skipOptional,
      showTitle = true,
      onEdit = noop,
      onCanEdit = noop,
      canHandleEdit = true,
    },
    ref
  ) => {
    const [t] = useTranslateLoader(prefixPN('userDataDatasetPage'));
    const { classes } = DatasetStyles({}, { name: 'UserDatasets' });
    const formActions = React.useRef([]);
    const [, , , getErrorMessage] = useRequestErrorMessage();
    const profileId = getSessionProfile();
    const { data: userAgentsDatasets, isLoading: isLoadingUserAgentsDatasets } =
      useUserAgentsDatasets({
        userAgentIds,
        enabled: userAgentIds?.length > 0,
      });
    const { data: userDatasets, isLoading: isLoadingUserDatasets } = useUserDatasets({
      userIds: [userId],
      enabled: userId?.length > 0,
    });
    const saveUserAgentsDatasetsMutation = useSaveUserAgentsDatasets({ userAgentIds });
    const saveUserDatasetsMutation = useSaveUserDatasets({ userIds: [userId] });

    const datasets = React.useMemo(() => {
      const userDatasetsArray = userDatasets ?? [];
      const userAgentsDatasetsArray = userAgentsDatasets ?? [];
      return [...userDatasetsArray, ...userAgentsDatasetsArray];
    }, [userDatasets, userAgentsDatasets]);

    /**
     * The user can edit the datasets if at least one of them has at least one field that is not readonly.
     * Later, we will allow editing only the fields of the datasets that the user has permission to edit.
     * @returns {boolean}
     */
    const canEdit = React.useMemo(() => {
      if (!canHandleEdit) {
        return false;
      }

      return datasets?.some((dataset) =>
        Object.values(dataset.data.jsonUI).some((field) => !field['ui:readonly'])
      );
    }, [datasets, canHandleEdit]);

    React.useEffect(() => {
      onCanEdit(canEdit);
    }, [canEdit]);

    // ····················································
    // METHODS

    async function handleSave(forms) {
      try {
        const userDataToSave = [];
        const userAgentsToSave = [];

        forms.forEach((dataset) => {
          const toSave = {
            value: dataset.newValues,
            locationName: dataset.locationName,
          };

          if (dataset.locationName === 'user-data') {
            userDataToSave.push({
              ...toSave,
              userId: dataset.userId,
            });
          } else {
            userAgentsToSave.push({
              ...toSave,
              userAgent: dataset.userAgent.id,
            });
          }
        });

        await saveUserDatasetsMutation.mutateAsync(userDataToSave);
        await saveUserAgentsDatasetsMutation.mutateAsync(userAgentsToSave);

        return true;
      } catch (error) {
        addErrorAlert(getErrorMessage(error));
        return false;
      }
    }

    async function checkFormsAndSave() {
      if (!canEdit) {
        return true;
      }

      return checkForms({
        profileId,
        datasets,
        formActions: formActions.current,
        handleSave,
        skipOptional,
      });
    }

    useImperativeHandle(ref, () => ({
      checkFormsAndSave,
    }));

    // ····················································
    // RENDER

    if (!datasets?.length) {
      return null;
    }

    const isLoading = isLoadingUserAgentsDatasets || isLoadingUserDatasets;

    return (
      <ContextContainer
        title={showTitle ? t('additionalInfo') : null}
        className={classes.container}
        titleRightZone={
          showTitle &&
          canEdit &&
          !preferEditMode && (
            <Button variant="link" leftIcon={<EditIcon width={18} height={18} />} onClick={onEdit}>
              Editar
            </Button>
          )
        }
      >
        {isLoading ? (
          <LoadingOverlay visible />
        ) : (
          datasets.map((dataset, i) => (
            <Box key={dataset.locationName}>
              <UserDataset
                hideReadOnly={hideReadOnly}
                validateOnlyForMe={validateOnlyForMe}
                dataset={dataset.data}
                title={dataset.title}
                showTitle={datasets.length > 1}
                isEditMode={canEdit && preferEditMode}
                formActions={(e) => {
                  formActions.current[i] = e;
                }}
              />
            </Box>
          ))
        )}
      </ContextContainer>
    );
  }
);

UserDatasets.displayName = 'UserDatasets';
UserDatasets.propTypes = {
  userAgentIds: PropTypes.arrayOf(PropTypes.string),
  userId: PropTypes.string,
  preferEditMode: PropTypes.bool,
  hideReadOnly: PropTypes.bool,
  validateOnlyForMe: PropTypes.bool,
  skipOptional: PropTypes.bool,
  showTitle: PropTypes.bool,
  onEdit: PropTypes.func,
  onCanEdit: PropTypes.func,
  canHandleEdit: PropTypes.bool,
};

export { UserDatasets };
