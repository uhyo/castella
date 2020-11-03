import React from "react";

declare const slotBland: unique symbol;

export type Slot<SlotName extends string> = {
  [slotBland]: SlotName;
};

/**
 * Converts given CSS string for use in Castella.
 */
export function css(
  arr: TemplateStringsArray,
  ...args: readonly unknown[]
): string;

export type HtmlTemplateItem<SlotName extends string> = string | Slot<SlotName>;

export type HtmlResult<SlotName extends string> = {
  shadowHtml: string;
  slots: readonly SlotName[];
};

/**
 * Converts given HTML string for use in Castella.
 */
export function html<SlotName extends string>(
  arr: TemplateStringsArray,
  ...args: readonly HtmlTemplateItem<SlotName>[]
): HtmlResult<Exclude<SlotName, "children" | "">>;

export type CastellaComponent<
  SlotName extends string
> = React.FunctionComponent<
  string extends SlotName
    ? {}
    : {
        [K in SlotName]?: React.ReactNode;
      }
>;

/**
 * Creates a slot.
 */
export function slot(): Slot<"">;
export function slot<SlotName extends string>(name: SlotName): Slot<SlotName>;

type ShadowAllowElementName =
  | "article"
  | "aside"
  | "blockquote"
  | "body"
  | "div"
  | "footer"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "header"
  | "main"
  | "nav"
  | "p"
  | "section"
  | "span";

type CastellaFunction = <SlotName extends string>(
  css: string,
  html: HtmlResult<SlotName>
) => CastellaComponent<SlotName>;

// export const castella: CastellaFunction &
//   Record<ShadowAllowElementName, CastellaFunction>;

/**
 * Creates a React component from given CSS and HTML.
 */
export const castella: CastellaFunction;

export const styled: {
  /**
   * Creates a React component with given CSS attached.
   */
  [Elm in keyof JSX.IntrinsicElements]: (
    arr: TemplateStringsArray,
    ...values: readonly string[]
  ) => React.FunctionComponent<JSX.IntrinsicElements[Elm]>;
};
