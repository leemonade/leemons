import React from 'react';

export default function withLayout(WrappedPage, layout) {
  console.log('layout:', layout);
  const WithLayout = ({ ...pageProps }) => {
    console.log('pageProps:', pageProps);
    return (
      <>
        <WrappedPage {...pageProps} />
      </>
    );
  };

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
