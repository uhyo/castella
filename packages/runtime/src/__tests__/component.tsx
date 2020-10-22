import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React, { Fragment } from "react";
import { component } from "..";

describe("wc", () => {
  describe("basic", () => {
    it("no slot", () => {
      const Hello = component({
        shadowHtml: `
          <style>
            div {
              font-size: 100px;
            }
          </style>
          <div>Hello</div>
        `,
        slots: [],
        name: "wc-test-1",
      });

      render(<Hello />);

      const el = document.getElementsByTagName("wc-test-1")[0];

      expect(el.shadowRoot?.innerHTML).toMatchSnapshot();
      expect(el.innerHTML).toMatchSnapshot();
    });
    it("one slot", () => {
      const Hello = component({
        shadowHtml: `
          <style>
            div {
              font-size: 100px;
            }
          </style>
          <div><slot></slot></div>
      `,
        slots: [],
        name: "wc-test-foo",
      });

      render(
        <Hello>
          <span>Foobar</span>
        </Hello>
      );

      const el = document.getElementsByTagName("wc-test-foo")[0];

      expect(el.shadowRoot?.innerHTML).toMatchSnapshot();
      expect(el.innerHTML).toMatchSnapshot();
    });
    it("multiple slots", () => {
      const Hello = component({
        shadowHtml: `
        <style>
          div {
            font-size: 100px;
          }
        </style>
        <header><slot name="header"></slot></header>
        <div><slot></slot></div>
        <header><slot name="footer"></slot></header>
      `,
        slots: ["header", "footer"],
        name: "wc-layout",
      });

      render(
        <Hello header={<b>head!</b>} footer="foo!">
          <span>Foobar</span>
        </Hello>
      );

      const el = document.getElementsByTagName("wc-layout")[0];

      expect(el.shadowRoot?.innerHTML).toMatchSnapshot();
      expect(el.innerHTML).toMatchSnapshot();
    });
  });
  describe("Named slot values", () => {
    const Hello = component({
      shadowHtml: `
        <style>
          div {
            font-size: 100px;
          }
        </style>
        <slot name="child"></slot>
      `,
      slots: ["child"],
      name: "wc-test-3",
    });

    it("text", () => {
      render(<Hello child="foobar" />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("number", () => {
      render(<Hello child={123} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("boolean", () => {
      render(<Hello child={true} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("null", () => {
      render(<Hello child={null} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("undefined", () => {
      render(<Hello child={undefined} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("intrinsic element", () => {
      render(<Hello child={<span>Hello</span>} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("function component", () => {
      const Fc: React.FC<{ val: string }> = ({ val }) => <b>val is {val}</b>;
      render(<Hello child={<Fc val="abcde" />} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("nested function component", () => {
      const Fc: React.FC<{ val: string }> = ({ val }) => <b>val is {val}</b>;
      const Fc2: React.FC<{ val: string }> = ({ val }) => (
        <Fc val={val + val + val} />
      );
      render(<Hello child={<Fc2 val="abcde" />} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("reused function component", () => {
      const Fc: React.FC<{ val: string }> = ({ val, children }) =>
        children ? <Fragment>{children}</Fragment> : <b>val is {val}</b>;
      const Fc2: React.FC = () => (
        <Fc val={"abc"}>
          <Fc val="def" />
        </Fc>
      );
      render(<Hello child={<Fc2 />} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("class component", () => {
      class Cc extends React.Component<{ val: string }> {
        render() {
          return <b>val is {this.props.val}</b>;
        }
      }
      render(<Hello child={<Cc val="aaaaa" />} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("nested class component", () => {
      class Cc extends React.Component<{ val: string }> {
        render() {
          return <b>val is {this.props.val}</b>;
        }
      }
      class Cc2 extends React.Component<{ val: string }> {
        render() {
          const val = this.props.val;
          return <Cc val={val + val + val} />;
        }
      }
      render(<Hello child={<Cc2 val="aaaaa" />} />);

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });
    it("fragment", () => {
      const Fc: React.FC<{ val: string }> = ({ val }) => <b>val is {val}</b>;
      class Cc extends React.Component<{ val: string }> {
        render() {
          return <b>val is {this.props.val}</b>;
        }
      }

      render(
        <Hello
          child={
            <Fragment>
              Hi
              <b>Hello</b>
              <Fc val="foobar" />
              <Cc val="wow" />
            </Fragment>
          }
        />
      );

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });
    it("array", () => {
      const Fc: React.FC<{ val: string }> = ({ val }) => <b>val is {val}</b>;
      class Cc extends React.Component<{ val: string }> {
        render() {
          return <b>val is {this.props.val}</b>;
        }
      }

      render(
        <Hello
          child={[
            <b key="a">Hello</b>,
            <Fc key="b" val="foobar" />,
            <Cc key="c" val="wow" />,
          ]}
        />
      );

      const el = document.getElementsByTagName("wc-test-3")[0];

      expect(el.innerHTML).toMatchSnapshot();
    });
  });
});
