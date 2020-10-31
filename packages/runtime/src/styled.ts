import React from "react";

export type StyledOptions<ElementName extends keyof JSX.IntrinsicElements> = {
  css: string;
  className: string;
  elementName: ElementName;
};

const hasDocument = typeof document !== "undefined";

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
      if (hasDocument) {
        // old styles may exist when this componend is renewed by Fast Refresh.
        const oldStyles = document.querySelectorAll(
          `style[data-castella-styled="${className}"]`
        );
        oldStyles.forEach((elm) => {
          elm.remove();
        });
        const style = document.createElement("style");
        style.dataset.castellaStyled = className;
        style.textContent = css;
        document.head.appendChild(style);
      }
      styleAdded = true;
    }
    props.className = className;
    return React.createElement(elementName, props, children);
  };
}
