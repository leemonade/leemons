import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';

import {
  AssignIcon,
  DuplicateIcon,
  PluginAssignmentsIcon,
  ViewOnIcon,
} from '@bubbles-ui/icons/outline';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '../../helpers/prefixPN';

const ListCardStyles = createStyles((theme, { single }) => ({
  root: {
    cursor: single ? 'default' : 'pointer',
  },
}));

const ListCard = ({ asset, selected, embedded, single, onRefresh = () => { }, ...props }) => {
  const history = useHistory();
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const isExpress = !!asset?.providerData?.metadata?.express;

  const [, translations] = useTranslateLoader([
    prefixPN('cardMenu'),
    'plugins.tasks.variant',
    'plugins.tasks.expressVariant',
  ]);

  const { menuLabels, taskLabel, expressTaskLabel } = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return {
        menuLabels: _.get(res, prefixPN('cardMenu')),
        taskLabel: _.get(res, 'plugins.tasks.variant'),
        expressTaskLabel: _.get(res, 'plugins.tasks.expressVariant'),
      };
    }

    return {
      menuLabels: {},
      taskLabel: '',
    };
  }, [translations]);

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

    if (asset?.id) {
      const taskId = asset.providerData?.id;

      items.push({
        icon: <ViewOnIcon />,
        children: menuLabels.view,
        onClick: (e) => {
          e.stopPropagation();
          handleClick(`/private/tasks/library/view/${taskId}`);
        },
      });
      if (asset.editable) {
        items.push({
          icon: <EditWriteIcon />,
          children: menuLabels.edit,
          onClick: (e) => {
            e.stopPropagation();
            handleClick(`/private/tasks/library/edit/${taskId}`);
          },
        });
      }

      if (asset.assignable && asset.providerData?.published) {
        items.push({
          icon: <AssignIcon />,
          children: menuLabels.assign,
          onClick: (e) => {
            e.stopPropagation();
            handleClick(`/private/tasks/library/assign/${taskId}`);
          },
        });
      }

      if (asset.duplicable && asset.providerData) {
        items.push({
          icon: <DuplicateIcon />,
          children: menuLabels.duplicate,
          onClick: (e) => {
            e.stopPropagation();
            openConfirmationModal({
              onConfirm: () => {
                setAppLoading(true);
                handleClick(`POST://tasks/tasks/${taskId}/duplicate`, 'api', () => {
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
          icon: <DeleteBinIcon />,
          children: menuLabels.delete,
          onClick: (e) => {
            e.stopPropagation();
            openDeleteConfirmationModal({
              onConfirm: () => {
                setAppLoading(true);
                handleClick(`DELETE://tasks/tasks/${taskId}`, 'api', () => {
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
      asset={asset}
      menuItems={menuItems}
      variant="task"
      variantIcon={<PluginAssignmentsIcon />}
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
};

export default ListCard;
