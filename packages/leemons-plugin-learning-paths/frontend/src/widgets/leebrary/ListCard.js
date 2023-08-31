import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { createStyles } from '@bubbles-ui/components';
import {
  AssignIcon,
  DeleteBinIcon,
  DuplicateIcon,
  PluginLearningPathsIcon,
  ShareIcon,
  ViewOnIcon,
} from '@bubbles-ui/icons/outline';
import { LibraryCard } from '@bubbles-ui/leemons';

import { get } from 'lodash';

import { EditWriteIcon } from '@bubbles-ui/icons/solid';
import { unflatten } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import duplicateModuleRequest from '@learning-paths/requests/duplicateModule';
import removeModuleRequest from '@learning-paths/requests/removeModule';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

export function useListCardLocalizations() {
  const keys = [
    'plugins.assignables.roles.learningpaths.module.singular',
    'plugins.learning-paths.libraryCard',
  ];
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

function useListCardMenuItems({ asset, localizations, onRefresh, onShare }) {
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const { editable, duplicable, deleteable, name, role } = asset;
  const isOwner = role === 'owner';
  const canDuplicate = !!duplicable && isOwner;

  const { id, published } = asset.providerData || {};
  const history = useHistory();

  return useMemo(
    () =>
      [
        !!editable && {
          icon: <EditWriteIcon />,
          children: localizations?.menuItems?.edit,
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/learning-paths/modules/${id}/edit`);
          },
        },
        {
          icon: <ViewOnIcon />,
          children: localizations?.menuItems?.view,
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/learning-paths/modules/${id}/view`);
          },
        },
        {
          icon: <AssignIcon />,
          children: localizations?.menuItems?.assign,
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/learning-paths/modules/${id}/assign`);
          },
        },
        canDuplicate && {
          icon: <DuplicateIcon />,
          children: localizations?.menuItems?.duplicate,
          onClick: () => {
            openConfirmationModal({
              title: localizations?.duplicate?.title,
              description: localizations?.duplicate?.message?.replace('{{name}}', name),
              onConfirm: async () => {
                setAppLoading(true);
                try {
                  await duplicateModuleRequest(id, { published: !!published });

                  addSuccessAlert(localizations?.duplicate?.success?.replace('{{name}}', name));
                  onRefresh();
                } catch (e) {
                  addErrorAlert(
                    localizations?.duplicate?.error?.replace('{{name}}', name),
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
          icon: <DeleteBinIcon />,
          children: localizations?.menuItems?.delete,
          onClick: () => {
            openDeleteConfirmationModal({
              title: localizations?.delete?.title,
              description: localizations?.delete?.message?.replace('{{name}}', name),
              onConfirm: async () => {
                setAppLoading(true);
                try {
                  await removeModuleRequest(id, { published: !!published });

                  addSuccessAlert(localizations?.delete?.success?.replace('{{name}}', name));
                  onRefresh();
                } catch (e) {
                  addErrorAlert(
                    localizations?.delete?.error?.replace('{{name}}', name),
                    e.message ?? e.error
                  );
                } finally {
                  setAppLoading(false);
                }
              },
            })();
          },
        },
        !!isOwner && {
          icon: <ShareIcon />,
          children: localizations?.menuItems?.share,
          onClick: () => {
            onShare(asset);
          },
        },
      ].filter(Boolean),
    [
      history,
      localizations,
      openConfirmationModal,
      openDeleteConfirmationModal,
      setAppLoading,
      id,
      editable,
      duplicable,
      deleteable,
      name,
    ]
  );
}

const useListCardStyles = createStyles((theme, { single }) => ({
  root: {
    cursor: single ? 'default' : 'pointer',
  },
}));

function ListCard({ asset, single, onRefresh = () => { }, onShare = () => { }, ...props }) {
  const localizations = useListCardLocalizations();

  const menuItems = useListCardMenuItems({ localizations, asset, onRefresh, onShare });

  const { classes } = useListCardStyles({ single });

  return (
    <LibraryCard
      className={classes.root}
      asset={asset}
      menuItems={menuItems}
      variant="task"
      variantIcon={<PluginLearningPathsIcon />}
      variantTitle={localizations?.variantTitle}
    />
  );
}

export default ListCard;
