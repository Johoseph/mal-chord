import axios from "axios";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "preact/hooks";
import { loginUser, refreshTokens } from "../helpers";

import dayjs from "dayjs";

export const useUser = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);

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
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");

      if (error) {
        setLoginError(true);
        window.history.replaceState(null, "", process.env.PREACT_APP_BASE_URL);
      } else {
        loginUser(setLoggedIn);
      }
    }
  }, []);

  return { loggedIn, loginError };
};

export const useQuery = (route) => {
  const userToken = useMemo(() => localStorage.getItem("USER_TOKEN"), []);
  const [data, setData] = useState();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState();
  const [shouldRefetch, setShouldRefetch] = useState(true);

  const refetch = () => {
    setData(undefined);
    setStatus("loading");
    setError(undefined);
    setShouldRefetch(!shouldRefetch);
  };

  useEffect(() => {
    axios
      .post(`${process.env.PREACT_APP_API_URL}/${route}`, {
        userToken,
      })
      .then((res) => {
        setData(res.data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [route, userToken, shouldRefetch]);

  return { data, status, error, refetch };
};

export const useSankeyHistory = () => {
  const MAX_HISTORY = 50;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sankeyHistory, setSankeyHistory] = useState([]);

  const writeToHistory = useCallback(
    (itemToWrite) => {
      const localHistory = sankeyHistory;

      if (sankeyHistory.length >= MAX_HISTORY) localHistory.shift();

      setSankeyHistory([
        ...localHistory.filter((e, i) => i < currentIndex),
        itemToWrite,
      ]);
      setCurrentIndex(Math.min(currentIndex + 1, MAX_HISTORY));
    },
    [currentIndex, sankeyHistory]
  );

  return { currentIndex, setCurrentIndex, sankeyHistory, writeToHistory };
};

export const useLockBodyScroll = (isLocked = true) => {
  useLayoutEffect(() => {
    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = originalStyle);
    }
  }, [isLocked]);
};

export const useHelp = (triggerHelp) => {
  const [helpRequired, setHelpRequired] = useState(
    !localStorage.getItem("chord-help")
  );
  const [helpIndex, setHelpIndex] = useState(1);
  const [tooltipCoords, setTooltipCoords] = useState({
    x: undefined,
    y: undefined,
  });

  const progressHelp = useCallback(() => {
    setTooltipCoords({ x: undefined, y: undefined });
    setHelpIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const oldEl = Array.from(
      document.querySelectorAll(`.hlp-${helpIndex - 1}`)
    );
    const newEl = Array.from(document.querySelectorAll(`.hlp-${helpIndex}`));

    if (oldEl.length > 0) oldEl.forEach((el) => (el.style.zIndex = ""));

    if (newEl) {
      newEl.forEach((el) => (el.style.zIndex = "3"));

      const boundingRect = newEl[0].getBoundingClientRect();

      setTooltipCoords({
        x: boundingRect.right + 20,
        y: boundingRect.bottom + 20,
      });
    }
  }, [helpIndex]);

  const readyToRun = triggerHelp && helpRequired;
  useLockBodyScroll(readyToRun);

  return {
    readyToRun,
    setHelpRequired,
    helpIndex,
    tooltipCoords,
    progressHelp,
  };
};
