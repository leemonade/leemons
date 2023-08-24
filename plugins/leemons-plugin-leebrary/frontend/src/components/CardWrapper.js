import React from 'react';
import { isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import loadable from '@loadable/component';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import {
  DownloadIcon,
  DuplicateIcon,
  PluginAssignmentsIcon,
  ShareSocialIcon,
} from '@bubbles-ui/icons/outline';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { useHistory } from 'react-router-dom';
import prefixPN from '../helpers/prefixPN';
import { prepareAsset } from '../helpers/prepareAsset';

function dynamicImport(pluginName, component) {
  return loadable(() =>
    import(`@leemons/plugins/${pluginName.split('.')[1]}/src/widgets/leebrary/${component}.js`)
  );
}

const CardWrapperStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const CardWrapper = ({
  key,
  item,
  headers,
  selected,
  className,
  variant = 'media',
  category,
  realCategory,
  isEmbedded,
  single,
  onRefresh,
  onDuplicate,
  onDelete,
  onEdit,
  onShare,
  onPin,
  onUnpin,
  onDownload,
  locale,
  ...props
}) => {
  const asset = !isEmpty(item?.original) ? prepareAsset(item.original) : {};
  const [t] = useTranslateLoader(prefixPN('list'));
  const history = useHistory();

  const { classes } = CardWrapperStyles({ selected });

  const menuItems = React.useMemo(() => {
    const items = [];

    if (asset?.id) {
      if (asset.editable) {
        items.push({
          icon: <EditWriteIcon />,
          children: t('cardToolbar.edit'),
          onClick: (e) => {
            e.stopPropagation();
            onEdit(asset);
          },
        });
      }
      if (asset.duplicable) {
        items.push({
          icon: <DuplicateIcon />,
          children: t('cardToolbar.duplicate'),
          onClick: (e) => {
            e.stopPropagation();
            onDuplicate(asset);
          },
        });
      }

      items.push({
        icon: <PluginAssignmentsIcon />,
        children: t('cardToolbar.covertToTask'),
        onClick: (e) => {
          e.stopPropagation();
          history.push(`/private/tasks/library/create?from=leebrary&asset=${asset.id}`);
        },
      });

      if (asset.downloadable) {
        items.push({
          icon: <DownloadIcon />,
          children: t('cardToolbar.download'),
          onClick: (e) => {
            e.stopPropagation();
            onDownload(asset);
          },
        });
      }

      if (asset.deleteable) {
        items.push({
          icon: <DeleteBinIcon />,
          children: t('cardToolbar.delete'),
          onClick: (e) => {
            e.stopPropagation();
            onDelete(asset);
          },
        });
      }

      if (asset.shareable) {
        items.push({
          icon: <ShareSocialIcon />,
          children: t('cardToolbar.share'),
          onClick: (e) => {
            e.stopPropagation();
            onShare(asset);
          },
        });
      }
    }

    return items;
  }, [asset, t]);

  let Component = LibraryCard;
  const componentOwner = category?.componentOwner || category?.pluginOwner;

  if (category?.listCardComponent && componentOwner) {
    try {
      Component = dynamicImport(componentOwner, category.listCardComponent);
    } catch (e) {
      //
    }
  }
  const _asset = asset;
  // console.log(category);
  if (realCategory?.key !== 'pins') {
    delete _asset.programName;
  }

  return !isNil(category) && !isEmpty(asset) ? (
    <Box key={key} {...props}>
      <Component
        asset={_asset}
        menuItems={menuItems}
        variant={variant}
        className={classes.root}
        embedded={isEmbedded}
        onRefresh={onRefresh}
        onShare={onShare}
        single={single}
        locale={locale}
      />
    </Box>
  ) : null;
};

CardWrapper.propTypes = {
  key: PropTypes.string,
  item: PropTypes.any,
  headers: PropTypes.any,
  selected: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onRefresh: PropTypes.func,
  variant: PropTypes.string,
  category: PropTypes.any,
  isEmbedded: PropTypes.bool,
  single: PropTypes.bool,
  locale: PropTypes.string,
  onDuplicate: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onShare: PropTypes.func,
  onPin: PropTypes.func,
  onUnpin: PropTypes.func,
  onDownload: PropTypes.func,
};

export { CardWrapper };
export default CardWrapper;
