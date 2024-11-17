import React, { useContext } from 'react';

import PrivateLayout from '../components/PrivateLayout';
import { LayoutContext } from '../context/layout';

const LAYOUTS = {
  // private: withPersistentState(PrivateLayout, 'PrivateLayout'),
  private: PrivateLayout,
};

export default function withLayout(WrappedPage, layout) {
  const Layout = LAYOUTS[layout || 'private'] || React.Fragment;

  const WithLayout = ({ ...pageProps }) => (
    <Layout>
      <WrappedPage {...pageProps} />
    </Layout>
  );

  WithLayout.propTypes = {};

  if (WrappedPage.getInitialProps) {
    WithLayout.getInitialProps = async (ctx) => {
      // retrieve initial props of the wrapped component
      const pageProps = await WrappedPage.getInitialProps(ctx);

      // the locale is valid
      return { ...pageProps };
    };
  }

  return WithLayout;
}
