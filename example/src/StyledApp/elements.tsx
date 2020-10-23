import React from "react";
import styled from "styled-components";

const AppStyled = styled.div`
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
  <AppStyled>
    <header>{header}</header>
    <p>Counter value is {counter}</p>
    <main>{children}</main>
  </AppStyled>
);

export const CounterValue = styled.span`
  font-weight: bold;
`;

export const Counters = styled.div`
  display: grid;
  grid: auto-flow / repeat(16, 80px);
  gap: 10px;
`;

const CounterStyle = styled.div`
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
  <CounterStyle>
    <div>{children}</div>
  </CounterStyle>
);
