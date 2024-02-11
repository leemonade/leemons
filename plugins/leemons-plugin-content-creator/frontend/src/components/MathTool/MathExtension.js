/* eslint-disable import/prefer-default-export */
import {
  mergeAttributes,
  Mark,
  InputRule,
  Node,
  ReactNodeViewRenderer,
  MathBlockComponent,
} from '@bubbles-ui/editors';

export const MathExtension = Mark.create({
  name: 'math',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          // Get a specific attribute
          element.getAttribute('data-latex');
        },
      },
    ];
  },
  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-latex'),
        renderHTML: (attributes) => ({
          'data-latex': attributes.latex,
        }),
      },
      math: {
        default: 'true',
        parseHTML: (element) => element.getAttribute('data-math'),
        renderHTML: (attributes) => ({
          'data-math': attributes.math,
        }),
      },
      view: {
        default: 'latex',
        parseHTML: (element) => element.getAttribute('data-view'),
        renderHTML: (attributes) => ({
          'data-view': attributes.view,
        }),
      },
    };
  },
  onUpdate: ({ editor }) => {
    const { state } = editor;
    const { selection, doc } = state;
    console.log('🚀 ~ doc:', doc);
    console.log('🚀 ~ selection:', selection);
    const from = selection.$from.pos;
    const to = selection.$to.pos;
    console.log('🚀 ~ rangeHasMark:', doc.rangeHasMark(from, to, doc.type.schema.marks.math));
    const spanNode = doc.nodesBetween(from, to, (node) => {
      console.log('🚀 ~ spanNode ~ node:', node);
      console.log('🚀 ~ spanNode ~ node.type.name:', node.type.name);
      if (node.type.name === 'paragraph') {
        const parent = node.parent;
        console.log('🚀 ~ spanNode ~ parent:', parent);
        if (parent && parent.type.name === 'math') {
          return true;
        }
      }
      return false;
    });

    if (spanNode && spanNode.length > 0) {
      const latexContent = spanNode[0].textContent;
      editor.commands.updateAttributes('math', { latex: latexContent });
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    let latex = 'x';
    if (node?.attrs?.latex && typeof node?.attrs?.latex === 'string') {
      latex = node.attrs.latex;
    }
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': this.name,
      }),
      latex,
    ];
  },

  addCommands() {
    return {
      setMath:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),
      toggleMath:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
      unsetMath:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-b': () => this.editor.commands.toggleBold(),
      'Mod-B': () => this.editor.commands.toggleBold(),
    };
  },
});
