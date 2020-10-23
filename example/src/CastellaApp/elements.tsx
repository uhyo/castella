import { castella, css, html, slot } from "@castella/macro";

export const AppStyle = castella(
  css`
    header {
      border: 1px solid #cccccc;
      padding: 4px;
    }
    p {
      border-bottom: 1px dashed #999999;
    }
  `,
  html`
    <header>${slot("header")}</header>
    <p>Counter value is ${slot("counter")}</p>
    <main>${slot()}</main>
  `
);

export const CounterValue = castella(
  css`
    font-weight: bold;
  `,
  html` ${slot()} `
);

export const Counters = castella(
  css`
    div {
      display: grid;
      grid: auto-flow / repeat(16, 80px);
      gap: 10px;
    }
  `,
  html` <div>${slot()}</div> `
);

export const Counter = castella(
  css`
    display: flex;
    flex-flow: nowrap row;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    border: 1px solid #cccccc;
    padding: 2px;
    font-size: 1.5em;
  `,
  html` <div>${slot()}</div> `
);

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
