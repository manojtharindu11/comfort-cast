import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import authReducer from "../features/auth/authSlice";

// Feature API files (weatherApi, debugApi) import `api` and inject their
// endpoints into it, so wiring in the store is one line.
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // RTK Query: all server-backed data
    auth: authReducer, // regular slice: client-side auth session state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
