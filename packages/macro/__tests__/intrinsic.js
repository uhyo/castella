const pluginTester = require("babel-plugin-tester").default;
const plugin = require("babel-plugin-macros");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: {
    "non-computed": `
      import { castella, css, html, slot } from '../../macro'

      const TwoColumn = castella.div(
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
          <div class="right">\${slot()}</div>
        \`
      );
    `,
    computed: `
      import { castella, css, html, slot } from '../../macro'

      const CcCcC = castella["section"](
        css\`\`,
        html\` \${slot()} \`
      );
    `,
    "computed expr": `
      import { castella, css, html, slot } from '../../macro'

      const expr = "span";
      const あいうComponent = castella[expr](
        css\`\`,
        html\`
          <p>foo bar</p>
        \`
      );
    `
  },
});

