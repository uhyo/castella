import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";
import { intrinsicComponent } from "..";

describe("wcIntrinsic", () => {
  describe("supported", () => {
    it("section: no slot", () => {
      const Hello = intrinsicComponent({
        element: "section",
        shadowHtml: `
            <style>
              div {
                font-size: 100px;
              }
            </style>
            <div>Hello</div>
          `,
      });

      render(<Hello />);

      const el = document.getElementsByTagName("section")[0];

      expect(el.shadowRoot?.innerHTML).toMatchSnapshot();
      expect(el.innerHTML).toMatchSnapshot();
    });
  });
  describe("not supported", () => {
    it("input", () => {
      const Input = intrinsicComponent({
        element: "input",
        shadowHtml: `
            <style>
              :host {
                background-color: yellow;
              }
            </style>
          `,
      });

      expect(() => render(<Input />)).toThrow();
    });
  });
});
