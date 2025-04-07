import useIsMainTeacherInSubject from '@academic-portfolio/hooks/queries/useIsMainTeacherInSubject';
import { createStyles } from '@bubbles-ui/components';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import { LibraryCard } from '@leebrary/components';
import { AssignIcon } from '@leebrary/components/LibraryDetailToolbar/icons/AssignIcon';
import { DeleteIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DeleteIcon';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
import { EditIcon } from '@leebrary/components/LibraryDetailToolbar/icons/EditIcon';
import { ShareIcon } from '@leebrary/components/LibraryDetailToolbar/icons/ShareIcon';
import { useIsOwner } from '@leebrary/hooks/useIsOwner';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TestIcon } from '../../components/Icons/TestIcon';
import { deleteTestRequest, duplicateRequest } from '../../request';

const ListCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.other.core.color.primary['400'],
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const TestsListCard = ({ asset, selected, onRefresh, onShare, ...props }) => {
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const [enableIsTeacherInSubjectQuery, setEnableIsTeacherInSubjectQuery] = useState(false);
  const { classes } = ListCardStyles({ selected });
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const navigate = useNavigate();

  const { data: isMainTeacherInAssetSubjects, isLoading: teacherCheckLoading } =
    useIsMainTeacherInSubject({
      subjectIds: asset.subjects?.length > 0 ? asset.subjects.map((item) => item.subject) : [],
      options: {
        enabled: enableIsTeacherInSubjectQuery && asset.subjects?.length > 0,
        refetchOnWindowFocus: false,
      },
    });

  const onShowMenu = (value) => {
    setEnableIsTeacherInSubjectQuery(value);
  };

  const menuItemsLoading = useMemo(
    () => teacherCheckLoading && asset?.subjects?.length,
    [teacherCheckLoading, asset]
  );

  const isOwner = useIsOwner(asset);

  const menuItems = React.useMemo(() => {
    const items = [];

    if (asset?.id) {
      if (asset.providerData?.published && asset.shareable) {
        items.push({
          icon: <ShareIcon />,
          children: t('share'),
          onClick: (e) => {
            e.stopPropagation();
            onShare(asset);
          },
        });
      }
      if (asset.providerData?.published) {
        const assignAction = (e) => {
          e.stopPropagation();
          if (asset.subjects?.length > 0 && !isMainTeacherInAssetSubjects) {
            const updateAsset = () => navigate(`/private/tests/${asset.providerData.id}`);

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
            navigate(`/private/tests/assign/${asset.providerData.id}`);
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
            navigate(`/private/tests/${asset.providerData.id}`);
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
                  await duplicateRequest({
                    id: asset.providerData.id,
                    published: asset.providerData.published,
                    ignoreSubjects: !isOwner,
                    keepQuestionBank: isOwner,
                  });
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
                  await deleteTestRequest(asset.providerData.id);
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
    }

    return items;
  }, [asset, isOwner, t, isMainTeacherInAssetSubjects]);

  return (
    <LibraryCard
      {...props}
      asset={{ ...asset, fileType: 'test' }}
      menuItems={menuItems}
      variant="tests"
      variantTitle={t('tests')}
      variantIcon={<TestIcon width={18} height={18} />}
      className={classes.root}
      onShowMenu={onShowMenu}
      menuItemsLoading={menuItemsLoading}
    />
  );
};

TestsListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
  onShare: PropTypes.func,
};

export default TestsListCard;
