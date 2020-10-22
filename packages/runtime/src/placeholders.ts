export function slot(..._args: readonly unknown[]): unknown {
  throw new Error(
    "Use of 'slot()' that could not be converted by @castella/macro."
  );
}

export function html(..._args: readonly unknown[]): unknown {
  throw new Error(
    "Use of html`...` that could not be converted by @castella/macro."
  );
}

export function css(..._args: readonly unknown[]): unknown {
  throw new Error(
    "Use of css`...` that could not be converted by @castella/macro."
  );
}

export function castella(..._args: readonly unknown[]): unknown {
  throw new Error(
    "Use of 'castella()' that could not be converted by @castella/macro."
  );
}
