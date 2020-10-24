import { createMacro } from "babel-plugin-macros";
import path from "path";
import { MacroContext } from "./context";
import { visitCastella } from "./visitCastella";
import { visitCss } from "./visitCss";
import { visitHtml } from "./visitHtml";
import { visitStyled } from "./visitStyled";

// `source` is not in @types/babel-plugin-macros :(
// @ts-expect-error
export = createMacro(({ references, state, babel, source }) => {
  const fileRelativePath = path.relative(
    state.file.opts.root || ".",
    state.filename
  );
  const cssReferences = [...(references.css || [])];
  const htmlReferences = [...(references.html || [])];
  const castellaReferences = [...(references.castella || [])];
  const styledReferences = [...(references.styled || [])];
  const slotReferences = [...(references.slot || [])];

  const context = new MacroContext(slotReferences, fileRelativePath);

  for (const ref of cssReferences) {
    visitCss(ref, context);
  }
  for (const ref of htmlReferences) {
    visitHtml(ref, context);
  }
  for (const ref of castellaReferences) {
    visitCastella(ref, context);
  }
  for (const ref of styledReferences) {
    visitStyled(ref, context);
  }
});
