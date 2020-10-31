/**
 * @jest-environment node
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { styledComponent } from "..";

describe("styledComponent ssr", () => {
  describe("no ssr", () => {
    it("input", () => {
      const Hello = styledComponent({
        css: ".test-foobar{color:red;}",
        className: "test-foobar",
        elementName: "input",
      });

      const str = renderToString(<Hello />);

      expect(str).toMatchSnapshot();
    });
    it("div", () => {
      const Hello = styledComponent({
        css: ".test-divdiv{color:red;}",
        className: "test-divdiv",
        elementName: "div",
      });

      const str = renderToString(
        <Hello>
          <p>Hi!</p>
        </Hello>
      );

      expect(str).toMatchSnapshot();
    });
    it("rendered twice", () => {
      const Hello = styledComponent({
        css: ".test-divdiv{color:red;}",
        className: "test-divdiv",
        elementName: "div",
      });

      const str = renderToString(
        <Hello>
          <p>Hi!</p>
          <Hello>
            <p>Hoy!</p>
          </Hello>
        </Hello>
      );

      expect(str).toMatchSnapshot();
    });
  });
});
