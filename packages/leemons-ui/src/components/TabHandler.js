import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

function TabHandler({ tabs }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto mb-10">
      <div className="tabs flex-nowrap whitespace-nowrap">
        {Array.isArray(tabs) &&
          tabs.map((tab) => (
            <Link key={tab.url} href={tab.url}>
              {/* { 'tab-active': $nuxt.$route.path == tab.url } */}
              <a
                className={`tab tab-lifted tab-lg ${
                  router.pathname === tab.url ? 'tab-active' : ''
                }`}
              >
                {tab.title}
              </a>
            </Link>
          ))}

        <span className="tab tab-lifted tab-lg flex-grow cursor-default"></span>
      </div>
    </div>
  );
}

TabHandler.defaultProps = {
  tabs: [
    { title: 'Tailwind Plugin', url: '/install' },
    { title: 'CSS Import', url: '/install/css' },
  ],
};

TabHandler.propTypes = {
  tabs: PropTypes.any.isRequired,
};

export default TabHandler;
