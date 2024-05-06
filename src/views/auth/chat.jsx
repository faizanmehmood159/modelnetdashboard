import React, { useEffect } from 'react';

const ChatwootWidget = () => {
  useEffect(() => {
    const BASE_URL = "https://app.chatwoot.com";
    const script = document.createElement("script");
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.chatwootSDK.run({
        websiteToken: '8Drm32WGngfjXCv3buz7DKAF',
        baseUrl: BASE_URL
      });
    };
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <title>Model-Net</title>
      </head>
      <body className="bg-lightPrimary font-dm">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
      </body>
    </html>
  );
};

export default ChatwootWidget;
