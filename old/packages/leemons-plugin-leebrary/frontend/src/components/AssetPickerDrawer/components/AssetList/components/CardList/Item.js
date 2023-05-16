import { createStyles } from '@bubbles-ui/components';
import { useLocale } from '@common';
import CardWrapper from '@leebrary/components/CardWrapper';
import React, { useMemo } from 'react';

// useLocalizations

export const useItemStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      background: 'red',
    },
  };
});

function useCardVariant(category) {
  const cardVariant = useMemo(() => {
    let option = 'media';
    switch (category?.key) {
      case 'bookmarks':
        option = 'bookmark';
        break;
      default:
        break;
    }
    return option;
  }, [category?.key]);

  return cardVariant;
}

export function Item({ asset, onSelect }) {
  const locale = useLocale();
  const cardVariant = useCardVariant();

  return (
    <CardWrapper
      item={{ original: asset }}
      variant={cardVariant || 'media'}
      category={asset.category || { key: 'media-file' }}
      realCategory={asset.category}
      isEmbedded
      onClick={() => onSelect(asset)}
      onRefresh={() => { }}
      onDuplicate={() => { }}
      onDelete={() => { }}
      onEdit={() => { }}
      onShare={() => { }}
      onPin={() => { }}
      onUnpin={() => { }}
      onDownload={() => { }}
      locale={locale}
    />
  );
}
