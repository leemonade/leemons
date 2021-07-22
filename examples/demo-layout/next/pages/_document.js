import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Leemons UI - Design System" />
        </Head>
        <body className="p-4">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => {
        // console.log('App:', App);
        // console.log('props:', props);
        return <App {...props} />;
      },
    });

  const initialProps = await Document.getInitialProps(ctx);

  // console.log('initialProps:', initialProps);
  // const child = React.Children.toArray(initialProps);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [],
  };
};

export default MyDocument;
