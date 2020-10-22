/// <reference types="jest" />
import { escapeHtml } from "..";

describe("escapeHtml", () => {
  it("escapes string", () => {
    expect(escapeHtml(`foo <bar>& "baz" 'hoge'`)).toBe(
      `foo &lt;bar&gt;&amp; &quot;baz&quot; &#39;hoge&#39;`
    );
  });
});
