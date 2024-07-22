import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@leebrary/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@content-creator/helpers/prefixPN';
import { useHistory } from 'react-router-dom';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { deleteDocumentRequest, duplicateDocumentRequest } from '@content-creator/request';
import { DocumentIcon } from '@content-creator/components';
import { AssignIcon } from '@leebrary/components/LibraryDetailToolbar/icons/AssignIcon';
import { DeleteIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DeleteIcon';
import { EditIcon } from '@leebrary/components/LibraryDetailToolbar/icons/EditIcon';
import { ShareIcon } from '@leebrary/components/LibraryDetailToolbar/icons/ShareIcon';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
import { useIsStudent } from '@academic-portfolio/hooks';
import useIsMainTeacherInSubject from '@academic-portfolio/hooks/queries/useIsMainTeacherInSubject';
import { useIsOwner } from '@leebrary/hooks/useIsOwner';

const DocumentCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.other.core.color.primary['400'],
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const DocumentListCard = ({ asset, selected, onRefresh, onShare, ...props }) => {
  const isStudent = useIsStudent();
  const [t] = useTranslateLoader(prefixPN('documentCard'));
  const [enableIsTeacherInSubjectQuery, setEnableIsTeacherInSubjectQuery] = useState(false);
  const { classes } = DocumentCardStyles({ selected });
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();

  const { data: isMainTeacherInAssetSubjects, isLoading: teacherCheckLoading } =
    useIsMainTeacherInSubject({
      subjectIds:
        asset?.providerData?.subjects?.length > 0
          ? asset.providerData.subjects.map((item) => item.subject)
          : [],
      options: {
        enabled: enableIsTeacherInSubjectQuery && asset?.providerData?.subjects?.length > 0,
        refetchOnWindowFocus: false,
      },
    });
  const onShowMenu = (value) => {
    setEnableIsTeacherInSubjectQuery(value);
  };
  const isOwner = useIsOwner(asset);

  const menuItemsLoading = useMemo(
    () => teacherCheckLoading && asset?.providerData?.subjects?.length,
    [teacherCheckLoading, asset]
  );

  const menuItems = React.useMemo(() => {
    const items = [];

    if (!asset?.id) {
      return items;
    }

    if (asset.shareable) {
      items.push({
        icon: <ShareIcon />,
        children: t('share'),
        onClick: (e) => {
          e.stopPropagation();
          onShare(asset);
        },
      });
    }

    if (asset.providerData?.published && !isStudent) {
      const assignAction = (e) => {
        e.stopPropagation();
        if (asset.providerData?.subjects?.length > 0 && !isMainTeacherInAssetSubjects) {
          const updateAsset = () =>
            history.push(`/private/content-creator/${asset.providerData.id}/edit`);

          openConfirmationModal({
            title: t('cannotAssignModal.title'),
            description: isOwner
              ? t('cannotAssignModal.descriptionWhenOwner')
              : t('cannotAssignModal.descriptionWhenNotOwner'),
            onConfirm: isOwner ? updateAsset : undefined,
            labels: {
              confirm: isOwner ? t('cannotAssignModal.edit') : t('cannotAssignModal.accept'),
            },
          })();
        } else {
          history.push(`/private/content-creator/${asset.providerData.id}/assign`);
        }
      };

      items.push({
        icon: <AssignIcon />,
        children: t('assign'),
        onClick: assignAction,
      });
    }
    if (asset.editable) {
      items.push({
        icon: <EditIcon />,
        children: t('edit'),
        onClick: (e) => {
          e.stopPropagation();
          history.push(`/private/content-creator/${asset.providerData.id}/edit`);
        },
      });
    }

    if (asset.duplicable && asset.providerData) {
      items.push({
        icon: <DuplicateIcon />,
        children: t('duplicate'),
        onClick: (e) => {
          e.stopPropagation();
          openConfirmationModal({
            onConfirm: async () => {
              try {
                setAppLoading(true);
                await duplicateDocumentRequest(asset.providerData.id, asset.providerData.published);
                addSuccessAlert(t('duplicated'));
                onRefresh();
              } catch (err) {
                addErrorAlert(getErrorMessage(err));
              }
              setAppLoading(false);
            },
          })();
        },
      });
    }
    if (asset.deleteable) {
      items.push({
        icon: <DeleteIcon />,
        children: t('delete'),
        onClick: (e) => {
          e.stopPropagation();
          openDeleteConfirmationModal({
            onConfirm: async () => {
              try {
                setAppLoading(true);
                await deleteDocumentRequest(asset.providerData.id);
                addSuccessAlert(t('deleted'));
                onRefresh();
              } catch (err) {
                addErrorAlert(getErrorMessage(err));
              }
              setAppLoading(false);
            },
          })();
        },
      });
    }

    return items;
  }, [asset, t, isOwner, isMainTeacherInAssetSubjects]);

  return (
    <LibraryCard
      {...props}
      asset={{ ...asset, fileType: 'content-creator' }}
      menuItems={menuItems}
      variant="document"
      variantTitle={t('document')}
      variantIcon={<DocumentIcon />}
      className={classes.root}
      onShowMenu={onShowMenu}
      menuItemsLoading={menuItemsLoading}
    />
  );
};

DocumentListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
  onShare: PropTypes.func,
};

export default DocumentListCard;
