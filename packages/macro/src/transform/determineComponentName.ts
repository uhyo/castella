import { NodePath } from "@babel/core";
import { isIdentifier } from "@babel/types";

export function determineComponentName(init: NodePath): string | undefined {
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
