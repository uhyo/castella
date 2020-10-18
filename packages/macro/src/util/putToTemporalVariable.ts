import { NodePath } from "@babel/core";
import {
  assignmentExpression,
  AssignmentExpression,
  Expression,
  Identifier,
} from "@babel/types";

/**
 * Put given expression into a temp variable.
 */
export function putToTemporalVariable(
  expr: NodePath<Expression>
): [AssignmentExpression | undefined, Identifier] {
  if (expr.isIdentifier()) {
    return [undefined, expr.node];
  }

  const { scope } = expr;
  const id = scope.generateDeclaredUidIdentifier("context");
  const assignment = assignmentExpression("=", id, expr.node);
  return [assignment, id];
}
