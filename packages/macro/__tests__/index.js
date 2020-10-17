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
          <div class="left">\${slot("left")}</div>
          <div class="right">\${slot("right")}</div>
        \`
      );
    `,
  },
});
