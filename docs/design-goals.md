# Castella's Design Goals

Castella is a skosh opinionated as a CSS-in-JS library. This document explains why Castella is designed like this.

## Couple Styles and Markups.

As seen in [the example](../README.md), Castella's API forces you to tightly couple CSS (styles) and HTML (markups). This is in contrast to existing CSS-in-JS libraries (and also CSS Modules) that is className-oriented; any CSS results in a class name that is to be attached to arbitrary one element.

Styles tend to be dispersed to multiple elements even if those styles have a single purpose. For example, Flexbox layout requires the parent to have `display: flex` and also often requires the child to have something like `flex: auto 1 0`. Scattered styles are hard to maintain, so we want to gather single-purposed styles to one place.

Styles also depend on underlying markups. For example, an element with `display: flex` lays out its direct children. This is making it inadvisable to edit CSS without looking at underlying markups, or vice versa.

For these reasons, we want to collect all CSS and HTML for one styling purpose at one place. This is what Castella enables you.

The example below defines a component named `TwoColumn`, whose purpose is a two-column layout. Of notable is that this definition contains all the styles and markup structured needed for that purpose.

```ts
export const TwoColumn = castella(
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
  `
);

// Usage 
<TwoColumn
  aside={<p>Aside contents</p>}
  main={<p>Main contents</p>}
/>

// Rendered result
<castella-twocolumn-3c129a>
  #shadow-root (open)
    <style>
      :host {
        display: flex;
      }
      .aside {
        flex: 100px 0 0;
      }
      .main {
        flex: auto 1 0;
      }
    </style>
    <div class="aside"><slot name="aside"></slot></div>
    <div class="main"><slot name="main"></slot></div>
  <p slot="aside">Aside contents</p>
  <p slot="main">Main contents</p>
</castella-twocolumn-3c129a>
```

The rendered element consists of three elements: `<castella-twocolumn-3c129a>` with `display: flex`, `<div class="aside">` with `flex: 100px 0 0`, and `<div class="main">` with `display: auto 1 0`, which are all we need for the desired layout. Contents given from outside are put into corresponding `<slot>`s.

As you can see, the `TwoColumn` component includes just enough amount of CSS and HTML for one purpose. This is how Castella helps you define maintainable styling components.

## Decouple Styles and Logics.

One of our design principles is that we should decouple styling components and logic components. Ideally, all styles should be described inside styling components and logic components should not be aware of any styles. Also, elements rendered by logic components should not play any role in styling; they should be purely for semantic purpose.

By using Castella, you are nearly forced to follow this style. For example, let's use above `TwoColumn` component in our app:

```tsx
const App = () => {
  return <TwoColumn
    aside={
      <nav>
        <h2>Navigation</h2>
        <ul>
          <li><a href="/">Top</a></li>
          <li><a href="/diary">Diary</a></li>
        </ul>
      </nav>
    }
    main={
      <article>
        <h1>Welcome to our nice app!</h1>
        <p>Some contents</p>
      </article>
    }
  />;
}
```

Our `App` component focuses on semantical work. All the `<div>`s needed for styling is put inside the `TwoColumn` component. `App` could also include logics like `useState` as needed. If you need more styles, more styling components could be made and used.

## Best Experience of Writing Styles.

One of the key features of CSS-in-JS libraries is encapsulation of styles. While typical CSS-in-JS realizes this by generating unique class names, Castella makes use of Shadow DOM. (*Note: Castella's `styled` API is still based on class names.*) This enables the best CSS writing experience.

In Castella components, you are free to use arbitrary class names (as in `TwoColumn` above). You do not have to consider class name conflicts, as your styles and markups are put into the component's own Shadow DOM and does not interact with outside. This is the most natural way of writing styles and markups, while is backed by the web standard.

## Be Future-Proof.

Castella's API is desiened so that it works well with future Web APIs, including [Declarative Shadow DOM](https://web.dev/declarative-shadow-dom/), [Constructable Stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) and so on. When these new features become ready for use, Castella users will be able to benefit from them with minimal effort. 

## Easy to Opt out.

Castella is based on program transformation with [Babel Macro](https://github.com/kentcdodds/babel-plugin-macros). This means that Castella components are fully statically-analizable. In case you want to move from Castella to another CSS-in-JS method, your effort is minimized as you can automate conversion from Castella to the other.