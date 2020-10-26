import React from "react";

export type StyledOptions<ElementName extends keyof JSX.IntrinsicElements> = {
  css: string;
  className: string;
  elementName: ElementName;
};

export function styledComponent<
  ElementName extends keyof JSX.IntrinsicElements
>({
  css,
  className,
  elementName,
}: StyledOptions<ElementName>): React.FunctionComponent<
  JSX.IntrinsicElements[ElementName]
> {
  let styleAdded = false;

  return ({ children, ...props }) => {
    if (!styleAdded) {
      const style = document.createElement("style");
      style.dataset.castella = "";
      style.textContent = css;
      document.head.appendChild(style);
      styleAdded = true;
    }
    props.className = className;
    return React.createElement(elementName, props, children);
  };
}
