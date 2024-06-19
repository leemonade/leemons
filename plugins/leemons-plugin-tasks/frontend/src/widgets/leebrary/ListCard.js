import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@leebrary/components';
import { addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import _, { noop } from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { AssignIcon } from '@leebrary/components/LibraryDetailToolbar/icons/AssignIcon';
import { DeleteIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DeleteIcon';
import { EditIcon } from '@leebrary/components/LibraryDetailToolbar/icons/EditIcon';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
import { ShareIcon } from '@leebrary/components/LibraryDetailToolbar/icons/ShareIcon';
import useIsMainTeacherInSubject from '@academic-portfolio/hooks/queries/useIsMainTeacherInSubject';
import { useIsOwner } from '@leebrary/hooks/useIsOwner';
import { ExpressTaskIcon } from '../../components/Icons/ExpressTaskIcon';
import { TaskIcon } from '../../components/Icons/TaskIcon';
import { prefixPN } from '../../helpers/prefixPN';

const ListCardStyles = createStyles((theme, { single, selected }) => ({
  root: {
    cursor: single ? 'default' : 'pointer',
    borderColor: selected && theme.other.core.color.primary['400'],
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const ListCard = ({
  asset,
  selected,
  embedded,
  single,
  onShare,
  onRefresh = () => {},
  ...props
}) => {
  const history = useHistory();
  const [enableIsTeacherInSubjectQuery, setEnableIsTeacherInSubjectQuery] = useState(false);
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const isExpress = !!asset?.providerData?.metadata?.express;

  const [, translations] = useTranslateLoader([
    prefixPN('cardMenu'),
    'tasks.variant',
    'tasks.expressVariant',
  ]);

  const { menuLabels, taskLabel, expressTaskLabel } = useMemo(() => {
    if (translations?.items) {
      const res = unflatten(translations.items);

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return {
        menuLabels: _.get(res, prefixPN('cardMenu')),
        taskLabel: _.get(res, 'tasks.variant'),
        expressTaskLabel: _.get(res, 'tasks.expressVariant'),
      };
    }

    return {
      menuLabels: {},
      taskLabel: '',
    };
  }, [translations]);

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

  // ·········································································
  // HANDLERS

  const handleClick = (url, target = 'self', callback = noop) => {
    if (target === 'self') {
      history.push(url);
      return callback('redirected', url);
    }

    if (target === 'api') {
      const [method, uri] = url.split('://');
      return leemons
        .api(uri, {
          method,
          allAgents: true,
        })
        .then((v) => callback(v));
    }

    return null;
  };

  // ·········································································
  // LABELS & STATICS

  const menuItems = useMemo(() => {
    const items = [];

    if (asset?.id) {
      const taskId = asset.providerData?.id;

      // items.push({
      //   icon: <ViewOnIcon />,
      //   children: menuLabels.view,
      //   onClick: (e) => {
      //     e.stopPropagation();
      //     handleClick(`/private/tasks/library/view/${taskId}`);
      //   },
      // });
      if (asset.providerData?.published && asset.shareable) {
        items.push({
          icon: <ShareIcon />,
          children: menuLabels.share,
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
            const updateAsset = () => handleClick(`/private/tasks/library/edit/${taskId}`);

            openConfirmationModal({
              title: menuLabels?.cannotAssignModal.title,
              description: isOwner
                ? menuLabels?.cannotAssignModal.descriptionWhenOwner
                : menuLabels?.cannotAssignModal.descriptionWhenNotOwner,
              onConfirm: isOwner ? updateAsset : undefined,
              labels: {
                confirm: isOwner
                  ? menuLabels?.cannotAssignModal.edit
                  : menuLabels?.cannotAssignModal.accept,
              },
            })();
          } else {
            handleClick(`/private/tasks/library/assign/${taskId}`);
          }
        };

        items.push({
          icon: <AssignIcon />,
          children: menuLabels?.assign,
          onClick: assignAction,
        });
      }
      if (asset.editable) {
        items.push({
          icon: <EditIcon />,
          children: menuLabels?.edit,
          onClick: (e) => {
            e.stopPropagation();
            handleClick(`/private/tasks/library/edit/${taskId}`);
          },
        });
      }
      if (asset.duplicable && asset.providerData) {
        items.push({
          icon: <DuplicateIcon />,
          children: menuLabels?.duplicate,
          onClick: (e) => {
            e.stopPropagation();
            openConfirmationModal({
              onConfirm: () => {
                setAppLoading(true);
                handleClick(`POST://v1/tasks/tasks/${taskId}/duplicate`, 'api', () => {
                  addSuccessAlert('Task duplicated');
                  setAppLoading(false);
                  onRefresh();
                });
              },
            })();
          },
        });
      }

      if (asset.deleteable) {
        items.push({
          icon: <DeleteIcon />,
          children: menuLabels?.delete,
          onClick: (e) => {
            e.stopPropagation();
            openDeleteConfirmationModal({
              onConfirm: () => {
                setAppLoading(true);
                handleClick(`DELETE://v1/tasks/tasks/${taskId}`, 'api', () => {
                  addSuccessAlert('Task deleted');
                  setAppLoading(false);
                  onRefresh();
                });
              },
            })();
          },
        });
      }
      // {
      //   icon: <DuplicateIcon />,
      //   children: 'Duplicate',
      //   onClick: handleClick(`/private/tasks/library/edit/${task.id}`),
      // },
    }

    return items;
  }, [asset, embedded, menuLabels, onRefresh, isMainTeacherInAssetSubjects, isOwner]);

  // ·········································································
  // RENDER

  const { classes } = ListCardStyles({ selected, single });
  return (
    <LibraryCard
      {...props}
      asset={{ ...asset, fileType: 'task' }}
      menuItems={menuItems}
      variant="task"
      variantIcon={isExpress ? <ExpressTaskIcon /> : <TaskIcon />}
      // TRANSLATE
      variantTitle={isExpress ? expressTaskLabel : taskLabel}
      className={classes.root}
      selected={selected}
      onShowMenu={onShowMenu}
      menuItemsLoading={menuItemsLoading}
    />
  );
};

ListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  embedded: PropTypes.bool,
  onRefresh: PropTypes.func,
  single: PropTypes.bool,
  onShare: PropTypes.func,
};

export default ListCard;
