import { castella, css, html, slot, styled } from "@castella/macro";
import Head from "next/head";

const Layout = castella(
  css`
    display: grid;
    grid-template:
      "t t" auto
      "a m" 1fr / 150px 1fr;
    min-height: 100vh;

    .title {
      font-size: 3em;
      font-weight: bold;
      text-align: center;
      grid-area: t;
      padding: 20px;
    }
    .aside {
      grid-area: a;
      background-color: #eeeeee;
      padding: 16px;
    }
    .main {
      grid-area: m;
      padding: 60px;
      display: flex;
      flex-flow: nowrap row;
      justify-content: center;
      align-items: center;
    }
  `,
  html`
    <div class="title">${slot("title")}</div>
    <div class="aside">${slot("aside")}</div>
    <div class="main">
      <div>${slot()}</div>
    </div>
  `
);

const Aside = () => {
  return (
    <div>
      <p>This is side menu!</p>
    </div>
  );
};

const MainText = styled.div`
  font-weight: bold;
`;

export default function Home() {
  return (
    <Layout title={<h1>Castella + Next.js Example</h1>} aside={<Aside />}>
      <Head>
        <title>Castella + Next.js Example</title>
      </Head>

      <MainText>
        <p>Hello, world!</p>
      </MainText>
    </Layout>
  );
}
