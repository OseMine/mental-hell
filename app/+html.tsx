import { ScrollViewStyleReset } from 'expo-router/html';
import React from 'react';

// Diese Datei läuft ausschließlich in Node.js für statisches Web-Rendering.
// Verwende hier KEINE React-Native-Komponenten, Hooks oder Themes!
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#6750A4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-title" content="Mental Hell" />

        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />

        {/* Desktop Responsive Styles */}
        <style dangerouslySetInnerHTML={{ __html: desktopStyles }} />

        {/* Verhindert das Scrollen des gesamten Web-Bodys, damit sich ScrollViews wie nativ verhalten */}
        <ScrollViewStyleReset />

        {/* M3-CSS-Schnittstelle, um Farbflackern beim ersten Laden im Web zu verhindern */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const desktopStyles = `
body > div {
  min-height: 100vh;
}
`;

const responsiveBackground = `
body {
  background-color: #FEF7FF;
  color: #1D1B20;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #141218;
    color: #E6E1E5;
  }
}`;