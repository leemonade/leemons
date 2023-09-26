import React from 'react';
import { Link } from 'react-router-dom';
import { LINK_WRAPPER_DEFAULT_PROPS, LINK_WRAPPER_PROP_TYPES } from './LinkWrapper.constants';

const LinkWrapper = ({ useRouter, url, id, children }) => {
  if (url) {
    if (useRouter) {
      return (
        <Link key={id} to={url} style={{ textDecoration: 'none' }}>
          {children}
        </Link>
      );
    }
    return (
      <a key={id} href={url} style={{ textDecoration: 'none' }}>
        {children}
      </a>
    );
  }
  return children;
};

export { LinkWrapper };

LinkWrapper.defaultProps = LINK_WRAPPER_DEFAULT_PROPS;
LinkWrapper.propTypes = LINK_WRAPPER_PROP_TYPES;
