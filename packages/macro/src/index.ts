import { createMacro } from "babel-plugin-macros";

// `source` is not in @types/babel-plugin-macros :(
// @ts-expect-error
export = createMacro(({ references, state, babel, source }) => {
  const cssFuncReferences = [...(references.css || [])];
  const htmlFuncReferences = [...(references.html || [])];
  const wc = [...(references.wc || [])];
});
