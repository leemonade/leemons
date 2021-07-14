import PropTypes from 'prop-types';
import Image from 'next/image';
import SvgInline from './svgInline';

export default function LeemonsImage({ src, alt, forceImage, className }) {
  const isSvg = forceImage ? false : src.toLowerCase().endsWith('.svg');

  return (
    <>
      {isSvg ? (
        <SvgInline src={src} className={className} />
      ) : (
        <Image layout="fill" src={src} alt={alt} className={className} />
      )}
    </>
  );
}

LeemonsImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  forceImage: PropTypes.bool,
  className: PropTypes.string,
};
