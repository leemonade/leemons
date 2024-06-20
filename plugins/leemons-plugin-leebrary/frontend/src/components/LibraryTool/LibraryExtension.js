/* eslint-disable import/prefer-default-export */
import { mergeAttributes, Node, ReactNodeViewRenderer } from '@bubbles-ui/editors';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import _, { isEmpty, isString, keys } from 'lodash';
import { LibraryPlayer } from './LibraryPlayer';
import { AUDIO_ASSET, IMAGE_ASSET, URL_ASSET, VIDEO_ASSET } from './mock/data';

const ASSET_KEYS = keys({
  ...VIDEO_ASSET,
  ...AUDIO_ASSET,
  ...IMAGE_ASSET,
  ...URL_ASSET,
  processed: true,
  fileExtension: '',
  fileId: '',
  coverId: '',
  mediaType: '',
});

function prepareURL(asset) {
  const { fileType, fileExtension } = asset;
  if (fileType === 'bookmark') {
    return asset.url;
  }
  let assetUrl = '';
  if (
    ['document', 'file', 'video', 'audio', 'application'].includes(fileType) &&
    isString(fileExtension)
  ) {
    assetUrl = getFileUrl(asset.fileId);
  }

  return assetUrl;
}

function prepareCoverURL(asset) {
  if (asset.fileType.startsWith('image')) {
    return getFileUrl(asset.coverId || asset.fileId);
  }
  if (asset.coverId) {
    return getFileUrl(asset.coverId);
  }
  return null;
}

export const LibraryExtension = Node.create({
  name: 'library', // unique name for the Node
  group: 'block', // belongs to the 'block' group of extensions
  selectable: true, // so we can select the Card
  draggable: true, // so we can drag the Card
  atom: true, // is a single unit

  addAttributes() {
    return {
      asset: {
        default: {},
        parseHTML: (element) => JSON.parse(element.getAttribute('asset')),
        /**
         * The idea is to render an html tag like <library name="asset.name" url="asset.url" />
         * So, in order to do that, we need to spread all the asset props as nodetag attributes.
         */
        renderHTML: ({ asset: { canAccess, ...asset } }) => {
          const cleanAsset = ASSET_KEYS.reduce((prev, curr) => {
            const item = prev;
            const attr = asset[curr];
            if (attr) {
              item[curr] = attr;
            }
            return item;
          }, {});

          return {
            ...cleanAsset,
            fileId: asset.fileid ?? asset.fileId ?? asset.file?.id ?? asset.file,
            coverId: asset.coverid ?? asset.coverId ?? asset.original?.cover?.id ?? asset.cover?.id,
            mediaType: asset.mediaType || cleanAsset.mediaType,
            tags: JSON.stringify(cleanAsset.tags || []),
            metadata: JSON.stringify(cleanAsset.metadata || []),
          };
        },
      },
      width: {
        default: '100%',
      },
      display: {
        default: 'embed',
      },
      align: {
        default: 'left',
      },
      isFloating: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'library',
        getAttrs: (element) => {
          const asset = ASSET_KEYS.reduce((prev, curr) => {
            const item = prev;
            const attr = element.getAttribute(curr);
            if (attr) {
              item[curr] = attr;
            }
            return item;
          }, {});

          if (!isEmpty(asset)) {
            const coverIdOptions = _.compact([
              asset.coverid,
              asset.coverId,
              asset.original?.cover?.id,
            ]).filter((id) => id !== 'undefined');
            asset.coverId = coverIdOptions.length > 0 ? coverIdOptions[0] : undefined;

            const fileIdOptions = _.compact([asset.fileid, asset.fileId, asset.file?.id]).filter(
              (id) => id !== 'undefined'
            );
            asset.fileId = fileIdOptions.length > 0 ? fileIdOptions[0] : undefined;
            asset.tags = asset.tags ? JSON.parse(asset.tags) : [];
            asset.metadata = asset.metadata ? JSON.parse(asset.metadata) : [];
            asset.fileType = asset.fileType || asset.filetype;
            asset.fileExtension =
              asset.fileExtension ?? asset.fileextension ?? asset.file?.extension;
            asset.mediaType = asset.mediaType ?? asset.mediatype;
            asset.url = prepareURL(asset);
            asset.cover = prepareCoverURL(asset);
            element.setAttribute('asset', JSON.stringify(asset));
          }

          return true;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['library', mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setLibrary:
        (attributes) =>
        ({ commands }) =>
          commands.insertContent([{ type: this.name, attrs: attributes }, { type: 'paragraph' }]),
      unsetLibrary:
        () =>
        ({ commands }) =>
          commands.deleteSelection(),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(LibraryPlayer);
  },
});
