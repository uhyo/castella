import { NodePath } from "@babel/core";
import {
  ArgumentPlaceholder,
  booleanLiteral,
  CallExpression,
  callExpression,
  Expression,
  identifier,
  isExpression,
  isIdentifier,
  isObjectProperty,
  JSXNamespacedName,
  objectExpression,
  ObjectProperty,
  objectProperty,
  SpreadElement,
  stringLiteral,
  templateElement,
  templateLiteral,
} from "@babel/types";
import { MacroContext } from "./context";
import { escapeCustomElementName } from "./escape";
import { runtimeNames } from "./runtime";
import { determineComponentName } from "./transform/determineComponentName";
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
    if (processCastellaCall(parentPath, args, undefined, context)) {
      return;
    }
  }
  if (
    parentPath.isMemberExpression() &&
    parentPath.node.object === reference.node
  ) {
    // castlla.xxx
    const grandpa = parentPath.parentPath;
    if (grandpa.isCallExpression() && grandpa.node.callee === parentPath.node) {
      // castella.xxx(...)
      const access = parentPath.node;
      const { computed, property } = access;
      const elementName =
        computed || !isIdentifier(property)
          ? property
          : stringLiteral(property.name);

      const args = grandpa.get<"arguments">("arguments");
      if (
        isExpression(elementName) &&
        processCastellaCall(grandpa, args, elementName, context)
      ) {
        return;
      }
    }
  }
  // ?
  const runtimeCastella = context.importRuntime(
    reference.scope,
    runtimeNames.castella
  );
  reference.replaceWith(runtimeCastella);
}

function processCastellaCall(
  callPath: NodePath<CallExpression>,
  args: readonly NodePath<
    Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
  >[],
  intrinsicElementName: Expression | undefined,
  context: MacroContext
): boolean {
  if (args.length < 1) {
    return false;
  }
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
              cooked: "<style>",
            }),
            templateElement({
              raw: "</style>",
              cooked: "</style>",
            }),
            templateElement(
              {
                raw: "",
                cooked: "",
              },
              true
            ),
          ],
          [argCss.node, htmlMember.value]
        )
      );
      const confProps = [];
      if (context.config.ssr.declarativeShadowDOM) {
        // this comes first because it is the same for all components (maybe helps compression)
        confProps.push(
          objectProperty(
            identifier("declarativeShadowDOM"),
            booleanLiteral(true)
          )
        );
      }
      confProps.push(objectProperty(identifier("shadowHtml"), htmlStr));
      if (slotsMember) {
        confProps.push(slotsMember);
      }
      if (intrinsicElementName) {
        const elementProperty = objectProperty(
          identifier("element"),
          intrinsicElementName
        );
        confProps.push(elementProperty);
        // create new object expression
        const newObj = objectExpression(confProps);
        const intrinsicComponent = context.importRuntime(
          callPath.scope,
          runtimeNames.intrinsicComponent
        );
        const call = callExpression(intrinsicComponent, [newObj]);

        callPath.replaceWith(call);
      } else {
        const elementName =
          "castella-" +
          escapeCustomElementName(
            determineComponentName(callPath as NodePath) || randomName()
          ) +
          "-" +
          context.fileNameHash;

        const nameProperty = objectProperty(
          identifier("name"),
          stringLiteral(elementName)
        );
        confProps.push(nameProperty);
        // create new object expression
        const newObj = objectExpression(confProps);
        const component = context.importRuntime(
          callPath.scope,
          runtimeNames.component
        );
        const call = callExpression(component, [newObj]);

        callPath.replaceWith(call);
      }

      return true;
    }
  }
  return false;
}
