import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

const appArea = document.createElement("div");
document.body.append(appArea);

ReactDOM.render(<App />, appArea);
