import React from 'react';
import PropTypes from 'prop-types';
import { LogoStyles } from './Logo.styles';

export const LOGO_VARIANTS = ['positive', 'negative'];

export const Logo = ({ variant = LOGO_VARIANTS[0], isotype, className }) => {
  const width = isotype ? '32' : '200';
  const { classes, cx } = LogoStyles({});

  return (
    <svg
      className={cx(classes[variant], className)}
      width={width}
      height="40"
      viewBox={`0 0 ${width} 40`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.4835 14.2889L21.5463 8.53837H4.31261L14.2498 14.2889H31.4835ZM27.6552 31.4617L17.718 25.7111H0.484375L10.4216 31.4617H27.6552Z"
        fill="#7B9D2E"
      />
      <path
        d="M25.2007 4.36937C24.6816 3.99549 24.2905 3.44997 24.096 2.80004C23.7293 1.57492 22.6832 0.531197 21.2655 0.14888C19.8479 -0.233696 18.4238 0.143478 17.4978 1.01977C17.0065 1.48474 16.3971 1.76028 15.7617 1.82263C11.3981 2.25227 7.25869 4.71293 4.31171 8.53818H29.1107C28.0592 6.89858 26.7424 5.47993 25.2007 4.36937ZM6.76537 35.6304C7.28461 36.0044 7.67556 36.5499 7.87011 37.1999C8.23696 38.425 9.28292 39.4686 10.7007 39.851C12.1184 40.2336 13.5423 39.8563 14.4683 38.9801C14.9595 38.5152 15.5691 38.2396 16.2044 38.1771C20.5681 37.7476 24.7074 35.287 27.6544 31.4616H2.85557C3.90689 33.1013 5.22399 34.5198 6.76537 35.6304ZM30.7555 25.7111H0.483479C-0.208588 22.6407 -0.181227 19.2626 0.718487 15.8815C0.862082 15.3444 1.0263 14.8131 1.21076 14.2888H31.4826C32.1747 17.3592 32.1473 20.7374 31.2476 24.1183C31.1041 24.6554 30.9399 25.1867 30.7555 25.7111Z"
        fill="#B1E400"
      />
    </svg>
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf(LOGO_VARIANTS),
  isotype: PropTypes.bool,
  className: PropTypes.string,
};
