import React, { useState } from "react";
import { range } from "../util/range";
import { AppStyle, Counter, Counters, CounterValue } from "./elements";

export const StyledApp: React.FC = () => {
  const [counter, setCounter] = useState(0);

  return (
    <AppStyle
      header={
        <p>
          <button onClick={() => setCounter((c) => c + 1)}>+1</button>
        </p>
      }
      counter={<CounterValue>{counter}</CounterValue>}
    >
      <Counters>
        {[...range(0, 256)].map((i) => (
          <Counter key={i}>{counter}</Counter>
        ))}
      </Counters>
    </AppStyle>
  );
};
