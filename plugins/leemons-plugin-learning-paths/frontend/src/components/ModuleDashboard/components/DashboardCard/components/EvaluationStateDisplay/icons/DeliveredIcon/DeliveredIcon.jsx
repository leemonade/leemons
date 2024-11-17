import React from 'react';
import { DELIVERED_ICON_PROP_TYPES, DELIVERED_ICON_DEFAULT_PROPS } from './DeliveredIcon.constants';

const DeliveredIcon = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.3922 3.09685C10.5635 2.87037 10.5267 2.54165 10.31 2.36265C10.0934 2.18364 9.77895 2.22212 9.60772 2.4486L4.37909 8.61434L4.37321 8.62226C4.35401 8.64869 4.32905 8.66994 4.30041 8.68424C4.27176 8.69854 4.24026 8.70549 4.20853 8.7045C4.1768 8.70351 4.14576 8.69461 4.11799 8.67854C4.09021 8.66247 4.06651 8.63971 4.04885 8.61213L4.04208 8.60184L2.40876 6.17858C2.2497 5.94259 1.93777 5.88609 1.71204 6.05237C1.48631 6.21865 1.43226 6.54475 1.59132 6.78073L3.22166 9.19958C3.32751 9.36285 3.46872 9.49775 3.63386 9.59327C3.80098 9.68994 3.98777 9.74348 4.17867 9.74944C4.36958 9.7554 4.55909 9.71361 4.73143 9.62755C4.90213 9.54231 5.0511 9.41607 5.16619 9.25917L10.3922 3.09685Z"
      fill={color}
      strokeWidth={0}
    />
  </svg>
);

DeliveredIcon.defaultProps = DELIVERED_ICON_DEFAULT_PROPS;
DeliveredIcon.propTypes = DELIVERED_ICON_PROP_TYPES;

DeliveredIcon.displayName = 'DeliveredIcon';
export default DeliveredIcon;
export { DeliveredIcon };
