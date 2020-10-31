export type Config = {
  ssr: {
    declarativeShadowDOM: boolean;
    styled: boolean;
  };
};

export function readConfig(config: any): Config {
  const { ssr } = config ?? {};
  const declarativeShadowDOM = ssr === true || !!ssr?.declarativeShadowDOM;
  const styled = ssr === true || !!ssr?.styled;

  return {
    ssr: {
      declarativeShadowDOM,
      styled,
    },
  };
}
