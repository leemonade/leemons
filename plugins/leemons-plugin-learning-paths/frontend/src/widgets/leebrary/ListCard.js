import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@leebrary/components';
import { get } from 'lodash';
import { unflatten } from '@common';
import propTypes from 'prop-types';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import duplicateModuleRequest from '@learning-paths/requests/duplicateModule';
import removeModuleRequest from '@learning-paths/requests/removeModule';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { ModuleCardIcon } from '@learning-paths/components/ModuleCardIcon';
import { AssignIcon } from '@leebrary/components/LibraryDetailToolbar/icons/AssignIcon';
import { DeleteIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DeleteIcon';
import { EditIcon } from '@leebrary/components/LibraryDetailToolbar/icons/EditIcon';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
import { ShareIcon } from '@leebrary/components/LibraryDetailToolbar/icons/ShareIcon';
import useIsMainTeacherInSubject from '@academic-portfolio/hooks/queries/useIsMainTeacherInSubject';

export function useListCardLocalizations() {
  const keys = ['assignables.roles.learningpaths.module.singular', 'learning-paths.libraryCard'];
  const [, translations] = useTranslateLoader(keys);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return {
        variantTitle: get(res, keys[0], ''),
        ...get(res, keys[1], {}),
      };
    }

    return {};
  }, [translations]);
}

function useListCardMenuItems({
  asset,
  localizations,
  onRefresh,
  onShare,
  isMainTeacherInAssetSubjects,
}) {
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const { editable, duplicable, deleteable, name, role, subjects } = asset;
  const isOwner = role === 'owner';
  const canDuplicate = !!duplicable && isOwner;

  const { id, published } = asset.providerData || {};
  const history = useHistory();

  const assignAction = useCallback(
    (e) => {
      e.stopPropagation();
      if (subjects?.length > 0 && !isMainTeacherInAssetSubjects) {
        const updateAsset = () => history.push(`/private/learning-paths/modules/${id}/edit`);

        openConfirmationModal({
          title: localizations?.menuItems?.cannotAssignModal?.title,
          description: isOwner
            ? localizations?.menuItems?.cannotAssignModal?.descriptionWhenOwner
            : localizations?.menuItems?.cannotAssignModal?.descriptionWhenNotOwner,
          onConfirm: isOwner ? updateAsset : undefined,
          labels: {
            confirm: isOwner
              ? localizations?.menuItems?.cannotAssignModal?.edit
              : localizations?.menuItems?.cannotAssignModal?.accept,
          },
        })();
      } else {
        history.push(`/private/learning-paths/modules/${id}/assign`);
      }
    },
    [isMainTeacherInAssetSubjects, subjects, id, isOwner, history]
  );

  return useMemo(
    () =>
      [
        {
          icon: <AssignIcon />,
          children: localizations?.menuItems?.assign,
          onClick: assignAction,
        },
        !!isOwner &&
          asset.providerData?.published &&
          asset.shareable && {
            icon: <ShareIcon />,
            children: localizations?.menuItems?.share,
            onClick: () => {
              onShare(asset);
            },
          },

        !!editable && {
          icon: <EditIcon />,
          children: localizations?.menuItems?.edit,
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/learning-paths/modules/${id}/edit`);
          },
        },
        // {
        //   icon: <ViewOnIcon />,
        //   children: localizations?.menuItems?.view,
        //   onClick: (e) => {
        //     e.stopPropagation();
        //     history.push(`/private/learning-paths/modules/${id}/view`);
        //   },
        // },

        canDuplicate && {
          icon: <DuplicateIcon />,
          children: localizations?.menuItems?.duplicate,
          onClick: () => {
            openConfirmationModal({
              onConfirm: async () => {
                setAppLoading(true);
                try {
                  await duplicateModuleRequest(id, { published: !!published });

                  addSuccessAlert(
                    localizations?.alerts?.duplicate?.success?.replace('{{name}}', name)
                  );
                  onRefresh();
                } catch (e) {
                  addErrorAlert(
                    localizations?.alerts?.duplicate?.error?.replace('{{name}}', name),
                    e.message ?? e.error
                  );
                } finally {
                  setAppLoading(false);
                }
              },
            })();
          },
        },
        !!deleteable && {
          icon: <DeleteIcon />,
          children: localizations?.menuItems?.delete,
          onClick: () => {
            openDeleteConfirmationModal({
              onConfirm: async () => {
                setAppLoading(true);
                try {
                  await removeModuleRequest(id, { published: !!published });

                  addSuccessAlert(
                    localizations?.alerts?.delete?.success?.replace('{{name}}', name)
                  );
                  onRefresh();
                } catch (e) {
                  addErrorAlert(
                    localizations?.alerts?.delete?.error?.replace('{{name}}', name),
                    e.message ?? e.error
                  );
                } finally {
                  setAppLoading(false);
                }
              },
            })();
          },
        },
      ].filter(Boolean),
    [
      asset,
      canDuplicate,
      deleteable,
      editable,
      history,
      id,
      isOwner,
      localizations,
      name,
      onRefresh,
      onShare,
      openConfirmationModal,
      openDeleteConfirmationModal,
      published,
      setAppLoading,
      duplicable,
      isMainTeacherInAssetSubjects,
    ]
  );
}

const useListCardStyles = createStyles((theme, { single, selected }) => ({
  root: {
    cursor: single ? 'default' : 'pointer',
    borderColor: selected && theme.other.core.color.primary['400'],
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

function ListCard({ asset, single, onRefresh = () => {}, onShare, ...props }) {
  const localizations = useListCardLocalizations();
  const { classes } = useListCardStyles({ single });
  const [enableIsTeacherInSubjectQuery, setEnableIsTeacherInSubjectQuery] = useState(false);
  const { data: isMainTeacherInAssetSubjects, isLoading: teacherCheckLoading } =
    useIsMainTeacherInSubject({
      subjectIds: asset.subjects?.length > 0 ? asset.subjects.map((item) => item.subject) : [],
      options: {
        enabled: enableIsTeacherInSubjectQuery && asset.subjects?.length > 0,
        refetchOnWindowFocus: false,
      },
    });

  const menuItems = useListCardMenuItems({
    localizations,
    asset,
    onRefresh,
    onShare,
    isMainTeacherInAssetSubjects,
  });

  const onShowMenu = (value) => {
    setEnableIsTeacherInSubjectQuery(value);
  };

  const menuItemsLoading = useMemo(
    () => teacherCheckLoading && asset?.subjects?.length,
    [teacherCheckLoading, asset]
  );

  return (
    <LibraryCard
      {...props}
      className={classes.root}
      asset={{ ...asset, fileType: 'module' }}
      menuItems={menuItems}
      variant="task"
      variantIcon={<ModuleCardIcon />}
      variantTitle={localizations?.variantTitle}
      onShowMenu={onShowMenu}
      menuItemsLoading={menuItemsLoading}
    />
  );
}

ListCard.propTypes = {
  asset: propTypes.object.isRequired,
  single: propTypes.bool,
  onRefresh: propTypes.func,
  onShare: propTypes.func,
};

export default ListCard;
