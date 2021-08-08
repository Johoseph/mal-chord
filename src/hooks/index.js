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
  const [svgProps, setSvgProps] = useState();
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

    // Remove z-index on old help element(s)
    if (oldEl.length > 0) oldEl.forEach((el) => (el.style.zIndex = ""));

    if (helpRequired) {
      window.scrollTo(0, 0);

      // Cater for SVG help element
      if (newEl[0].nodeName === "image" || newEl[0].nodeName === "rect") {
        const bound = newEl[0].getBoundingClientRect();

        setSvgProps({
          width: bound.width,
          height: bound.height,
          x: bound.x,
          y: bound.y,
        });
      } else {
        setSvgProps();
      }

      // Add z-index to new help element(s)
      if (newEl) {
        newEl.forEach((el) => (el.style.zIndex = "3"));

        const boundingRect = newEl[0].getBoundingClientRect();
        const classList = Array.from(newEl[0].classList);

        const isLeft = classList.find((cls) => cls.includes("left"));
        const isRight = classList.find((cls) => cls.includes("right"));
        const isTop = classList.find((cls) => cls.includes("top"));
        const isBottom = classList.find((cls) => cls.includes("bottom"));

        setTooltipCoords({
          x: isLeft
            ? boundingRect.left - isLeft.split("-")[1]
            : boundingRect.right +
              (isRight ? parseInt(isRight.split("-")[1], 10) : 10),
          y: isTop
            ? boundingRect.top - isTop.split("-")[1]
            : boundingRect.bottom +
              (isBottom ? parseInt(isBottom.split("-")[1], 10) : 10),
          forceTranslate: {
            x: classList.includes("forceX"),
            y: classList.includes("forceY"),
          },
        });
      }
    } else {
      localStorage.setItem("chord-help", "done");

      // Remove z-index on new help element(s)
      if (newEl.length > 0) newEl.forEach((el) => (el.style.zIndex = ""));

      // Skip intro help items for next time
      setHelpIndex(3);
      setTooltipCoords({ x: undefined, y: undefined });
    }
  }, [helpIndex, helpRequired]);

  const readyToRun = triggerHelp && helpRequired;
  useLockBodyScroll(readyToRun);

  return {
    readyToRun,
    setHelpRequired,
    helpIndex,
    tooltipCoords,
    progressHelp,
    svgProps,
  };
};
