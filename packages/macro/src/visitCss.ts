import { NodePath } from "@babel/core";
import { MacroContext } from "./context";
import { runtimeNames } from "./runtime";
import { convertTemplateStringWithStylis } from "./transform/css";

export function visitCss(reference: NodePath, context: MacroContext) {
  const { parentPath } = reference;
  if (parentPath.isTaggedTemplateExpression()) {
    // css`...`

    const quasi = parentPath.node.quasi;

    // compile CSS with styles
    const replacement = convertTemplateStringWithStylis(quasi, ":host");

    parentPath.replaceWith(replacement);
    return;
  }
  // ?
  const runtimeSlot = context.importRuntime(reference.scope, runtimeNames.css);
  reference.replaceWith(runtimeSlot);
}
