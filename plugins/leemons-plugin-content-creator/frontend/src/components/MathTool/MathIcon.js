/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';

const MathIcon = ({ height, width }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.6666 9.27057C14.1787 9.03387 14.6097 8.6517 14.9061 8.1717C15.2025 7.6917 15.351 7.13509 15.3333 6.57124C15.327 6.14909 15.2357 5.73253 15.0648 5.34647C14.8939 4.9604 14.647 4.61276 14.3387 4.32431C14.0304 4.03587 13.6671 3.81254 13.2705 3.66768C12.8739 3.52283 12.4522 3.45942 12.0306 3.48124C11.6583 2.73189 11.0831 2.10206 10.3706 1.6634C9.65802 1.22474 8.83666 0.994864 7.99993 0.999908C6.87916 0.984872 5.79485 1.39781 4.96799 2.15455C4.14114 2.91129 3.634 3.95487 3.54993 5.07258C3.20695 4.99717 2.85151 4.99879 2.50923 5.07732C2.16696 5.15586 1.84636 5.30935 1.57057 5.52674C1.29477 5.74412 1.07063 6.01999 0.914315 6.33445C0.757997 6.64891 0.67339 6.99414 0.666592 7.34524C0.63975 7.84836 0.792634 8.34465 1.09794 8.74545C1.40324 9.14625 1.84108 9.42547 2.33326 9.53324"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

MathIcon.defaultProps = {
  height: 16,
  width: 16,
};

MathIcon.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export { MathIcon };
