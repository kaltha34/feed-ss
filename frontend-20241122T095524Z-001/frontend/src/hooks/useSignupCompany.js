import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignupCompany = () => {
  const [errorCompany, setErrorCompany] = useState(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(null);
  const { dispatch } = useAuthContext();

  const signupCompany = async (username, password, name, description, website, contactEmail, phoneNumber, qrCode, userType) => {
    setIsLoadingCompany(true);
    setErrorCompany(null);

    const profile = {
      description,
      website,
      contactEmail,
      phoneNumber,
    };

    const response = await fetch("/user/signup-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name, profile, qrCode, userType}),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoadingCompany(false);
      setErrorCompany(json.error);
    }

    if (response.ok) {
      const { company, token, } = json;
      const userData = { username: company.username, token , id: company?._id, userType:company?.userType, email:company?.profile.email};

      localStorage.setItem("user", JSON.stringify(userData));

      dispatch({ type: "LOGIN", payload: userData });

      setIsLoadingCompany(false);
    }
  };

  return { signupCompany, isLoadingCompany, errorCompany };
};
