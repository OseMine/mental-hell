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

        {/* Verhindert das Scrollen des gesamten Web-Bodys, damit sich ScrollViews wie nativ verhalten */}
        <ScrollViewStyleReset />

        {/* M3-CSS-Schnittstelle, um Farbflackern beim ersten Laden im Web zu verhindern */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

// Hier setzen wir die exakten Material 3 Standard-Hintergrundfarben ein
const responsiveBackground = `
body {
  background-color: #FEF7FF; /* Offizielles Material 3 Light-Mode Background (MD3LightTheme) */
  color: #1D1B20;            /* Offizielles M3 Light-Mode On-Background */
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #141218; /* Offizielles Material 3 Dark-Mode Background (MD3DarkTheme) */
    color: #E6E1E5;            /* Offizielles M3 Dark-Mode On-Background */
  }
}`;