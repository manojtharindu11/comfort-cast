import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import App from "./App.jsx";
import "./index.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

const hasAuth0Config = Boolean(domain && clientId);

const authRoot = (
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <DevAuthFallbackNote />
    </Provider>
  </StrictMode>
);

function DevAuthFallbackNote() {
  if (hasAuth0Config) return null;
  return (
    <p className="text-muted-foreground fixed bottom-2 right-3 text-xs">
      Auth0 not configured — copy .env.example to .env for log in.
    </p>
  );
}

const root = createRoot(document.getElementById("root"));

if (hasAuth0Config) {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience,
          }}
          cacheLocation="localstorage"
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Auth0Provider>
      </Provider>
    </StrictMode>,
  );
} else {
  root.render(authRoot);
}
