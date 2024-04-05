import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Form from '@assignables/components/Assignment/Form';
import useAsset from '@leebrary/request/hooks/queries/useAsset';
import { LoadingOverlay } from '@bubbles-ui/components';
import useRole from '@assignables/requests/hooks/queries/useRole';
import { omit } from 'lodash';
import { assignAssetRequest } from '@leebrary/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@leebrary/helpers/prefixPN';
import { useHistory } from 'react-router-dom';

function useAssetAsAssignable({ id }) {
  const { data: asset, isLoading: isLoadingAsset } = useAsset({ id, showPublic: true });

  const roleName = 'leebrary.asset';
  const { data: role, isLoading: isLoadingRole } = useRole({ role: roleName });

  const assignable = useMemo(
    () => ({
      role: roleName,
      roleDetails: role,
      asset,

      gradable: false,
      subjects: [],
    }),
    [asset, role]
  );

  return { data: assignable, isLoading: isLoadingAsset || isLoadingRole };
}

function AssignAsset({ id }) {
  const [t] = useTranslateLoader(prefixPN('assignAsset'));
  const { data: assignable, isLoading } = useAssetAsAssignable({ id });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  const isImage = assignable?.asset?.file?.type?.startsWith('image/');

  const handleAssignment = async ({ raw, value }) => {
    try {
      setIsSubmitting(true);

      await assignAssetRequest({
        assignable: {
          ...omit(assignable, ['roleDetails']),
          asset: {
            name: raw?.title ?? assignable.asset.name,
            color: assignable?.asset?.color,
            cover: raw?.thumbnail !== undefined ? raw.thumbnail : assignable.asset.cover?.id,
          },
          metadata: {
            leebrary: {
              asset: assignable.asset.id,
            },
          },
        },
        instance: value,
      });

      addSuccessAlert(t('successAlert'));
      history.push('/private/assignables/ongoing');
    } catch (e) {
      addErrorAlert(t('errorAlert'), e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Form
      assignable={assignable}
      defaultValues={{ title: assignable.asset.name }}
      evaluationType="none"
      evaluationTypes={['nonEvaluable']}
      showTitle
      showThumbnail={!isImage}
      showInstructions
      showMessageForStudents
      loading={isSubmitting}
      onSubmit={handleAssignment}
      hideShowInCalendar
    />
  );
}

AssignAsset.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AssignAsset;
