import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { EditIcon, StudyDeskIcon } from '@bubbles-ui/icons/outline';
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

const ListCard = ({ asset, selected, embedded, single, onRefresh = () => {}, ...props }) => {
  const history = useHistory();
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();

  const [, translations] = useTranslateLoader(prefixPN('cardMenu'));

  const menuLabels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('cardMenu'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
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

    if (asset?.id && embedded) {
      const taskId = asset.providerData?.id;

      if (asset.editable) {
        items.push({
          icon: <EditIcon />,
          children: menuLabels.edit,
          onClick: (e) => {
            e.stopPropagation();
            handleClick(`/private/tasks/library/edit/${taskId}`);
          },
        });
      }

      if (asset.assignable && asset.providerData.published) {
        items.push({
          icon: <StudyDeskIcon />,
          children: menuLabels.assign,
          onClick: (e) => {
            e.stopPropagation();
            handleClick(`/private/tasks/library/assign/${taskId}`);
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
      // TRANSLATE
      variantTitle={'task'}
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
