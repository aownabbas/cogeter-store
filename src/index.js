import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-responsive-modal/styles.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Store, persistor } from "./store/configureStore";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ScrollToTop from "./components/resuable/scroll-to-top/ScrollToTop";
import { SOCIAL_LOGINS } from "./utils/const";
persistor.purge();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ScrollToTop />
          <GoogleOAuthProvider clientId={SOCIAL_LOGINS.GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
