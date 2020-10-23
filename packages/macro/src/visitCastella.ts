import { NodePath } from "@babel/core";
import {
  callExpression,
  identifier,
  isExpression,
  isIdentifier,
  isObjectProperty,
  objectExpression,
  ObjectProperty,
  objectProperty,
  stringLiteral,
  templateElement,
  templateLiteral,
} from "@babel/types";
import { MacroContext } from "./context";
import { escapeCustomElementName } from "./escape";
import { runtimeNames } from "./runtime";
import { optimizeTemplateLiteral } from "./util/optimizeTemplateLiteral";
import { randomName } from "./util/randomName";

export function visitCastella(reference: NodePath, context: MacroContext) {
  const { parentPath } = reference;

  if (
    parentPath.isCallExpression() &&
    parentPath.node.callee === reference.node
  ) {
    // castella(...)
    const args = parentPath.get<"arguments">("arguments");
    if (args.length >= 2) {
      // castella(css, htmlObj)
      const [argCss, argHtmlObj] = args;

      if (argCss.isExpression() && argHtmlObj.isObjectExpression()) {
        const properties = argHtmlObj.node.properties;
        const htmlMember = properties.find(
          (prop) =>
            isObjectProperty(prop) &&
            isIdentifier(prop.key) &&
            prop.key.name === "shadowHtml"
        ) as ObjectProperty | undefined;
        const slotsMember = properties.find(
          (prop) =>
            isObjectProperty(prop) &&
            isIdentifier(prop.key) &&
            prop.key.name === "slots"
        ) as ObjectProperty | undefined;

        if (htmlMember && isExpression(htmlMember.value)) {
          // `<style>${css}</style>${html}`
          const htmlStr = optimizeTemplateLiteral(
            templateLiteral(
              [
                templateElement({
                  raw: "<style>",
                }),
                templateElement({
                  raw: "</style>",
                }),
                templateElement(
                  {
                    raw: "",
                  },
                  true
                ),
              ],
              [argCss.node, htmlMember.value]
            )
          );
          const elementName =
            "castella-" +
            escapeCustomElementName(
              determineComponentName(parentPath) || randomName()
            ) +
            "-" +
            context.fileNameHash;

          const nameProperty = objectProperty(
            identifier("name"),
            stringLiteral(elementName)
          );

          // create new object expression
          const newObj = objectExpression(
            slotsMember
              ? [
                  objectProperty(identifier("shadowHtml"), htmlStr),
                  slotsMember,
                  nameProperty,
                ]
              : [
                  objectProperty(identifier("shadowHtml"), htmlStr),
                  nameProperty,
                ]
          );
          const component = context.importRuntime(
            reference.scope,
            runtimeNames.component
          );
          const call = callExpression(component, [newObj]);

          parentPath.replaceWith(call);
        }
      }
    }
    return;
  }
  // ?
  const runtimeCastella = context.importRuntime(
    reference.scope,
    runtimeNames.castella
  );
  reference.replaceWith(runtimeCastella);
}

function determineComponentName(init: NodePath): string | undefined {
  let path: NodePath | undefined = init;
  while (path) {
    if (path.isVariableDeclarator()) {
      const id = path.node.id;
      if (isIdentifier(id)) {
        return id.name;
      } else {
        return undefined;
      }
    }
    if (path.isStatement() || path.isProgram()) {
      return undefined;
    }
    path = path.parentPath;
  }
}
