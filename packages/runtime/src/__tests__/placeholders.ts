import { castella, css, html, slot } from "..";

describe("placeholders", () => {
  it("slot", () => {
    expect(() => slot()).toThrow();
  });
  it("html", () => {
    expect(() => html()).toThrow();
  });
  it("css", () => {
    expect(() => css()).toThrow();
  });
  it("castella", () => {
    expect(() => castella()).toThrow();
  });
});
