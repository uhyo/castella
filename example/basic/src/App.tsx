import React, { useState } from "react";
import { CastellaApp } from "./CastellaApp";
import { LinariaApp } from "./LinariaApp";
import { StyledApp } from "./StyledApp";

const modes = ["castella", "linaria", "styled"] as const;

export const App: React.FC = () => {
  const [mode, setMode] = useState<typeof modes[number]>("castella");

  return (
    <div>
      <p>
        Mode{" "}
        <select
          onChange={(e) => setMode(e.currentTarget.value as any)}
          value={mode}
        >
          {modes.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </p>
      {mode === "castella" ? (
        <CastellaApp />
      ) : mode === "linaria" ? (
        <LinariaApp />
      ) : (
        <StyledApp />
      )}
    </div>
  );
};
