import React from 'react';
import { Anchor } from '@bubbles-ui/components';
import { Link } from 'react-router-dom';

export function renderLink({ t, classes, cx, replacers, replacer, index }) {
  const { url: URL, value: cta } = replacer;
  const isExternal = URL?.startsWith('http');
  return (
    <Anchor
      as={isExternal ? 'a' : Link}
      target={isExternal ? '_blank' : ''}
      to={!isExternal ? URL : undefined}
      href={URL}
      key={index}
      className={cx(classes.text, classes.cta)}
    >
      {replacer.type === 'linkT' ? t(cta, replacers) : cta}
    </Anchor>
  );
}

export default renderLink;
