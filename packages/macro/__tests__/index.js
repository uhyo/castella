const pluginTester = require("babel-plugin-tester").default;
const plugin = require("babel-plugin-macros");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: {
    basic: `
      import { wc, css, html, slot } from '../../macro'

      const TwoColumn = wc(
        css\`
          display: flex;

          .left {
            flex: 100px 0 0;
          }
          .right {
            flex: auto 1 0;
          }
        \`,
        html\`
          <div class="left">\${slot("sub")}</div>
          <div class="escape">\${slot("escape!'\\"&<foo>")}</div>
          <div class="right">\${slot()}</div>
        \`
      );
    `,
    slotExpr: `
      import { wc, css, html, slot } from '../../macro'

      const expr1 = "foo", expr2 = "bar";
      wc(
        css\`\`,
        html\`
          <div>\${slot(expr1)}</div>
          <div>\${slot(expr1 + expr2)}</div>
        \`
      );
    `,
  },
});
