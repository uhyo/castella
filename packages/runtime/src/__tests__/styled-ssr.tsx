/**
 * @jest-environment node
 */
import React, { Fragment } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { ServerRenderingCollector, styledComponent } from "..";

describe("styledComponent ssr", () => {
  describe("no ssr", () => {
    it("input", () => {
      const Hello = styledComponent({
        ssr: true,
        css: ".test-foobar{color:red;}",
        className: "test-foobar",
        elementName: "input",
      });

      const str = renderToString(<Hello />);

      expect(str).toMatchSnapshot();
    });
    it("div", () => {
      const Hello = styledComponent({
        ssr: true,
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
        ssr: true,
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
  describe("with ssr", () => {
    it("input", () => {
      const Hello = styledComponent({
        ssr: true,
        css: ".test-foobar{color:red;}",
        className: "test-foobar",
        elementName: "input",
      });

      const sheet = new ServerRenderingCollector();
      const str = renderToString(sheet.wrap(<Hello />));

      expect(str).toMatchSnapshot();
      expect(
        renderToStaticMarkup(<Fragment>{sheet.getHeadElements()}</Fragment>)
      ).toMatchSnapshot();
    });
    it("div", () => {
      const Hello = styledComponent({
        ssr: true,
        css: ".test-divdiv{color:red;}",
        className: "test-divdiv",
        elementName: "div",
      });

      const sheet = new ServerRenderingCollector();
      const str = renderToString(
        sheet.wrap(
          <Hello>
            <p>Hi!</p>
          </Hello>
        )
      );

      expect(str).toMatchSnapshot();
      expect(
        renderToStaticMarkup(<Fragment>{sheet.getHeadElements()}</Fragment>)
      ).toMatchSnapshot();
    });
    it("rendered twice", () => {
      const Hello = styledComponent({
        ssr: true,
        css: ".test-divdiv{color:red;}",
        className: "test-divdiv",
        elementName: "div",
      });
      const Hello2 = styledComponent({
        ssr: true,
        css: ".test-hello2{color:blue;}",
        className: "test-hello2",
        elementName: "div",
      });

      const sheet = new ServerRenderingCollector();
      const str = renderToString(
        sheet.wrap(
          <Hello>
            <p>Hi!</p>
            <Hello>
              <p>Hoy!</p>
            </Hello>
            <Hello2>wow!</Hello2>
          </Hello>
        )
      );

      expect(str).toMatchSnapshot();
      expect(
        renderToStaticMarkup(<Fragment>{sheet.getHeadElements()}</Fragment>)
      ).toMatchSnapshot();
    });
  });
});
