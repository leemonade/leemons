import PropTypes from 'prop-types';
import Image from 'next/image';
import InlineSvg from './InlineSvg';

export default function ImageLoader({ src, alt, forceImage, className }) {
  const isSvg = forceImage ? false : src.toLowerCase().endsWith('.svg');

  return (
    <>
      {isSvg ? (
        <InlineSvg src={src} className={className} />
      ) : (
        <Image layout="fill" src={src} alt={alt} className={className} />
      )}
    </>
  );
}

ImageLoader.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  forceImage: PropTypes.bool,
  className: PropTypes.string,
};
