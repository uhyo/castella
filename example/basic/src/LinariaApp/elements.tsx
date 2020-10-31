import { css } from "linaria";
import { styled } from "linaria/react";
import React from "react";

const app = css`
  & > header {
    border: 1px solid #cccccc;
    padding: 4px;
  }
  & > p {
    border-bottom: 1px dashed #999999;
  }
`;
export const AppStyle: React.FunctionComponent<{
  header: React.ReactElement | null;
  counter: React.ReactElement | null;
}> = ({ header, counter, children }) => (
  <div className={app}>
    <header>{header}</header>
    <p>Counter value is {counter}</p>
    <main>{children}</main>
  </div>
);

export const CounterValue = styled.span`
  font-weight: bold;
`;

const counters = css`
  display: grid;
  grid: auto-flow / repeat(16, 80px);
  gap: 10px;
`;

export const Counters: React.FC = ({ children }) => (
  <div className={counters}>{children}</div>
);

const counter = css`
  display: flex;
  flex-flow: nowrap row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  border: 1px solid #cccccc;
  padding: 2px;
  font-size: 1.5em;
`;

export const Counter: React.FC = ({ children }) => (
  <div className={counter}>
    <div>{children}</div>
  </div>
);
