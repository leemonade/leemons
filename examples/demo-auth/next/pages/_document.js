import React from 'react';
// Modules
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-theme="light">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
