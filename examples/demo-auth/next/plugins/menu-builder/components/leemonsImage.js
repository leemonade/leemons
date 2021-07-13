import PropTypes from 'prop-types';
import Image from 'next/image';
import SvgInline from './svgInline';

export default function LeemonsImage({ src, alt, forceImage }) {
  const isSvg = forceImage ? false : src.toLowerCase().endsWith('.svg');

  return <>{isSvg ? <SvgInline src={src} /> : <Image layout="fill" src={src} alt={alt} />}</>;
}

LeemonsImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  forceImage: PropTypes.bool,
};
