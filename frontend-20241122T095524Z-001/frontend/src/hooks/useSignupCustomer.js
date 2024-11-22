import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignupCustomer = () => {
  const [errorCustomer, setErrorCustomer] = useState(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(null);
  const { dispatch } = useAuthContext();

  const signupCustomer = async (
    fullName,
    email,
    phoneNumber,
    userType,
    username,
    password
  ) => {
    setIsLoadingCustomer(true);
    setErrorCustomer(null);

    const response = await fetch("/user/signup-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        phoneNumber,
        userType,
        username,
        password,
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoadingCustomer(false);
      setErrorCustomer(json.error);
    }

    if (response.ok) {
        
      const { customer, token } = json;
      const userData = { username: customer.username, token , id: customer?._id ,userType:customer?.userType , email:customer?.email };

      localStorage.setItem("user", JSON.stringify(userData));

      dispatch({ type: "LOGIN", payload: userData });

      setIsLoadingCustomer(false);
    }
  };

  return { signupCustomer, isLoadingCustomer, errorCustomer };
};
