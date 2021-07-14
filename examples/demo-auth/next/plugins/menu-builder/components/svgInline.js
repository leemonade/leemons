import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function SvgInline({ src, className }) {
  const [svg, setSvg] = useState(null);
  const [goodSvg, setGoodSvg] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((svgText) => {
        setSvg(svgText);
      })
      .catch(setIsErrored)
      .then(() => setIsLoaded(true));
  }, [src]);

  useEffect(() => {
    if (svg) {
      if (className) {
        const hasStroke = className.indexOf('stroke-current') >= 0;
        const hasFill = className.indexOf('fill-current') >= 0;
        let str = svg;
        if (hasStroke) str = str.replaceAll(/stroke=".+?"/gi);
        if (hasFill) str = str.replaceAll(/fill=".+?"/gi);
        setGoodSvg(str);
      } else {
        setGoodSvg(svg);
      }
    }
  }, [svg, className]);

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
      } ${className}`}
      dangerouslySetInnerHTML={{ __html: goodSvg }}
    />
  );
}

SvgInline.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};
