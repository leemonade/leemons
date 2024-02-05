/* eslint-disable import/prefer-default-export */
import { mergeAttributes, Node, ReactNodeViewRenderer } from '@bubbles-ui/editors';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { isEmpty, isString, keys } from 'lodash';
import { MathPlayer } from './MathPlayer';

const ASSET_KEYS = keys({
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
  if (['document', 'file'].includes(fileType) && isString(fileExtension)) {
    assetUrl = getFileUrl(asset.fileId);
  }
  return assetUrl;
}

function prepareCoverURL(asset) {
  return getFileUrl(asset.coverId || asset.fileId);
}

export const MathExtension = Node.create({
  name: 'math', // unique name for the Node
  group: 'block', // belongs to the 'block' group of extensions
  selectable: true, // so we can select the Card
  draggable: true, // so we can drag the Card
  atom: true, // is a single unit

  addAttributes() {
    return {
      asset: {
        default: {},
        parseHTML: (element) => JSON.parse(element.getAttribute('asset')),

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
        default: 'player',
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
        tag: 'math',
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
            asset.coverId = asset.coverid ?? asset.coverId ?? asset.original?.cover?.id;
            asset.fileId = asset.fileid ?? asset.fileId ?? asset.file?.id;
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
    return ['math', mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setMath:
        (attributes) =>
        ({ commands }) =>
          commands.insertContent([{ type: this.name, attrs: attributes }, { type: 'paragraph' }]),
      unsetMath:
        () =>
        ({ commands }) =>
          commands.deleteSelection(),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathPlayer);
  },
});
