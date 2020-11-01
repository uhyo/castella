/**
 * @jest-environment node
 */
import React, { Fragment } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { component, ServerRenderingCollector, styledComponent } from "..";

describe("SSR", () => {
  it("input", () => {
    const Hello = component({
      shadowHtml: `
          <style>
            div {
              font-size: 100px;
            }
          </style>
          <div><slot></slot></div>
      `,
      slots: [],
      name: "wc-test-foo",
      classicSSR: true,
    });
    const Hello2 = styledComponent({
      ssr: true,
      elementName: "input",
      className: "test-hello2",
      css: ".test-hello2 {color: red}",
    });

    const sheet = new ServerRenderingCollector();
    const str = renderToString(
      sheet.wrap(
        <Hello>
          <Hello2 />
        </Hello>
      )
    );

    expect(str).toMatchSnapshot();
    expect(
      renderToStaticMarkup(<Fragment>{sheet.getHeadElements()}</Fragment>)
    ).toMatchSnapshot();
  });
});
