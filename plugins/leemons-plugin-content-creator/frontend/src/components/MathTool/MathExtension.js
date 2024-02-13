/* eslint-disable import/prefer-default-export */
import { mergeAttributes, InputRule, Node, ReactNodeViewRenderer } from '@bubbles-ui/editors';
import { MathPlayer } from './MathPlayer';

export const MathExtension = Node.create({
  name: 'math',
  group: 'inline',
  inline: true,
  atom: true,

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': this.name,
      }),
    ];
  },

  addInputRules() {
    return [
      new InputRule({
        find: /\$([^\s])([^$]*)\$$/,
        handler: (props) => {
          if (props.match[1].startsWith('$')) {
            return;
          }
          let latex = props.match[1] + props.match[2];
          latex = latex.trim();
          const content = [
            {
              type: 'math',
              attrs: { latex, math: 'true', view: 'formula' },
            },
          ];
          props
            .chain()
            .insertContentAt(
              {
                from: props.range.from,
                to: props.range.to,
              },
              content,
              { updateSelection: true }
            )
            .run();
        },
      }),
    ];
  },
  addAttributes() {
    return {
      latex: {
        default: 'E=mc^2',
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
      id: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => ({
          'data-id': attributes.id,
        }),
      },
    };
  },

  addCommands() {
    return {
      setMath:
        (attributes) =>
        ({ commands }) =>
          commands.insertContent([{ type: this.name, attrs: attributes }]),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathPlayer);
  },
});
