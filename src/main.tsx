import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { AppProvider } from "./components/AppProvider.js";
// import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
    <AppProvider>
      <App />
    </AppProvider>
    {/* </BrowserRouter> */}
  </React.StrictMode>
);
