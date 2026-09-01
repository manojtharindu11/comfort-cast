import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/auth/authSlice";

export const AUTH_TOKEN_KEY = "comfort_cast_access_token";

export default function AuthSync() {
  const { isAuthenticated, isLoading, user, error, getAccessTokenSilently } =
    useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      dispatch(loginStart());
      return;
    }

    if (isAuthenticated && user) {
      dispatch(loginSuccess(user));
    } else if (error) {
      dispatch(loginFailure(error.message));
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } else {
      dispatch(loginSuccess(null));
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [isAuthenticated, isLoading, user, error, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return;
    }

    let isActive = true;

    const syncToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        if (isActive) {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        }
      } catch (authError) {
        console.warn("Unable to fetch Auth0 access token:", authError);

        if (isActive) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }
    };

    syncToken();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  return null;
}
