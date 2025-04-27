import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import logger from "redux-logger";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import allReducers from "./reducers/index.js";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./epics/index.js";
import { ToastContainer } from "react-toastify";
import "@mantine/core/styles.css";

const epicmiddleware = createEpicMiddleware();

const store = createStore(
  allReducers,
  applyMiddleware(...[epicmiddleware, logger])
);
// const store = createStore(applyMiddleware(...[epicmiddleware]));

epicmiddleware.run(rootEpic);

const root = createRoot(document.getElementById("root"));

window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

root.render(
  <Provider
    store={store}
    // store={store}
  >
    <ToastContainer
      pauseOnHover={false}
      hideProgressBar
      style={{ zIndex: 999999999 }}
    />
    <App />
  </Provider>
);
