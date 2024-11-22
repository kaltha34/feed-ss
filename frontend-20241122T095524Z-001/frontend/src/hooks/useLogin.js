import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (url, username, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password}),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      const user = json.customer || json.company;
      const userData = { username: user?.username, token: json.token, id: user?._id, userType:user?.userType, email:user?.email };

      localStorage.setItem("user", JSON.stringify(userData));

      dispatch({ type: "LOGIN", payload: userData });

      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
