/**
 * @jest-environment node
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { component, intrinsicComponent } from "..";

describe("declarativeShadowDOM", () => {
  describe("component", () => {
    it("one slot", () => {
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
        declarativeShadowDOM: true,
      });

      const str = renderToString(
        <Hello>
          <span>Foobar</span>
        </Hello>
      );

      expect(str).toMatchSnapshot();
    });
  });
  describe("intrinsicComponent", () => {
    it("two slots", () => {
      const Hello = intrinsicComponent({
        shadowHtml: `
          <style>
            div {
              font-size: 100px;
            }
          </style>
          <div><slot name="foo"></slot><slot name="bar"></slot></div>
      `,
        slots: ["foo", "bar"],
        element: "div",
        declarativeShadowDOM: true,
      });

      const str = renderToString(<Hello foo={<span>Hi</span>} bar="wow" />);

      expect(str).toMatchSnapshot();
    });
  });
});
