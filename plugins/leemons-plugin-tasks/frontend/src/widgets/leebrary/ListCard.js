import React, { useMemo } from 'react';
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
import { ExpressTaskIcon } from '../../components/Icons/ExpressTaskIcon';
import { TaskIcon } from '../../components/Icons/TaskIcon';
import { prefixPN } from '../../helpers/prefixPN';

const ListCardStyles = createStyles((theme, { single }) => ({
  root: {
    cursor: single ? 'default' : 'pointer',
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
      if (asset.assignable && asset.providerData?.published) {
        items.push({
          icon: <AssignIcon />,
          children: menuLabels?.assign,
          onClick: (e) => {
            e.stopPropagation();
            handleClick(`/private/tasks/library/assign/${taskId}`);
          },
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
  }, [asset, embedded, menuLabels, onRefresh]);

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
