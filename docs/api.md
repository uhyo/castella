# API Reference

## `@castella/macro`

### `css`

Should be used as a part of a tagged template literal. Any other use will result in a runtime error.

Strings tagged with the `css` function are preprocessed with [stylis](https://stylis.js.org/) at compile time. Thanks for this, your css can use nested rules. Top-level declarations becomes the type of the host element (element created by a `castella` call).

**Example:**

```ts
css`
  display: flex;

  .aside {
    flex: 100px 0 0;
  }
  .main {
    flex: auto 1 0;
  }
`
// ↓↓↓ compiles to ↓↓↓
`
:host {
  display: flex;
}
.aside {
  flex: 100px 0 0;
}
.main {
  flex: auto 1 0;
}
`
```

#### Interpolation

Interpolation (`${ ... }` in template literal string) is possible but there is a caveat: interpolation works only in value positions in CSS.

```ts
css`
  /* works */
  margin: 1px solid ${marginColor};

  /* does not work */
  ${someAdditionalStyle};
`
```

Note that interpolation is only for static values (value that does not change during component's life). If you want your CSS to be dynamic, use CSS variables.

### `html`

Should be used as a part of a tagged template literal. Any other use will result in a runtime error.

Takes an HTML string and picks up slot names in it. Slots must be specified by interpolating `slot()` calls in accompanying template string, as in the example below.

**Example**

```ts
// default slot
html`
  <div class="wrapper">${slot()}</div>
`

// named slots
html`
  <div class="aside">${slot("aside")}</div>
  <div class="main">${slot("main")}</div>
`
```

### `slot`

See `html` above; should always be used inside an `html` template string.

### `castella`

Receives CSS and HTML and creates a React component.

Resulting component renders a [custom component](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) that has given CSS and HTML in its [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

It is recommended to directly use `css` and `html` inside `castella` calls, as doing so emits the most efficient runtime code.

**Example**

```tsx
const TwoColumn = castella(
  css`
    display: flex;

    .aside {
      flex: 100px 0 0;
    }
    .main {
      flex: auto 1 0;
    }
  `,
  html`
    <div class="aside">${slot("aside")}</div>
    <div class="main">${slot("main")}</div>
  )`
);

// Usage
<TwoColumn
  aside={<p>Aside contents</p>}
  main={<p>Main contents</p>}
/>
```

### `styled`

Creates a component that renders a specified element with given CSS applied. Unlike `castella`, resulting component is not Shadow DOM-based; instead, given CSS is applyed through class names similarly as [styled-components](https://styled-components.com/).

We recommend that you use `castella` whenever possible. Use `styled` only when you have to attach style to an intrisic element directly and that element cannot be in Shadow DOM.

**Example**

```tsx
const NiceInput = styled.input`
  color: red;
`;

// Usage
<NiceInput type="password" />
```

## `@castella/runtime`

### `ServerRenderingCollector`

Class that provides functionality for Classic Server-Side Rendering. See detailed usage at [Sever-Side Rendering doc](./ssr.md).

#### `wrap`

Wraps a given React element to collect data for SSR inside. Data is collected when the resulting element is rendered.

#### `getHeadElements`

Converts collected data to React elements to be rendered in `<head>`.
These elements can be converted to a markup by React's `renderToStaticMarkup`.

```ts
import { ServerRenderingCollector } from "@castella/runtime";
import { renderToString, renderToStaticMarkup } from "react-dom/server";

const collector = new ServerRenderingCollector();
const element = collector.wrap(<App />);

const str = renderToString(element);

// '<style data-castella-styled="...">...'
const headElements = renderToStaticMarkup(<Fragment>{collector.getHeadElements()}</Fragment>);
```