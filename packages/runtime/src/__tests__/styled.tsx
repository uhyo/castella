import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";
import { styledComponent } from "..";

beforeEach(() => {
  document.head.innerHTML = "";
});

describe("styledComponent", () => {
  it("input", () => {
    const Hello = styledComponent({
      css: ".test-foobar{color:red;}",
      className: "test-foobar",
      elementName: "input",
    });

    render(<Hello />);

    expect(document.head.innerHTML).toMatchSnapshot();
    expect(document.body.innerHTML).toMatchSnapshot();
  });
  it("div", () => {
    const Hello = styledComponent({
      css: ".test-divdiv{color:red;}",
      className: "test-divdiv",
      elementName: "div",
    });

    render(
      <Hello>
        <p>Hi!</p>
      </Hello>
    );

    expect(document.head.innerHTML).toMatchSnapshot();
    expect(document.body.innerHTML).toMatchSnapshot();
  });
  it("rendered twice", () => {
    const Hello = styledComponent({
      css: ".test-divdiv{color:red;}",
      className: "test-divdiv",
      elementName: "div",
    });

    render(
      <Hello>
        <p>Hi!</p>
        <Hello>
          <p>Hoy!</p>
        </Hello>
      </Hello>
    );

    expect(document.head.innerHTML).toMatchSnapshot();
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
