import { TotalLayoutHeader } from '@bubbles-ui/components';
import { unflatten } from '@common';
import propTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN as _prefixPN } from '@scores/helpers';
import _ from 'lodash';
import React, { useMemo } from 'react';

function useHeaderLocalizations({ prefixPN, variant }) {
  const prefix = prefixPN || _prefixPN;
  const key = prefix(`${variant}.header.teacher`);
  const [, translations] = useTranslateLoader(key);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return _.get(res, key);
    }

    return {};
  }, [translations]);
}

export function Header({ prefixPN, variant }) {
  const localizations = useHeaderLocalizations({ prefixPN, variant });

  return (
    <TotalLayoutHeader
      title={localizations?.title}
      cancelable={false}
      icon={
        <svg
          width="24"
          height="24"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.9059 1.02237C11.8095 1.00369 11.7101 1.00699 11.6152 1.03197L4.82563 3.23606H12.4389V1.67126C12.4389 1.56945 12.4155 1.46902 12.3705 1.3778C12.3256 1.28658 12.2602 1.20703 12.1796 1.14538C12.0991 1.08373 12.0054 1.04163 11.9059 1.02237ZM13.4441 3.23606V1.67147C13.4441 1.414 13.385 1.1599 13.2713 0.929192C13.1575 0.698456 12.9923 0.497261 12.7884 0.341312C12.5846 0.185362 12.3476 0.0788773 12.0961 0.0301686C11.8445 -0.0185402 11.5852 -0.00815516 11.3383 0.0605132C11.3314 0.0624194 11.3246 0.0644717 11.3178 0.0666686L3.20796 2.69937C2.86222 2.79815 2.55751 3.00695 2.33967 3.2946C2.11948 3.58536 2.00016 3.94064 2 4.30606V16.4595C1.99996 16.7169 2.05911 16.9711 2.17283 17.2018C2.28656 17.4325 2.45181 17.6337 2.65566 17.7896C2.7107 17.8317 2.7716 17.8607 2.83463 17.877C2.92276 17.9536 3.03766 18 3.16335 18H14.3375C14.7784 18 15.2013 17.8239 15.5131 17.5105C15.8248 17.1971 16 16.7721 16 16.3289L15.9999 4.90717C15.9999 4.46397 15.8248 4.03891 15.513 3.72552C15.2012 3.41212 14.7784 3.23606 14.3375 3.23606H13.4441ZM3.26958 16.9896H14.3375C14.5118 16.9896 14.679 16.9199 14.8023 16.796C14.9255 16.6721 14.9948 16.5041 14.9948 16.3289L14.9947 4.90717C14.9947 4.73195 14.9255 4.56391 14.8022 4.44001C14.679 4.31611 14.5118 4.2465 14.3375 4.2465H3.00797C3.00615 4.26639 3.00523 4.28642 3.00522 4.30652V16.4597C3.0052 16.5615 3.02859 16.6619 3.07355 16.7532C3.11852 16.8444 3.18384 16.9239 3.26444 16.9856C3.26616 16.9869 3.26788 16.9882 3.26958 16.9896Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.36075 7.80056C7.55721 7.80056 7.73553 7.91598 7.81683 8.09576L9.89591 12.6935C10.0104 12.9467 9.89903 13.2452 9.64714 13.3603C9.39526 13.4754 9.09825 13.3634 8.98376 13.1102L7.36075 9.5211L5.73775 13.1102C5.62325 13.3634 5.32625 13.4754 5.07436 13.3603C4.82248 13.2452 4.7111 12.9467 4.82559 12.6935L6.90468 8.09576C6.98597 7.91598 7.1643 7.80056 7.36075 7.80056Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.34781 11.648C5.34781 11.3699 5.57211 11.1444 5.84879 11.1444H8.87259C9.14928 11.1444 9.37357 11.3699 9.37357 11.648C9.37357 11.9261 9.14928 12.1516 8.87259 12.1516H5.84879C5.57211 12.1516 5.34781 11.9261 5.34781 11.648Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.1481 10.3939C10.1481 10.1158 10.3724 9.89037 10.6491 9.89037H13.144C13.4207 9.89037 13.645 10.1158 13.645 10.3939C13.645 10.6721 13.4207 10.8975 13.144 10.8975H10.6491C10.3724 10.8975 10.1481 10.6721 10.1481 10.3939Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.8964 8.63646C12.1731 8.63646 12.3974 8.86192 12.3974 9.14004V11.6479C12.3974 11.926 12.1731 12.1515 11.8964 12.1515C11.6197 12.1515 11.3954 11.926 11.3954 11.6479V9.14004C11.3954 8.86192 11.6197 8.63646 11.8964 8.63646Z"
            fill="currentColor"
          />
        </svg>
      }
    />
  );
}

Header.propTypes = {
  prefixPN: propTypes.string,
  variant: propTypes.string,
};

export default Header;
