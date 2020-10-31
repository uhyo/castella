import {
  Expression,
  templateElement,
  TemplateElement,
  templateLiteral,
  TemplateLiteral,
  TSType,
} from "@babel/types";
import { MacroError } from "babel-plugin-macros";
import {
  compile,
  Middleware,
  middleware,
  RULESET,
  serialize,
  stringify,
} from "stylis";
import { mapMaybeSame } from "../util/mapMaybeSame";

export function convertTemplateStringWithStylis(
  element: TemplateLiteral,
  hostSelector: string
): TemplateLiteral {
  const str = convertTemplateLiteralToPlaceHolderedString(element);

  // compile CSS with styles
  const compiledCss = transformCss(`${hostSelector}{${str}}`);
  return convertStringWithPlaceholderToTemplateLiteral(
    compiledCss,
    element.expressions
  );
}

function convertTemplateLiteralToPlaceHolderedString(
  expr: TemplateLiteral
): string {
  const { quasis } = expr;
  let result = "";
  for (const [i, quasi] of quasis.entries()) {
    result += quasi.value.raw;
    if (!quasi.tail) {
      result += `"__CASTELLA_PLACEHOLDER_${i}__"`;
    }
  }
  return result;
}

function transformCss(cssStr: string): string {
  const compiled = compile(cssStr);
  // console.log(inspect(compiled, false, 4));
  return serialize(compiled, middleware([removeHostPrefix, stringify]));
}

/**
 * :host .left => .left
 */
const removeHostPrefix: Middleware = (element) => {
  if (element.type === RULESET) {
    element.props = mapMaybeSame(element.props as string[], (selector) =>
      selector.startsWith(":host ") ? selector.slice(6) : selector
    );
  }
};

function convertStringWithPlaceholderToTemplateLiteral(
  str: string,
  expressions: (Expression | TSType)[]
): TemplateLiteral {
  const quasis: TemplateElement[] = [];
  const newExpressions: (Expression | TSType)[] = [];
  const r = /"__CASTELLA_PLACEHOLDER_(\d+)__"/g;

  const filledFlags = expressions.map(() => false);
  let match;
  let nextQuasiStart = 0;
  while ((match = r.exec(str))) {
    const placeHolderId = parseInt(match[1], 10);
    const slice = str.slice(nextQuasiStart, match.index);
    quasis.push(
      templateElement({
        raw: slice,
        cooked: slice,
      })
    );
    newExpressions.push(expressions[placeHolderId]);
    filledFlags[placeHolderId] = true;
    nextQuasiStart = match.index + match[0].length;
  }
  const slice = str.slice(nextQuasiStart);
  quasis.push(
    templateElement({
      raw: slice,
      cooked: slice,
    })
  );
  // if couldn't correctly converted, throw an error
  const unfilledIndex = filledFlags.findIndex((v) => !v);
  if (unfilledIndex >= 0) {
    throw new MacroError("Could not convert CSS template.");
  }

  return templateLiteral(quasis, newExpressions);
}
