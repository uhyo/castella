const pluginTester = require("babel-plugin-tester").default;
const plugin = require("babel-plugin-macros");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  pluginOptions: {
    castella: {
      ssr: {
        classic: true
      }
    }
  },
  tests: {
    basic: `
      import { castella, css, html, slot } from '../../macro'

      const TwoColumn = castella(
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
      import { castella, css, html, slot } from '../../macro'

      const expr1 = "foo", expr2 = "bar";
      const CcCcC = castella(
        css\`\`,
        html\`
          <div>\${slot(expr1)}</div>
          <div>\${slot(expr1 + expr2)}</div>
        \`
      );
    `,
  },
});

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  pluginOptions: {
    castella: {
      ssr: true
    }
  },
  tests: {
    basic2: `
      import { castella, css, html, slot } from '../../macro'

      const TwoColumn = castella(
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
    slotExpr2: `
      import { castella, css, html, slot } from '../../macro'

      const expr1 = "foo", expr2 = "bar";
      const CcCcC = castella(
        css\`\`,
        html\`
          <div>\${slot(expr1)}</div>
          <div>\${slot(expr1 + expr2)}</div>
        \`
      );
    `,
  },
});
