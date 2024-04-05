import React, { useMemo } from 'react';
import { isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@leebrary/components/LibraryCard';
import loadable from '@loadable/component';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useHistory } from 'react-router-dom';
import { useIsTeacher } from '@academic-portfolio/hooks';
import prefixPN from '../helpers/prefixPN';
import { getCoverUrl, prepareAsset, resolveAssetType } from '../helpers/prepareAsset';
import { ShareIcon } from './LibraryDetailToolbar/icons/ShareIcon';
import { DownloadIcon } from './LibraryDetailToolbar/icons/DownloadIcon';
import { AssignIcon } from './LibraryDetailToolbar/icons/AssignIcon';
import { EditIcon } from './LibraryDetailToolbar/icons/EditIcon';
import { DuplicateIcon } from './LibraryDetailToolbar/icons/DuplicateIcon';
import { DeleteIcon } from './LibraryDetailToolbar/icons/DeleteIcon';

function dynamicImport(pluginName, component) {
  return loadable(() =>
    import(`@leemons/plugins/${pluginName}/src/widgets/leebrary/${component}.js`)
  );
}

const CardWrapperStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.other.core.color.primary['400'],
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
  isEmbeddedList,
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
  assetsLoading,
  isCreationPreview,
  style = {},
  ...props
}) => {
  const asset = !isEmpty(item?.original) ? prepareAsset(item.original) : {};
  const [t] = useTranslateLoader(prefixPN('list'));
  const history = useHistory();
  const { classes } = CardWrapperStyles({ selected });
  const isTeacher = useIsTeacher();

  const menuItems = React.useMemo(() => {
    const items = [];

    if (asset?.id) {
      if (isTeacher) {
        items.push({
          icon: <AssignIcon />,
          children: t('cardToolbar.covertToTask'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/leebrary/assign/${asset.id}`);
          },
        });
      }
      if (asset.shareable) {
        items.push({
          icon: <ShareIcon />,
          children: t('cardToolbar.share'),
          onClick: (e) => {
            e.stopPropagation();
            onShare(asset);
          },
        });
      }
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
      if (asset.editable) {
        items.push({
          icon: <EditIcon />,
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

      if (asset.deleteable) {
        items.push({
          icon: <DeleteIcon />,
          children: t('cardToolbar.delete'),
          onClick: (e) => {
            e.stopPropagation();
            onDelete(asset);
          },
        });
      }
    }

    return items;
  }, [asset, t, isTeacher, history]);

  const Component = useMemo(() => {
    let componentToRender = LibraryCard;
    const componentOwner = category?.componentOwner || category?.pluginOwner;
    if (category?.listCardComponent && componentOwner) {
      try {
        componentToRender = dynamicImport(componentOwner, category.listCardComponent);
      } catch (e) {
        //
      }
    }

    return componentToRender;
  }, [category?.componentOwner, category?.pluginOwner, category?.listCardComponent]);

  return !isNil(category) && !isEmpty(asset) ? (
    <Box key={key} {...props} style={{ display: 'flex', gap: 32, ...style }}>
      <Component
        isCreationPreview={isCreationPreview}
        asset={{
          ...asset,
          ...resolveAssetType(asset.file, category?.key, asset),
          cover: getCoverUrl(asset.cover || asset.file),
        }}
        menuItems={menuItems}
        category={category}
        variant={variant}
        className={classes.root}
        embedded={isEmbedded}
        isEmbeddedList={isEmbeddedList}
        onRefresh={onRefresh}
        onShare={onShare}
        single={single}
        locale={locale}
        isLoading={assetsLoading}
        onPin={onPin}
        onUnpin={onUnpin}
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
  isEmbeddedList: PropTypes.bool,
  single: PropTypes.bool,
  locale: PropTypes.string,
  onDuplicate: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onShare: PropTypes.func,
  onPin: PropTypes.func,
  onUnpin: PropTypes.func,
  onDownload: PropTypes.func,
  assetsLoading: PropTypes.bool,
  realCategory: PropTypes.any,
  isCreationPreview: PropTypes.bool,
  style: PropTypes.object,
};

export { CardWrapper };
export default CardWrapper;
