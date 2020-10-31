import { createMacro } from "babel-plugin-macros";
import path from "path";
import { MacroContext } from "./context";
import { readConfig } from "./readConfig";
import { visitCastella } from "./visitCastella";
import { visitCss } from "./visitCss";
import { visitHtml } from "./visitHtml";
import { visitStyled } from "./visitStyled";

export = createMacro(
  // @ts-expect-error: `config` not in type definition :(
  ({ references, state, config }) => {
    const conf = readConfig(config);
    const fileRelativePath = path.relative(
      state.file.opts.root || ".",
      state.filename
    );
    const cssReferences = [...(references.css || [])];
    const htmlReferences = [...(references.html || [])];
    const castellaReferences = [...(references.castella || [])];
    const styledReferences = [...(references.styled || [])];
    const slotReferences = [...(references.slot || [])];

    const context = new MacroContext(conf, slotReferences, fileRelativePath);

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
  },
  {
    configName: "castella",
  }
);
