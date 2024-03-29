import React from 'react';
import { LOVEFULL_ICON_PROP_TYPES, LOVEFULL_ICON_DEFAULT_PROPS } from './LoveFullIcon.constants';

const LoveFullIcon = ({ width, height, color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <g clipPath="url(#clip0_7430_6900)">
      <path
        d="M17.4751 3.8099C17.1236 3.12243 16.6155 2.52717 15.9918 2.07212C15.368 1.61706 14.6461 1.31496 13.8841 1.19016C13.1222 1.06535 12.3416 1.12135 11.6053 1.35363C10.8689 1.58591 10.1975 1.98798 9.64507 2.5274L9.00007 3.1124L8.37757 2.5424C7.82472 1.99444 7.14922 1.58614 6.40707 1.35137C5.66492 1.11659 4.87749 1.0621 4.11007 1.1924C3.34697 1.31087 2.62332 1.61031 1.99963 2.06569C1.37594 2.52106 0.870326 3.11913 0.525074 3.8099C0.060508 4.71751 -0.101999 5.74979 0.0612443 6.75623C0.224488 7.76268 0.704947 8.69066 1.43257 9.4049L8.46007 16.6499C8.53004 16.7225 8.61392 16.7802 8.7067 16.8197C8.79948 16.8591 8.89926 16.8794 9.00007 16.8794C9.10089 16.8794 9.20067 16.8591 9.29345 16.8197C9.38623 16.7802 9.47011 16.7225 9.54007 16.6499L16.5601 9.4199C17.2902 8.70416 17.7727 7.77399 17.9373 6.7649C18.1018 5.75582 17.9399 4.72054 17.4751 3.8099Z"
        fill="#FF5470"
      />
    </g>
    <defs>
      <clipPath id="clip0_7430_6900">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

LoveFullIcon.defaultProps = LOVEFULL_ICON_DEFAULT_PROPS;
LoveFullIcon.propTypes = LOVEFULL_ICON_PROP_TYPES;

LoveFullIcon.displayName = 'LoveFullIcon';
export default LoveFullIcon;
export { LoveFullIcon };
