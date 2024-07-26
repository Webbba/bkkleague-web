import { Html, Head, Main, NextScript, DocumentProps } from 'next/document';

export default function Document(props: DocumentProps) {
  return (
    <Html lang={props.__NEXT_DATA__.locale}>
      <Head>
        <link rel="icon" type="image/x-icon" id="favicon" sizes="32*32" />
      </Head>
      <body>
        <Main />
        <div id="modal-root" />
        <NextScript />
      </body>
    </Html>
  );
}
