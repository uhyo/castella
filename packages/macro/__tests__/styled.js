const pluginTester = require("babel-plugin-tester").default;
const plugin = require("babel-plugin-macros");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: {
    "no hole": `
      import { styled } from '../../macro'

      const input = styled.input\`
        background-color: yellow;
      \`;
    `,
    "some hole": `
      import { styled } from '../../macro'

      const color = "yellow";
      const input = styled["input"]\`
        background-color: \${color};
      \`;
    `,
    "computed name": `
      import { styled } from '../../macro'

      const expr = "span";
      const あいうComponent = styled[expr]\`
        font-weight: bold;
      \`;
    `,
    "nested": `
      import { styled } from '../../macro'

      const あいう = styled.div\`
        display: flex;
        & > * {
          flex: 100px 0 0;
        }
      \`;
    `
  },
});


