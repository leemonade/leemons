/* eslint-disable class-methods-use-this */
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-theme="light">
        <Head>
          <meta name="description" content="Leemons UI - Design System" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/styles/vs2015.css" />
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
