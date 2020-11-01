# Server-Side Rendering

Castella provides two ways of Server-Side Rendering (SSR). For the time being, you want to use **Classic SSR**.

- **Classic SSR**: what people currently call SSR. `<style>` and `<script>` tags are generated separately from your app and are to be embedded into static markups.
- **Declarative Shadow DOM**: SSR based on [Declarative Shadow DOM](https://web.dev/declarative-shadow-dom/). Generates `<template shadowroot="open">` tags in generated static markups.

## Configuration

To enable SSR, `babel-plugin-macros` has to be configured to turn the SSR flag on. Example configuration (`.babel.rc`):

```json
{
  "presets": ["@babel/preset-typescript", "@babel/preset-react"],
  "plugins": [["babel-plugin-macros", {
    "castella": {
      "ssr": true
    }
  }]]
}
```

### The `ssr` option

The `ssr` option can be either a boolean or an object of the following shape:

```ts
{
  classic: boolean;
  styled: boolean;
  declarativeShadowDOM: boolean;
}

// `ssr: false` is equivalent to:
{
  classic: false,
  styled: false,
  declarativeShadowDOM: false
}
// `ssr: true` is equivalent to:
{
  classic: true,
  styled: true,
  declarativeShadowDOM: false
}
```

## Setting up `ServerRenderingCollector`

If you turn on `classic` or `styled` (this includes setting `ssr: true`), `ServerRenderingCollector` has to be integrated to your server (if you are using Next.js, there is a separate instruction below).

Below example shows how a server-side rendering goes:

```ts
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { ServerRenderingCollector } from "@castella/runtime";

// For each rendering, create an instance
// of ServerRenderingCollector.
const collector = new ServerRenderingCollector();

// Wrap your App with `collector.wrap`.
const wrappedApp = collector.wrap(<YourApp />);

// Render your app.
const renderedApp = renderToString(wrappedApp);

// Now that ServerRenderingCollector has collected data,
// convert it to static markup.
// styles will be a string like "<style>..."
const styles = renderToStaticMarkup(<>
  {collector.getHeadElements()}
</>)

// Put things together
const responseHtml = `<!doctype html>
<html>
  <head>
    <!-- Everything you need goes here -->
    ${styles}
  </head>
  <body>
    <div id="app">
      ${renderedApp}
    </div>
  </body>
</html>`;
```

## Next.js Integration

To integrate Castella's SSR to your Next.js app, first edit (or create) `.babel.rc` for your app. It will look like:

```json
{
  "presets": ["next/babel"],
  "plugins": [["babel-plugin-macros", {
    "castella": {
      "ssr": true
    }
  }]]
}
```

Then, you have to customize `pages/_document.js` (or, of course, `pages/_document.tsx`). Your `pages/_document.tsx` will look like:

```tsx
import { ServerRenderingCollector } from "@castella/runtime";
import Document, { DocumentContext } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    const collector = new ServerRenderingCollector();

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => collector.wrap(<App {...props} />),
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {collector.getHeadElements()}
        </>
      ),
    };
  }
}

export default MyDocument;
```

See [the official document of Next.js](https://nextjs.org/docs/advanced-features/custom-document) for more details.

## Declarative Shadow DOM

If you configured `babel-plugin-macros` to enable Declarative Shadow DOM-based SSR, no additional work is needed.

However, there is one important thing to note: **Declarative Shadow DOM-based SSR does not work for components created by the `styled` API**. Only `castella` components can benefit from Declarative Shadow DOM-based SSR.

If you want to use the `styled` components to be SSR-ed, `ssr.styled` option should also be enabled (and thus above `ServerRenderingCollector` integration is still needed).

Example configuration for both Declearative Shadom DOM-based SSR and `styled` components SSR:

```json
{
  "ssr": {
    "declarativeShadomDOM": true,
    "styled": true
  }
}
```