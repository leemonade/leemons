import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@bubbles-ui/components';
import { useRenderTextWithCTAsStyles } from './RenderTextWithCTAs.styles';
import { renderReplacer } from './helpers/renderReplacer';

/**
 * @param {object} param0
 * @param {string} param0.t
 * @param {string} param0.text
 * @param {{[key: string]: string | {type: 't' | 'link' | 'linkT', url?: string, value: string}}} param0.replacers
 * @returns {ReactElement}
 *
 * @example
 * <RenderTextWithCTAs
    t={t}
    text="emptyState.description"
    replacers={{
      singularCategory,
      pluralCategory: {
        type: 't',
        value: `emptyState.pluralCategory`,
      },
      CTA: {
        type: 'linkT',
        url: category.createUrl,
        value: `emptyState.descriptionCTA`,
      },
    }}
  />
 */
export function RenderTextWithCTAs({ t, text, replacers, align = 'center' }) {
  const parts = t(text).split(/(\{[^}]+\})/g); // Split by placeholders
  const { classes, cx } = useRenderTextWithCTAsStyles({ align });

  return (
    <Text color="primary" className={classes.text}>
      {parts.map((part, index) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          return renderReplacer({ t, classes, cx, replacers, part, index });
        }
        return part;
      })}
    </Text>
  );
}

RenderTextWithCTAs.propTypes = {
  t: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  replacers: PropTypes.object,
  align: PropTypes.string,
};

export default RenderTextWithCTAs;
