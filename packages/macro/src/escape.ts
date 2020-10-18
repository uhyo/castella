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
