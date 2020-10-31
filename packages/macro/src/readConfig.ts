export type Config = {
  ssr: {
    declarativeShadowDOM: boolean;
  };
};

export function readConfig(config: any): Config {
  const { ssr } = config ?? {};
  const declarativeShadowDOM = ssr === true || !!ssr?.declarativeShadowDOM;

  return {
    ssr: {
      declarativeShadowDOM,
    },
  };
}
