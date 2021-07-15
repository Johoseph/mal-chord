import axios from "axios";

import { useState, useEffect, useMemo } from "preact/hooks";
import { loginUser, refreshTokens } from "../helpers";

import dayjs from "dayjs";

export const useUser = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let userToken = localStorage.getItem("USER_TOKEN");

    if (userToken) {
      const userTokenExpiry = localStorage.getItem("USER_TOKEN_EXPIRY");

      if (dayjs.unix(userTokenExpiry).isBefore(dayjs())) {
        try {
          refreshTokens(setLoggedIn);
          setLoggedIn(true);
        } catch {
          console.error("Failed to refresh user token.");
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(true);
      }
    } else {
      loginUser(setLoggedIn);
    }
  }, []);

  return { loggedIn };
};

export const useQuery = (route) => {
  const userToken = useMemo(() => localStorage.getItem("USER_TOKEN"), []);
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .post(`${process.env.PREACT_APP_API_URL}/${route}`, {
        userToken,
      })
      .then((res) => setData(res.data));
  }, [route, userToken]);

  return data;
};
