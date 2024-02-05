/* eslint-disable import/prefer-default-export */
import {
  mergeAttributes,
  Node,
  ReactNodeViewRenderer,
  MathBlockComponent,
} from '@bubbles-ui/editors';
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
  group: 'inline', // belongs to the 'block' group of extensions
  inline: true,
  content: 'text*',
  exitable: true,
  selectable: true, // so we can select the Card
  draggable: true, // so we can drag the Card
  atom: true, // is a single unit

  parseHTML() {
    return [
      {
        tag: 'math',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['math', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setMath:
        (attributes) =>
        ({ commands }) =>
          commands.insertContent([{ type: this.name, attrs: attributes }]),
      unsetMath:
        () =>
        ({ commands }) =>
          commands.deleteSelection(),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathBlockComponent);
  },
});
