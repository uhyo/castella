import { NodePath } from "@babel/core";
import {
  callExpression,
  CallExpression,
  Expression,
  identifier,
  sequenceExpression,
  stringLiteral,
  TaggedTemplateExpression,
  templateElement,
  TemplateElement,
  templateLiteral,
} from "@babel/types";
import { MacroContext } from "./context";
import { escapeHtml } from "./escape";
import { runtimeNames } from "./runtime";
import { putToTemporalVariable } from "./util";

type HtmlContext = {
  slotNames: Expression[];
};

export function visitHtml(reference: NodePath, context: MacroContext) {
  const { parentPath } = reference;
  if (parentPath.isTaggedTemplateExpression()) {
    // html`...`
    const htmlContext = {
      slotNames: [],
    };

    const quasi = parentPath.get<"quasi">("quasi");
    const expressions = quasi.get("expressions");
    for (const e of expressions) {
      if (e.isExpression()) {
        visitExpression(e, context, htmlContext);
      }
    }
  }
}

function visitExpression(
  element: NodePath<Expression>,
  context: MacroContext,
  htmlContext: HtmlContext
) {
  if (!element.isCallExpression()) {
    return;
  }
  const callee = element.get<"callee">("callee");
  if (context.slotReferences.has(callee.node)) {
    // this is slot(...) call
    visitSlotCall(element, context, htmlContext);
  }
}

function visitSlotCall(
  path: NodePath<CallExpression>,
  context: MacroContext,
  htmlContext: HtmlContext
) {
  const args = path.get("arguments");
  if (args.length === 0) {
    // slot() call is converted to "<slot></slot>"
    const replacement = stringLiteral("<slot></slot>");
    path.replaceWith(replacement);
    return;
  }

  const arg = args[0];
  if (arg.isStringLiteral()) {
    // slot("foo")
    const slotName = arg.node.value;
    htmlContext.slotNames.push(stringLiteral(slotName));
    const replacement = stringLiteral(
      `<slot name="${escapeHtml(slotName)}"></slot>`
    );
    path.replaceWith(replacement);
    return;
  }
  if (arg.isExpression()) {
    // slot(someexpr)
    const [assignment, nameId] = putToTemporalVariable(arg);
    const escapeHtml = context.importRuntime(
      arg.scope,
      runtimeNames.escapeHtml
    );
    // escapeHtml(someexpr)
    const escapedArg = callExpression(escapeHtml, [nameId]);
    const interp = assignment
      ? sequenceExpression([assignment, escapedArg])
      : escapedArg;
    // `<slot name="${excapeHtml(someExpr)"></slot>`
    const replacement = templateLiteral(
      [
        templateElement({ raw: `<slot name="` }),
        templateElement({ raw: `"></slot>` }, true),
      ],
      [interp]
    );
    path.replaceWith(replacement);
    return;
  }
  // ?
  const runtimeSlot = context.importRuntime(path.scope, runtimeNames.slot);
  path.get("callee").replaceWith(runtimeSlot);
}
