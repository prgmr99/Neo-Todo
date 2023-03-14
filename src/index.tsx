import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import { RecoilRoot } from "recoil";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <HelmetProvider>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </HelmetProvider>
);
