import {
  Expression,
  isStringLiteral,
  isTemplateLiteral,
  templateElement,
  TemplateElement,
  templateLiteral,
  TemplateLiteral,
  TSType,
} from "@babel/types";

export function optimizeTemplateLiteral(
  expr: TemplateLiteral
): TemplateLiteral {
  const { expressions, quasis } = expr;
  const newQuasis: TemplateElement[] = [];
  const newExpressions: (Expression | TSType)[] = [];
  let previousQuasi: TemplateElement | undefined;
  for (const [i, e] of expressions.entries()) {
    visitQuasi(quasis[i]);
    visitExpression(e);
  }
  visitQuasi(quasis[expressions.length]);
  newQuasis[newQuasis.length - 1].tail = true;

  return templateLiteral(newQuasis, newExpressions);

  function visitQuasi(element: TemplateElement) {
    if (previousQuasi) {
      previousQuasi.value.raw += element.value.raw;
      if (previousQuasi.value.cooked !== undefined && element.value.cooked) {
        previousQuasi.value.cooked += element.value.cooked;
      }
    } else {
      element.tail = false;
      newQuasis.push(element);
      previousQuasi = element;
    }
  }
  function visitExpression(expr: Expression | TSType) {
    if (!previousQuasi) {
      previousQuasi = templateElement(
        {
          raw: "",
          cooked: "",
        },
        false
      );
      newQuasis.push(previousQuasi);
    }
    if (isStringLiteral(expr)) {
      previousQuasi.value.raw += expr.value;
      previousQuasi.value.cooked += expr.value;
    } else if (isTemplateLiteral(expr)) {
      // nested template literal
      const { expressions, quasis } = expr;

      for (const [i, e] of expressions.entries()) {
        visitQuasi(quasis[i]);
        visitExpression(e);
      }
      visitQuasi(quasis[expressions.length]);
    } else {
      newExpressions.push(expr);
      previousQuasi = undefined;
    }
  }
}
