import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  // the time in the fresh state is two minutes, but it is possible that it is better for the user to always have everything in the stale state,
  //  so he will not be able to go to an already deleted post or see some posts later than others
  defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } },
});
const root = ReactDOM.createRoot(document.getElementById("root"));
const isProduction = process.env.NODE_ENV
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        { isProduction === "development" ? <ReactQueryDevtools /> : null}
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
