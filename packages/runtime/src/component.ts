import React from "react";
import { wc, wcIntrinsic } from "react-wc";

export type ComponentOptions<SlotName extends string> = {
  /**
   * HTML string to be rendered in Shadow DOM.
   */
  readonly shadowHtml: string;
  /**
   * Name of slots accepted by this component.
   */
  readonly slots?: readonly SlotName[];
  /**
   * Name of this component.
   */
  readonly name: string;
  /**
   * Whether to support declarative Shadow DOM.
   */
  readonly declarativeShadowDOM?: boolean;
  /**
   * Whether to support classic SSR.
   */
  readonly classicSSR?: boolean;
};

type CastellaComponentProps<SlotName extends string> = string extends SlotName
  ? {}
  : { [N in Exclude<SlotName, "children" | "">]?: React.ReactNode };

export type CastellaComponent<
  SlotName extends string
> = React.FunctionComponent<CastellaComponentProps<SlotName>>;

export function component<SlotName extends string>(
  obj: ComponentOptions<SlotName>
): CastellaComponent<SlotName> {
  return wc(obj);
}

export type IntrinsicComponentOptions<
  SlotName extends string,
  ElementName extends keyof JSX.IntrinsicElements
> = {
  /**
   * HTML string to be rendered in Shadow DOM.
   */
  readonly shadowHtml: string;
  /**
   * Name of slots accepted by this component.
   */
  readonly slots?: readonly SlotName[];
  /**
   * Element name
   */
  readonly element: ElementName;
  /**
   * Whether to support declarative Shadow DOM.
   */
  readonly declarativeShadowDOM?: boolean;
};

export type CastellaIntrinsicComponent<
  SlotName extends string,
  ElementName extends keyof JSX.IntrinsicElements
> = React.FunctionComponent<
  JSX.IntrinsicElements[ElementName] & CastellaComponentProps<SlotName>
>;

export function intrinsicComponent<
  SlotName extends string,
  ElementName extends keyof JSX.IntrinsicElements
>(
  obj: IntrinsicComponentOptions<SlotName, ElementName>
): CastellaIntrinsicComponent<SlotName, ElementName> {
  return wcIntrinsic<SlotName, ElementName>(obj);
}
