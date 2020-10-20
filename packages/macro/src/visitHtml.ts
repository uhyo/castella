import { NodePath } from "@babel/core";
import {
  arrayExpression,
  callExpression,
  CallExpression,
  cloneNode,
  Expression,
  identifier,
  objectExpression,
  ObjectProperty,
  objectProperty,
  sequenceExpression,
  stringLiteral,
  templateElement,
  TemplateLiteral,
  templateLiteral,
} from "@babel/types";
import { MacroContext } from "./context";
import { escapeHtml } from "./escape";
import { runtimeNames } from "./runtime";
import { optimizeTemplateLiteral } from "./util/optimizeTemplateLiteral";
import { putToTemporalVariable } from "./util/putToTemporalVariable";

type HtmlContext = {
  slotNames: Expression[];
};

export function visitHtml(reference: NodePath, context: MacroContext) {
  const { parentPath } = reference;
  if (parentPath.isTaggedTemplateExpression()) {
    // html`...`
    const htmlContext: HtmlContext = {
      slotNames: [],
    };

    const quasi = parentPath.get<"quasi">("quasi");
    const expressions = quasi.get("expressions");
    for (const e of expressions) {
      if (e.isExpression()) {
        visitExpression(e, context, htmlContext);
      }
    }
    removeTrivia(quasi.node);

    // convert to object literal
    const properties: ObjectProperty[] = [
      objectProperty(identifier("html"), optimizeTemplateLiteral(quasi.node)),
    ];
    if (htmlContext.slotNames.length > 0) {
      properties.push(
        objectProperty(
          identifier("slots"),
          arrayExpression(htmlContext.slotNames)
        )
      );
    }
    const replacement = objectExpression(properties);
    parentPath.replaceWith(replacement);

    return;
  }
  // ?
  const runtimeSlot = context.importRuntime(reference.scope, runtimeNames.html);
  reference.replaceWith(runtimeSlot);
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
    htmlContext.slotNames.push(cloneNode(nameId));
    return;
  }
  // ?
  const runtimeSlot = context.importRuntime(path.scope, runtimeNames.slot);
  path.get("callee").replaceWith(runtimeSlot);
}

/**
 * Removes newlines and spaces around newlines.
 */
function removeTrivia(expression: TemplateLiteral) {
  for (const quasi of expression.quasis) {
    quasi.value.raw = quasi.value.raw.replace(/\s*\n\s*/g, "");
  }
}
