export type Config = {
  ssr: {
    declarativeShadowDOM: boolean;
    classic: boolean;
    styled: boolean;
  };
};

export function readConfig(config: any): Config {
  const { ssr } = config ?? {};
  const declarativeShadowDOM = !!ssr?.declarativeShadowDOM;
  const classic = ssr === true || !!ssr?.classic;
  const styled = ssr === true || !!ssr?.styled;

  return {
    ssr: {
      declarativeShadowDOM,
      classic,
      styled,
    },
  };
}
