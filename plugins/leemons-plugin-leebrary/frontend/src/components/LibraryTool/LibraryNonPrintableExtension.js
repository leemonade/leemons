/* eslint-disable import/prefer-default-export */
import { Box } from '@bubbles-ui/components';
import { mergeAttributes, Node, ReactNodeViewRenderer } from '@bubbles-ui/editors';
import propTypes from 'prop-types';

const EXTENSION_NAME = 'library-non-printable';

const NonPrintableComponent = ({ node }) => {
  return (
    <Box
      sx={(theme) => {
        const { global } = theme.other;
        return {
          backgroundColor: global.background.color.surface.muted,
          borderRadius: global.border.radius.md,
          padding: theme.spacing[4],
          width: 'fit-content',
          marginTop: theme.spacing[4],
          marginBottom: theme.spacing[4],
        };
      }}
    >
      <Box>{node?.attrs?.message}</Box>

      {node?.attrs?.link && (
        <a href={node?.attrs?.link} target="_blank" rel="noreferrer">
          {node?.attrs?.link}
        </a>
      )}
    </Box>
  );
};
NonPrintableComponent.displayName = 'NonPrintableComponent';

NonPrintableComponent.propTypes = {
  node: propTypes.object.isRequired,
};

export const LibraryNonPrintableExtension = Node.create({
  name: EXTENSION_NAME,
  group: 'block',
  selectable: false,
  draggable: false,
  atom: true,

  addAttributes() {
    return {
      message: {
        default: '',
        parseHTML: (element) => element.getAttribute('message'),
        renderHTML: (attributes) => ({
          message: attributes.message,
        }),
      },
      link: {
        default: null,
        parseHTML: (element) => element.getAttribute('link'),
        renderHTML: (attributes) => ({
          link: attributes.link,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: EXTENSION_NAME,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [EXTENSION_NAME, mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(NonPrintableComponent);
  },
});
