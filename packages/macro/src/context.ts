import { NodePath } from "@babel/core";
import { Scope } from "@babel/traverse";
import {
  cloneNode,
  identifier,
  Identifier,
  importDeclaration,
  ImportDeclaration,
  importDefaultSpecifier,
  importSpecifier,
  Node,
  Program,
  stringLiteral,
} from "@babel/types";
import { createHash } from "crypto";
import { runtimeModule } from "./runtime";
import { upsert } from "./util/upsert";

export class MacroContext {
  readonly slotReferences: Set<Node>;
  readonly fileRelativePath: string;
  readonly fileNameHash: string;

  /**
   * ImportDeclaration for runtime.
   */
  #runtimeImportDeclarationMap: WeakMap<
    Program,
    {
      decl: ImportDeclaration;
      identifierMap: Map<string, Identifier>;
    }
  >;

  constructor(slotReferences: readonly NodePath[], fileRelativePath: string) {
    this.slotReferences = new Set(slotReferences.map((path) => path.node));
    this.fileRelativePath = fileRelativePath;

    // calculate hash from file path
    const hash = createHash("md5");
    hash.update(fileRelativePath);
    this.fileNameHash = hash.digest("hex").toLowerCase().slice(0, 6);

    this.#runtimeImportDeclarationMap = new WeakMap();
  }

  /**
   * Import runtime to given scope.
   */
  importRuntime(scope: Scope, source: string): Identifier {
    const programScope = scope.getProgramParent();
    const programPath = programScope.path as NodePath<Program>;
    const program = programPath.node;
    const { decl: importDecl, identifierMap } = upsert(
      this.#runtimeImportDeclarationMap,
      program,
      () => {
        const decl = importDeclaration([], stringLiteral(runtimeModule));
        program.body.unshift(decl);
        return {
          decl,
          identifierMap: new Map(),
        };
      }
    );

    const cache = identifierMap.get(source);
    if (cache) {
      return cloneNode(cache);
    }

    const localId = scope.generateUidIdentifier(source);
    const newSpecifier =
      source === "default"
        ? importDefaultSpecifier(localId)
        : importSpecifier(localId, identifier(source));
    importDecl.specifiers.push(newSpecifier);

    identifierMap.set(source, localId);
    return localId;
  }
}
