import React from "react";
import {
  ServerRenderingCollector as WcServerRenderingCollector,
  ServerRenderingContext as WcServerRenderingContext,
} from "react-wc";

/**
 * Class for collecting styles and scripts needed for SSR.
 */
export class ServerRenderingCollector extends WcServerRenderingCollector {
  readonly styles = new Map<string, string>();

  /**
   * @internal
   */
  addStyle(className: string, css: string) {
    this.styles.set(className, css);
  }

  /**
   * Returns a list of style elements and script elements that are collected by this class.
   */
  getHeadElements(): JSX.Element[] {
    const scripts = super.getHeadElements();
    const result = [];
    for (const [className, css] of this.styles) {
      result.push(
        React.createElement(
          "style",
          {
            key: `castella-styled-${className}`,
            "data-castella-styled": className,
          },
          css
        )
      );
    }
    return result.concat(scripts);
  }
}

export const ServerRenderingContext = WcServerRenderingContext as React.Context<
  ServerRenderingCollector | undefined
>;
