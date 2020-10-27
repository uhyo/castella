export function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, replacer);
}

function replacer(char: string) {
  switch (char) {
    case "&":
      return "&amp;";
    case "<":
      return "&lt;";
    case ">":
      return "&gt;";
    case '"':
      return "&quot;";
    case "'":
      return "&#39;";
    /* istanbul ignore next */
    default:
      return char;
  }
}

const invalidCustomElementChar = /[^-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}]/gu;

export function escapeCustomElementName(str: string) {
  // https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
  return str.toLowerCase().replace(invalidCustomElementChar, "_");
}

const invalidCSSIdentChar = /[^-0-9a-zA-Z_\x80-\u{effff}]/gu;
export function escapeClassName(str: string) {
  // https://www.w3.org/TR/css-syntax-3/#typedef-ident-token
  return str.replace(invalidCSSIdentChar, "_");
}
