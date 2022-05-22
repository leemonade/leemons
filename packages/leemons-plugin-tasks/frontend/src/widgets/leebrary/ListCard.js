import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { EditIcon, StudyDeskIcon } from '@bubbles-ui/icons/outline';
import { addSuccessAlert } from '@layout/alert';

import { useLayout } from '@layout/context';

const ListCardStyles = createStyles((theme, { single }) => ({
  root: {
    cursor: single ? 'default' : 'pointer',
  },
}));

const ListCard = ({ asset, selected, embedded, single, onRefresh = () => {}, ...props }) => {
  const history = useHistory();
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();

  // ·········································································
  // HANDLERS

  const handleClick = (url, target = 'self', callback) => {
    if (target === 'self') {
      history.push(url);
      return typeof callback === 'function' && callback('redirected', url);
    }

    if (target === 'api') {
      const [method, uri] = url.split('://');
      return leemons
        .api(uri, {
          method,
          allAgents: true,
        })
        .then((v) => typeof callback === 'function' && callback(v));
    }

    return null;
  };

  // ·········································································
  // LABELS & STATICS

  const menuItems = useMemo(() => {
    const items = [];

    if (asset?.id && embedded) {
      const taskId = asset.providerData?.id;

      if (asset.editable) {
        items.push({
          icon: <EditIcon />,
          children: 'Edit',
          onClick: (e) => {
            e.stopPropagation();
            handleClick(`/private/tasks/library/edit/${taskId}`);
          },
        });
      }

      if (asset.assignable) {
        items.push({
          icon: <StudyDeskIcon />,
          children: 'Assign',
          onClick: (e) => {
            e.stopPropagation();
            handleClick(`/private/tasks/library/assign/${taskId}`);
          },
        });
      }

      if (asset.deleteable) {
        items.push({
          icon: <DeleteBinIcon />,
          children: 'Delete',
          onClick: (e) => {
            e.stopPropagation();
            openDeleteConfirmationModal({
              onConfirm: () =>
                handleClick(`DELETE://tasks/tasks/${taskId}`, 'api', () => {
                  addSuccessAlert('Task deleted');
                  onRefresh();
                }),
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
  }, [asset, embedded]);

  // ·········································································
  // RENDER

  const { classes } = ListCardStyles({ selected, single });
  return (
    <LibraryCard
      {...props}
      asset={asset}
      menuItems={menuItems}
      variant="task"
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
};

export default ListCard;
