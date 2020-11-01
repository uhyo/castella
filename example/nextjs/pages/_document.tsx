import { ServerRenderingCollector } from "@castella/runtime";
import Document, { DocumentContext } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    const collector = new ServerRenderingCollector();

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => collector.wrap(<App {...props} />),
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {collector.getHeadElements()}
        </>
      ),
    };
  }
}

export default MyDocument;
