const pluginTester = require("babel-plugin-tester").default;
const plugin = require("babel-plugin-macros");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: {
    placeholders: `
      import { wc, css, html, slot } from '../../macro'

      const A = wc(
        css\`
          display: flex;

          margin: calc(1em + \${"3px"});
          color: \${color};
        \`,
        html\`
          <div>\${slot()}</div>
        \`
      );
    `,
    nested: `
      import { wc, css, html, slot } from '../../macro'

      const A = wc(
        css\`
          display: flex;

          .left {
            flex: 100px 0 0;

            font-size: \${size}
          }

          & > .right {
            flex: auto 1 0;
          }
        \`,
        html\`
          <div>\${slot()}</div>
        \`
      );
    `,
    cannotConvert: {
      code: `
        import { wc, css, html, slot } from '../../macro'

        const A = wc(
          css\`
            display: flex;

            \${"padding: 10px"};
          \`,
          html\`
            <div>\${slot()}</div>
          \`
        );
      `,
      snapshot: false,
      error: "Could not convert CSS template."
    }
  },
});

