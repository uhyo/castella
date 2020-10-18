import { createMacro } from "babel-plugin-macros";
import { MacroContext } from "./context";
import { visitHtml } from "./visitHtml";
import { visitSlot } from "./visitSlot";

// `source` is not in @types/babel-plugin-macros :(
// @ts-expect-error
export = createMacro(({ references, state, babel, source }) => {
  const cssFuncReferences = [...(references.css || [])];
  const htmlReferences = [...(references.html || [])];
  const wc = [...(references.wc || [])];
  const slotReferences = [...(references.slot || [])];

  const context = new MacroContext(slotReferences);

  for (const ref of htmlReferences) {
    visitHtml(ref, context);
  }
});
