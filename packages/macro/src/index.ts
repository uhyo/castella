import { createMacro } from "babel-plugin-macros";
import { MacroContext } from "./context";
import { visitCastella } from "./visitCastella";
import { visitCss } from "./visitCss";
import { visitHtml } from "./visitHtml";

// `source` is not in @types/babel-plugin-macros :(
// @ts-expect-error
export = createMacro(({ references, state, babel, source }) => {
  const cssReferences = [...(references.css || [])];
  const htmlReferences = [...(references.html || [])];
  const castellaReferences = [...(references.castella || [])];
  const slotReferences = [...(references.slot || [])];

  const context = new MacroContext(slotReferences);

  for (const ref of cssReferences) {
    visitCss(ref, context);
  }
  for (const ref of htmlReferences) {
    visitHtml(ref, context);
  }
  for (const ref of castellaReferences) {
    visitCastella(ref, context);
  }
});
