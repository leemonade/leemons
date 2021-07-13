import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function SvgInline({ src }) {
  const [svg, setSvg] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then(setSvg)
      .catch(setIsErrored)
      .then(() => setIsLoaded(true));
  }, [src]);

  return (
    <div
      style={{
        display: 'flex',
        overflow: 'hidden',
        position: 'absolute',
        margin: 0,
        inset: 0,
        boxSizing: 'border-box',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className={`svgInline svgInline--${isLoaded ? 'loaded' : 'loading'} ${
        isErrored ? 'svgInline--errored' : ''
      }`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

SvgInline.propTypes = {
  src: PropTypes.string.isRequired,
};
