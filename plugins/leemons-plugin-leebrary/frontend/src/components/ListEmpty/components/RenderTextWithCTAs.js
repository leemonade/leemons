import React from 'react';
import PropTypes from 'prop-types';
import { Text, Anchor } from '@bubbles-ui/components';
import { Link } from 'react-router-dom';
import { useListEmptyStyles } from '../ListEmpty.styles';

export function RenderTextWithCTAs({ t, text, cta, replacers, URL }) {
  const parts = t(text, replacers).split(/(\{[^}]+\})/g); // Split by placeholders
  const { classes, cx } = useListEmptyStyles();

  return (
    <Text color="primary" className={classes.text}>
      {parts.map((part, index) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          const key = part.substring(1, part.length - 1); // Extract key from placeholder
          if (key === 'CTA') {
            const isExternal = URL?.startsWith('http');
            return (
              <Anchor
                as={isExternal ? 'a' : Link}
                to={URL}
                href={URL}
                key={index}
                className={cx(classes.text, classes.cta)}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              >
                {t(cta, replacers)}
              </Anchor>
            );
          }
        }
        return part;
      })}
    </Text>
  );
}

RenderTextWithCTAs.propTypes = {
  t: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  cta: PropTypes.string.isRequired,
  replacers: PropTypes.object,
  URL: PropTypes.string,
};

export default RenderTextWithCTAs;
